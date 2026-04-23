<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NowPaymentsService
{
    private string $apiKey;
    private string $ipnSecret;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = (string) config('services.nowpayments.api_key');
        $this->ipnSecret = (string) config('services.nowpayments.ipn_secret');
        $this->baseUrl = rtrim((string) config('services.nowpayments.base_url'), '/');
    }

    /**
     * Create a hosted invoice. The user is redirected to invoice_url, picks
     * their stablecoin (USDT TRC-20 / ERC-20 etc.) and chain on NOWPayments,
     * then we get notified via IPN.
     *
     * @param array{order_id:string,amount:float|int|string,currency:string,description?:string,success_url?:string,cancel_url?:string,ipn_callback_url?:string} $data
     */
    public function createInvoice(array $data): array
    {
        if ($this->apiKey === '') {
            return ['success' => false, 'message' => 'NOWPayments API key is not configured'];
        }

        $payload = [
            'price_amount' => (float) $data['amount'],
            'price_currency' => strtolower($data['currency']),
            'order_id' => $data['order_id'],
            'order_description' => $data['description'] ?? 'Edatsu Media subscription',
            'ipn_callback_url' => $data['ipn_callback_url'] ?? null,
            'success_url' => $data['success_url'] ?? null,
            'cancel_url' => $data['cancel_url'] ?? null,
            'is_fixed_rate' => true,
            'is_fee_paid_by_user' => false,
        ];

        try {
            $response = Http::timeout(20)
                ->withHeaders([
                    'x-api-key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post($this->baseUrl . '/invoice', array_filter($payload, fn ($v) => $v !== null));

            if ($response->successful()) {
                $body = $response->json();
                return [
                    'success' => true,
                    'invoice_id' => $body['id'] ?? null,
                    'invoice_url' => $body['invoice_url'] ?? null,
                    'data' => $body,
                ];
            }

            Log::error('NOWPayments createInvoice failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return ['success' => false, 'message' => 'Could not create crypto invoice', 'status' => $response->status()];
        } catch (\Throwable $e) {
            Log::error('NOWPayments createInvoice exception', ['error' => $e->getMessage()]);
            return ['success' => false, 'message' => 'Crypto provider unreachable'];
        }
    }

    /**
     * Look up a payment by id. Used by the success_url page to poll status
     * until the IPN arrives, and as a fallback if the IPN is delayed.
     */
    public function getPayment(string $paymentId): array
    {
        try {
            $response = Http::timeout(15)
                ->withHeaders(['x-api-key' => $this->apiKey])
                ->get($this->baseUrl . '/payment/' . $paymentId);

            if ($response->successful()) {
                return ['success' => true, 'data' => $response->json()];
            }

            return ['success' => false, 'status' => $response->status(), 'body' => $response->body()];
        } catch (\Throwable $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Verify an IPN payload using HMAC-SHA512 over the JSON body sorted by
     * key (NOWPayments' documented signing scheme).
     */
    public function verifyIpnSignature(string $rawBody, ?string $signatureHeader): bool
    {
        if ($this->ipnSecret === '' || empty($signatureHeader)) {
            return false;
        }

        $payload = json_decode($rawBody, true);
        if (!is_array($payload)) {
            return false;
        }

        ksort($payload);
        $sortedJson = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $expected = hash_hmac('sha512', $sortedJson, $this->ipnSecret);

        return hash_equals($expected, $signatureHeader);
    }
}
