<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GirostackService
{
    protected string $baseUrl;
    protected string $secretKey;
    protected string $destinationAccount;
    protected string $accountName;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.girostack.base_url', 'https://gw.prod.girostack.com/v1'), '/');
        $this->secretKey = (string) (config('services.girostack.secret_key') ?? '');
        $this->destinationAccount = (string) (config('services.girostack.destination_account') ?? '');
        $this->accountName = (string) (config('services.girostack.account_name', 'Edatsu Media'));
    }

    /**
     * Create a disposable virtual collection account (default 30 min TTL).
     * Girostack settles credits to the parent destination VBA configured in env.
     *
     * Required: amount (NGN, MAJOR units e.g. 14500.00 = ₦14,500). Optional:
     * account_name override, expire_in seconds.
     *
     * Important unit detail: Girostack stores amounts as the last 2 digits being
     * the decimal portion (i.e. 10000 = ₦100.00). We accept major-unit NGN at
     * the service boundary and convert to minor units when calling the API,
     * then convert back on the response so callers never see kobo.
     */
    public function createCollectionAccount(array $data): array
    {
        $amountMajor = (float) $data['amount'];
        $amountMinor = (int) round($amountMajor * 100);

        $payload = [
            'destination' => $this->destinationAccount,
            'accountName' => $data['account_name'] ?? $this->accountName,
            'amount' => $amountMinor,
            'expireIn' => (int) ($data['expire_in'] ?? 1800),
        ];

        $response = Http::withHeaders([
            'x-giro-key' => $this->secretKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/collection-accounts", $payload);

        $body = $response->json();
        $accountData = $body['data'] ?? null;

        if ($response->successful() && ($body['meta']['success'] ?? false) && $accountData) {
            return [
                'success' => true,
                'account_number' => $accountData['accountNumber'] ?? null,
                'bank_name' => $accountData['bankName'] ?? null,
                // Echo the major-unit value the caller asked for so the UI
                // displays ₦14,500 not 1,450,000.
                'amount' => $amountMajor,
                'expires_at' => $accountData['expiration'] ?? null,
                'reference' => $accountData['reference'] ?? null,
                'public_id' => $accountData['publicId'] ?? null,
                // `account` is the stable internal ID Girostack echoes on
                // every event for this collection account — primary match key
                // for the webhook handler.
                'account' => $accountData['account'] ?? null,
                'raw' => $accountData,
            ];
        }

        Log::error('Girostack collection-account creation failed', [
            'status' => $response->status(),
            'response' => $body,
        ]);

        return [
            'success' => false,
            'message' => $body['meta']['message'] ?? 'Could not generate virtual account',
        ];
    }

    /**
     * Verify webhook authenticity. Girostack signs the raw JSON body with
     * HMAC-SHA512 using our secret key, sent as x-giro-signature.
     * Use hash_equals to avoid timing attacks.
     */
    public function verifyWebhookSignature(string $rawBody, ?string $signature): bool
    {
        if (!$signature || $this->secretKey === '') {
            return false;
        }
        $expected = hash_hmac('sha512', $rawBody, $this->secretKey);
        return hash_equals($expected, $signature);
    }
}
