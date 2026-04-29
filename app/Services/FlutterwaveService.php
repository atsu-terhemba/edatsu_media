<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FlutterwaveService
{
    protected string $baseUrl;
    protected string $secretKey;
    protected string $publicKey;

    public function __construct()
    {
        $this->baseUrl = config('services.flutterwave.base_url', 'https://api.flutterwave.com/v3');
        $this->secretKey = config('services.flutterwave.secret_key') ?? '';
        $this->publicKey = config('services.flutterwave.public_key') ?? '';
    }

    /**
     * Initialize a payment and get a hosted payment link
     */
    public function initializePayment(array $data): array
    {
        $payload = [
            'tx_ref' => $data['tx_ref'],
            'amount' => $data['amount'],
            'currency' => $data['currency'],
            'redirect_url' => $data['redirect_url'],
            'customer' => [
                'email' => $data['email'],
                'name' => $data['name'],
            ],
            'customizations' => [
                'title' => 'Edatsu Media Subscription',
                'description' => $data['description'] ?? 'Pro subscription payment',
                'logo' => url('/images/logo.png'),
            ],
            'payment_options' => $data['payment_options'] ?? 'card,banktransfer',
            'meta' => $data['meta'] ?? [],
        ];

        $response = Http::withToken($this->secretKey)
            ->post("{$this->baseUrl}/payments", $payload);

        if ($response->successful() && $response->json('status') === 'success') {
            return [
                'success' => true,
                'payment_url' => $response->json('data.link'),
            ];
        }

        Log::error('Flutterwave payment init failed', [
            'response' => $response->json(),
            'status' => $response->status(),
        ]);

        return [
            'success' => false,
            'message' => $response->json('message', 'Payment initialization failed'),
        ];
    }

    /*
     * Disabled: NGN bank transfers are now handled by GirostackService.
     * Kept commented (not deleted) so we can re-enable Flutterwave virtual
     * accounts in the future without rewriting the integration.
     *
     * public function chargeBankTransfer(array $data): array
     * {
     *     $payload = [
     *         'tx_ref' => $data['tx_ref'],
     *         'amount' => $data['amount'],
     *         'email' => $data['email'],
     *         'currency' => $data['currency'] ?? 'NGN',
     *         'fullname' => $data['name'] ?? $data['email'],
     *         'narration' => $data['narration'] ?? 'Edatsu Media Subscription',
     *         'is_permanent' => false,
     *         'meta' => $data['meta'] ?? [],
     *     ];
     *
     *     $response = Http::withToken($this->secretKey)
     *         ->post("{$this->baseUrl}/charges?type=bank_transfer", $payload);
     *
     *     $authorization = $response->json('meta.authorization');
     *
     *     if ($response->successful() && $response->json('status') === 'success' && $authorization) {
     *         return [
     *             'success' => true,
     *             'account_number' => $authorization['transfer_account'] ?? null,
     *             'bank_name' => $authorization['transfer_bank'] ?? null,
     *             'amount' => $authorization['transfer_amount'] ?? $data['amount'],
     *             'expires_at' => $authorization['account_expiration'] ?? null,
     *             'reference' => $authorization['transfer_reference'] ?? null,
     *         ];
     *     }
     *
     *     Log::error('Flutterwave bank transfer charge failed', [
     *         'response' => $response->json(),
     *         'status' => $response->status(),
     *     ]);
     *
     *     return [
     *         'success' => false,
     *         'message' => $response->json('message', 'Could not generate virtual account'),
     *     ];
     * }
     */

    /**
     * Verify a transaction by its ID
     */
    public function verifyTransaction(string $transactionId): array
    {
        $response = Http::withToken($this->secretKey)
            ->get("{$this->baseUrl}/transactions/{$transactionId}/verify");

        if ($response->successful() && $response->json('status') === 'success') {
            return [
                'success' => true,
                'data' => $response->json('data'),
            ];
        }

        Log::error('Flutterwave verification failed', [
            'transaction_id' => $transactionId,
            'response' => $response->json(),
        ]);

        return [
            'success' => false,
            'message' => $response->json('message', 'Verification failed'),
        ];
    }

    /**
     * Validate webhook signature
     */
    public function validateWebhook(string $signature): bool
    {
        $webhookHash = config('services.flutterwave.webhook_hash');
        return $webhookHash && hash_equals($webhookHash, $signature);
    }
}
