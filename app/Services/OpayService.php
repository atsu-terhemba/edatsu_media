<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Opay bank-transfer integration. Exposes the same public surface as
 * GirostackService so SubscriptionController can switch providers based on a
 * `bank_provider` request param without further branching.
 *
 * SCAFFOLD STATUS — endpoint paths, payload shape, and signature header are
 * BEST-GUESS based on Opay Cashier API public docs. Once a real merchant
 * account is provisioned, verify and adjust the four TODO blocks below
 * against the merchant dashboard's developer reference.
 */
class OpayService
{
    protected string $baseUrl;
    protected string $merchantId;
    protected string $publicKey;
    protected string $privateKey;
    protected string $merchantName;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.opay.base_url', 'https://liveapi.opaycheckout.com'), '/');
        $this->merchantId = (string) (config('services.opay.merchant_id') ?? '');
        $this->publicKey = (string) (config('services.opay.public_key') ?? '');
        $this->privateKey = (string) (config('services.opay.private_key') ?? '');
        $this->merchantName = (string) (config('services.opay.merchant_name', 'Edatsu Media'));
    }

    /**
     * Returns true once the four required env vars are populated. The
     * controller checks this before routing to Opay so users don't see a
     * confusing "Could not generate virtual account" while creds are missing.
     */
    public function isConfigured(): bool
    {
        return $this->merchantId !== ''
            && $this->publicKey !== ''
            && $this->privateKey !== '';
    }

    /**
     * Create a one-time payment intent that tells the user "transfer to this
     * NUBAN, this name, before this time". Mirrors the shape returned by
     * GirostackService::createCollectionAccount so the controller doesn't care
     * which provider it spoke to.
     *
     * Required: amount (NGN, MAJOR units e.g. 14500.00 = ₦14,500),
     *           reference (our internal tx_ref — used as the merchant orderNo).
     * Optional: account_name override, expire_in seconds (default 1800).
     *
     * Opay (like most NG providers) uses MINOR units on the wire — we convert
     * at the boundary so callers always deal in major-unit NGN.
     */
    public function createCollectionAccount(array $data): array
    {
        $amountMajor = (float) $data['amount'];
        $amountMinor = (int) round($amountMajor * 100);
        $reference = (string) ($data['reference'] ?? '');
        $expireIn = (int) ($data['expire_in'] ?? 1800);

        // TODO(opay-creds): confirm exact endpoint path. Two known candidates:
        //   - Cashier "create" + payMethod=BankTransfer:
        //       POST {base}/api/v1/international/cashier/create
        //   - Direct "BankAccount":
        //       POST {base}/api/v1/international/payment/create
        // Pick whichever the dashboard exposes for "dynamic virtual account".
        $endpoint = '/api/v1/international/cashier/create';

        // TODO(opay-creds): confirm payload field names. The shape below is
        // the documented Cashier API request; the dashboard reference will
        // show the exact keys for whichever product is enabled on the
        // merchant account.
        $payload = [
            'country' => 'NG',
            'reference' => $reference,
            'amount' => [
                'total' => $amountMinor,
                'currency' => 'NGN',
            ],
            'callbackUrl' => url('/webhook/opay'),
            'returnUrl' => url('/billing'),
            'expireAt' => $expireIn / 60, // minutes; some Opay endpoints use seconds — verify.
            'payMethod' => 'BankTransfer',
            'productList' => [[
                'productId' => 'edatsu-pro',
                'name' => 'Edatsu Pro Subscription',
                'description' => $data['description'] ?? 'Edatsu Pro Subscription',
                'price' => $amountMinor,
                'quantity' => 1,
            ]],
            'userInfo' => [
                'userName' => $data['account_name'] ?? $this->merchantName,
            ],
        ];

        // TODO(opay-creds): verify auth header. Opay Cashier uses
        //   Authorization: Bearer <publicKey>
        //   MerchantId: <merchantId>
        // but some products require a request signature header instead.
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->publicKey,
            'MerchantId' => $this->merchantId,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post($this->baseUrl . $endpoint, $payload);

        $body = $response->json() ?? [];
        $opayData = $body['data'] ?? null;

        // Opay returns code "00000" for success. Treat anything else as failure
        // and log the response so we can debug against the dashboard.
        $okCode = ($body['code'] ?? null) === '00000';

        if ($response->successful() && $okCode && $opayData) {
            // TODO(opay-creds): confirm field names on the response. The
            // dynamic-account product returns something like
            // bankAccount.{accountNumber, bankName, accountName, expiredTime}.
            $bankAccount = $opayData['bankAccount']
                ?? $opayData['vbaInfo']
                ?? $opayData;

            return [
                'success' => true,
                'account_number' => $bankAccount['accountNumber'] ?? null,
                'bank_name' => $bankAccount['bankName'] ?? null,
                'amount' => $amountMajor,
                'expires_at' => $bankAccount['expiredTime']
                    ?? $bankAccount['expiration']
                    ?? null,
                // orderNo is the stable Opay-side ID echoed on every webhook
                // event for this payment — primary match key for the webhook
                // handler, equivalent to Girostack's `account` field.
                'reference' => $opayData['orderNo'] ?? $reference,
                'public_id' => $opayData['orderNo'] ?? null,
                'account' => $opayData['orderNo'] ?? null,
                'raw' => $opayData,
            ];
        }

        Log::error('Opay collection-account creation failed', [
            'status' => $response->status(),
            'response' => $body,
        ]);

        return [
            'success' => false,
            'message' => $body['message'] ?? 'Could not generate Opay virtual account',
        ];
    }

    /**
     * Verify webhook authenticity. Opay signs the raw JSON body with HMAC
     * using the merchant private key.
     *
     * TODO(opay-creds): confirm
     *   - hash algorithm (sha512 vs sha256 vs sha3-512)
     *   - signed payload (raw body vs canonical JSON of `payload` field)
     *   - header name (commonly `Authorization` with sig= scheme, or a
     *     custom `Signature` / `x-opay-signature`).
     * We default to HMAC-SHA512 over the raw body — the dashboard's webhook
     * test tool will tell you immediately if this is wrong (signature 401s).
     */
    public function verifyWebhookSignature(string $rawBody, ?string $signature): bool
    {
        if (!$signature || $this->privateKey === '') {
            return false;
        }
        $expected = hash_hmac('sha512', $rawBody, $this->privateKey);
        return hash_equals($expected, $signature);
    }
}
