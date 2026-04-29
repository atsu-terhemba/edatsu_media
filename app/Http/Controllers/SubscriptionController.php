<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\MailSubscriptionModel;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Services\FlutterwaveService;
use App\Services\GirostackService;
use App\Services\NowPaymentsService;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    protected FlutterwaveService $flutterwave;
    protected NowPaymentsService $nowPayments;
    protected GirostackService $girostack;

    public function __construct(FlutterwaveService $flutterwave, NowPaymentsService $nowPayments, GirostackService $girostack)
    {
        $this->flutterwave = $flutterwave;
        $this->nowPayments = $nowPayments;
        $this->girostack = $girostack;
    }

    // Show the subscription/pricing page
    public function show()
    {
        return Inertia::render('Subscription', [
            'plans' => $this->buildPlansPayload(),
        ]);
    }

    // Show upgrade plan page with user's current subscription status
    public function showUpgrade()
    {
        $user = Auth::user();
        $activeSubscription = $user ? $user->activeSubscription()->with('plan')->first() : null;

        return Inertia::render('Upgrade', [
            'activeSubscription' => $activeSubscription,
            'currentPlan' => $activeSubscription ? $activeSubscription->plan->slug : 'free',
            'plans' => $this->buildPlansPayload(),
        ]);
    }

    /**
     * Build the plan list payload for the pricing/upgrade pages.
     * Source of truth is the subscription_plans table; no hardcoded prices.
     */
    protected function buildPlansPayload(): array
    {
        return SubscriptionPlan::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->slug,
                'name' => $p->name,
                'description' => $p->description,
                'price' => [
                    'monthly' => [
                        'USD' => (float) $p->price_monthly_usd,
                        'NGN' => (float) $p->price_monthly_ngn,
                    ],
                    'yearly' => [
                        'USD' => (float) $p->price_yearly_usd,
                        'NGN' => (float) $p->price_yearly_ngn,
                    ],
                ],
                'features' => $p->features ?? [],
                'limitations' => $p->limitations ?? [],
                'popular' => (bool) $p->is_popular,
            ])
            ->values()
            ->toArray();
    }

    // Handle the newsletter subscription request
    public function mail_subscription(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:mail_subscribers,email',
        ], [
            'first_name.required' => 'First name is required',
            'first_name.string' => 'First name must be a valid text',
            'first_name.max' => 'First name cannot exceed 255 characters',
            'last_name.required' => 'Last name is required',
            'last_name.string' => 'Last name must be a valid text',
            'last_name.max' => 'Last name cannot exceed 255 characters',
            'email.required' => 'Email address is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email is already subscribed to our newsletter',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'first_error' => $validator->errors()->first()
            ], 422);
        }

        if (MailSubscriptionModel::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Email already subscribed!',
                'success' => false,
            ], 409);
        }

        MailSubscriptionModel::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'subscription_type' => $request->subscription_type,
        ]);

        try {
            Mail::send('emails.newsletter-welcome', [
                'firstName' => $request->first_name,
                'email' => $request->email,
                'appUrl' => config('app.url'),
            ], function ($mail) use ($request) {
                $mail->to($request->email, trim($request->first_name . ' ' . $request->last_name))
                     ->subject("You're on the list — Edatsu Media");
            });
        } catch (\Throwable $e) {
            Log::warning('Newsletter welcome mail failed: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Subscription successful!',
            'success' => true,
        ], 200);
    }

    /**
     * Initiate a subscription payment via Flutterwave
     */
    public function initiatePayment(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|string',
            'billing_period' => 'required|in:monthly,yearly',
            'currency' => 'required|in:NGN,USD',
            'payment_provider' => 'required|in:flutterwave,nowpayments',
            'payment_method' => 'nullable|in:card,banktransfer,crypto',
        ]);

        // Stablecoin payments are USD-priced only; reject mismatched currency early
        // so the user gets a clear error instead of an opaque provider failure.
        if ($request->payment_provider === 'nowpayments' && $request->currency !== 'USD') {
            return response()->json([
                'success' => false,
                'message' => 'Stablecoin payments are only available in USD. Switch the currency to USD and try again.',
            ], 422);
        }

        $user = Auth::user();

        // Serialize concurrent initiate calls per-user so double-clicks + tab races
        // can't stack up pending subscriptions or charge the user twice.
        $lock = Cache::lock("subscription-init-user-{$user->id}", 10);
        if (!$lock->get()) {
            return response()->json([
                'success' => false,
                'message' => 'Another payment is being set up for your account. Please wait a moment and try again.',
            ], 429);
        }

        try {
            if ($user->isPro()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an active Pro subscription.',
                ], 400);
            }

            $plan = SubscriptionPlan::where('slug', $request->plan_id)
                ->where('is_active', true)
                ->first();

            if (!$plan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid plan selected.',
                ], 404);
            }

            $amount = $plan->getPrice($request->billing_period, $request->currency);

            if ($amount <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'This plan does not require payment.',
                ], 400);
            }

            // NOWPayments has per-chain network-fee minimums (lowest is TRC-20 USDT
            // around $5–10). Charging less than 10 USD risks the invoice being
            // rejected at the chain selection step with an unhelpful error, so we
            // gate it here and ask the user to pick the yearly plan instead.
            if ($request->payment_provider === 'nowpayments' && (float) $amount < 10) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stablecoin payments require a minimum of $10. Switch to the yearly plan to pay with USDT.',
                ], 422);
            }

            // Cancel any prior pending subscriptions/transactions for this user so we
            // never have more than one in-flight payment. This also protects the
            // webhook path, which activates the first matching `status=pending` row.
            $this->abandonPendingForUser($user->id);

            $txRef = 'EDATSU-' . strtoupper(Str::random(12)) . '-' . time();

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'reference' => $txRef,
                'payment_provider' => $request->payment_provider,
                'amount' => $amount,
                'currency' => $request->currency,
                'status' => 'pending',
                'type' => 'subscription',
                'description' => "{$plan->name} plan - {$request->billing_period} ({$request->currency})",
            ]);

            $subscription = Subscription::create([
                'user_id' => $user->id,
                'subscription_plan_id' => $plan->id,
                'billing_period' => $request->billing_period,
                'currency' => $request->currency,
                'amount' => $amount,
                'status' => 'pending',
                'payment_provider' => $request->payment_provider,
            ]);

            $transaction->update(['subscription_id' => $subscription->id]);

            if ($request->payment_provider === 'nowpayments') {
                $result = $this->nowPayments->createInvoice([
                    'order_id' => $txRef,
                    'amount' => $amount,
                    'currency' => $request->currency,
                    'description' => "Edatsu Media {$plan->name} ({$request->billing_period})",
                    'ipn_callback_url' => route('subscription.nowpayments_webhook'),
                    'success_url' => route('subscription.callback') . '?provider=nowpayments&order_id=' . $txRef,
                    'cancel_url' => route('subscription') . '?cancelled=1',
                ]);

                if ($result['success'] && !empty($result['invoice_url'])) {
                    return response()->json([
                        'success' => true,
                        'payment_url' => $result['invoice_url'],
                    ]);
                }
            } else {
                $result = $this->flutterwave->initializePayment([
                    'tx_ref' => $txRef,
                    'amount' => $amount,
                    'currency' => $request->currency,
                    'redirect_url' => route('subscription.callback'),
                    'email' => $user->email,
                    'name' => $user->name,
                    'description' => "Edatsu Media #U{$user->id}",
                    'payment_options' => $request->payment_method ?? 'card,banktransfer',
                    'meta' => [
                        'user_id' => $user->id,
                        'plan_id' => $plan->id,
                        'subscription_id' => $subscription->id,
                        'billing_period' => $request->billing_period,
                    ],
                ]);

                if ($result['success']) {
                    return response()->json([
                        'success' => true,
                        'payment_url' => $result['payment_url'],
                    ]);
                }
            }

            $transaction->update(['status' => 'failed']);
            $subscription->delete();

            return response()->json([
                'success' => false,
                'message' => $result['message'] ?? 'Could not initialize payment. Please try again.',
            ], 500);
        } finally {
            $lock->release();
        }
    }

    /**
     * Generate a one-time virtual account for bank transfer payment.
     * The account number/bank/expiry are shown inline on our page;
     * activation happens when the webhook fires after the user transfers.
     */
    public function initiateBankTransfer(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|string',
            'billing_period' => 'required|in:monthly,yearly',
            'currency' => 'required|in:NGN',
        ]);

        $user = Auth::user();

        // Serialize per-user so double-taps on "Bank transfer" don't spawn
        // parallel virtual accounts (each would be a separate charge if paid).
        $lock = Cache::lock("subscription-init-user-{$user->id}", 10);
        if (!$lock->get()) {
            return response()->json([
                'success' => false,
                'message' => 'Another payment is being set up for your account. Please wait a moment and try again.',
            ], 429);
        }

        try {
            if ($user->isPro()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an active Pro subscription.',
                ], 400);
            }

            $plan = SubscriptionPlan::where('slug', $request->plan_id)
                ->where('is_active', true)
                ->first();

            if (!$plan) {
                return response()->json(['success' => false, 'message' => 'Invalid plan.'], 404);
            }

            $amount = $plan->getPrice($request->billing_period, $request->currency);

            if ($amount <= 0) {
                return response()->json(['success' => false, 'message' => 'This plan does not require payment.'], 400);
            }

            $this->abandonPendingForUser($user->id);

            $txRef = 'EDATSU-' . strtoupper(Str::random(12)) . '-' . time();

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'reference' => $txRef,
                'payment_provider' => 'girostack',
                'payment_method' => 'banktransfer',
                'amount' => $amount,
                'currency' => $request->currency,
                'status' => 'pending',
                'type' => 'subscription',
                'description' => "{$plan->name} plan - {$request->billing_period} ({$request->currency})",
            ]);

            $subscription = Subscription::create([
                'user_id' => $user->id,
                'subscription_plan_id' => $plan->id,
                'billing_period' => $request->billing_period,
                'currency' => $request->currency,
                'amount' => $amount,
                'status' => 'pending',
                'payment_provider' => 'girostack',
            ]);

            $transaction->update(['subscription_id' => $subscription->id]);

            $result = $this->girostack->createCollectionAccount([
                'amount' => $amount,
                'expire_in' => 1800,
                'account_name' => $user->name ?: config('services.girostack.account_name'),
            ]);

            if ($result['success']) {
                // Persist the giro `account` (internal ID) — every credit event
                // for this collection account echoes it, so it's our match key.
                // Other identifiers are kept in provider_response as a fallback.
                $transaction->update([
                    'provider_reference' => $result['account'] ?? $result['public_id'] ?? $result['reference'],
                    'provider_response' => [
                        'account' => $result['account'],
                        'account_number' => $result['account_number'],
                        'bank_name' => $result['bank_name'],
                        'reference' => $result['reference'],
                        'public_id' => $result['public_id'],
                        'expires_at' => $result['expires_at'],
                        'created' => $result['raw'] ?? null,
                    ],
                ]);

                return response()->json([
                    'success' => true,
                    'tx_ref' => $txRef,
                    'account_number' => $result['account_number'],
                    'bank_name' => $result['bank_name'],
                    'amount' => $result['amount'],
                    'expires_at' => $result['expires_at'],
                ]);
            }

            $transaction->update(['status' => 'failed']);
            $subscription->delete();

            return response()->json([
                'success' => false,
                'message' => $result['message'] ?? 'Could not generate virtual account. Please try again.',
            ], 500);
        } finally {
            $lock->release();
        }
    }

    /**
     * Mark any in-flight (pending) subscriptions and their transactions as
     * closed-out so a new payment flow starts from a clean slate. Idempotent.
     * Uses the existing status enums: subscription→cancelled (never activated),
     * transaction→failed (never captured).
     */
    protected function abandonPendingForUser(int $userId): void
    {
        $pendingSubs = Subscription::where('user_id', $userId)
            ->where('status', 'pending')
            ->pluck('id');

        if ($pendingSubs->isEmpty()) {
            return;
        }

        Transaction::whereIn('subscription_id', $pendingSubs)
            ->where('status', 'pending')
            ->update(['status' => 'failed', 'updated_at' => now()]);

        Subscription::whereIn('id', $pendingSubs)
            ->where('status', 'pending')
            ->update(['status' => 'cancelled', 'cancelled_at' => now(), 'updated_at' => now()]);
    }

    /**
     * Poll endpoint for the bank transfer panel — returns current status
     * of a pending transaction so the frontend knows when to redirect.
     */
    public function checkStatus(Request $request, string $txRef)
    {
        $transaction = Transaction::where('reference', $txRef)
            ->where('user_id', Auth::id())
            ->first();

        if (!$transaction) {
            return response()->json(['status' => 'not_found'], 404);
        }

        return response()->json([
            'status' => $transaction->status,
        ]);
    }

    /**
     * Handle Flutterwave payment callback (redirect after payment)
     */
    public function handleCallback(Request $request)
    {
        $status = $request->query('status');
        $txRef = $request->query('tx_ref');
        $transactionId = $request->query('transaction_id');

        if ($status === 'cancelled') {
            // User cancelled payment
            $transaction = Transaction::where('reference', $txRef)->first();
            if ($transaction) {
                $transaction->update(['status' => 'failed']);
                $subscription = $transaction->subscription;
                if ($subscription && $subscription->status === 'pending') {
                    $subscription->delete();
                }
            }

            return redirect()->route('subscription')->with('error', 'Payment was cancelled.');
        }

        if ($status === 'successful' && $transactionId) {
            // Verify the transaction with Flutterwave
            $verification = $this->flutterwave->verifyTransaction($transactionId);

            if ($verification['success']) {
                $data = $verification['data'];
                $transaction = Transaction::where('reference', $data['tx_ref'])->first();

                if ($transaction && $this->validatePayment($transaction, $data)) {
                    $this->activateSubscription($transaction, $data);

                    return redirect()->route('subscriber.billing')->with('success', 'Payment successful! Your Pro subscription is now active.');
                }
            }
        }

        return redirect()->route('subscription')->with('error', 'Payment verification failed. If you were charged, please contact support.');
    }

    /**
     * Handle Flutterwave webhook notifications
     */
    public function handleWebhook(Request $request)
    {
        // Validate webhook signature
        $signature = $request->header('verif-hash');
        if (!$this->flutterwave->validateWebhook($signature ?? '')) {
            Log::warning('Invalid Flutterwave webhook signature');
            return response()->json(['status' => 'error'], 401);
        }

        $payload = $request->all();
        $event = $payload['event'] ?? null;

        if ($event === 'charge.completed') {
            $data = $payload['data'] ?? [];
            $txRef = $data['tx_ref'] ?? null;
            $flwId = $data['id'] ?? null;

            if ($txRef && $flwId) {
                $transaction = Transaction::where('reference', $txRef)
                    ->where('status', 'pending')
                    ->first();

                if ($transaction) {
                    // Re-verify with Flutterwave — the verified payload is the source of truth,
                    // never the raw webhook body.
                    $verification = $this->flutterwave->verifyTransaction((string) $flwId);

                    if ($verification['success']) {
                        $verified = $verification['data'];

                        if ($this->validatePayment($transaction, $verified)) {
                            $this->activateSubscription($transaction, $verified);
                        }
                    } else {
                        Log::warning('Flutterwave webhook re-verify failed', [
                            'flw_id' => $flwId,
                            'tx_ref' => $txRef,
                        ]);
                    }
                }
            }
        }

        return response()->json(['status' => 'success'], 200);
    }

    /**
     * NOWPayments IPN handler. Verifies the HMAC-SHA512 signature, then on a
     * confirmed/finished payment we re-fetch the payment from the API as the
     * source of truth (never trust the webhook body alone) before activating.
     */
    public function handleNowPaymentsWebhook(Request $request)
    {
        $signature = $request->header('x-nowpayments-sig');
        $rawBody = $request->getContent();

        if (!$this->nowPayments->verifyIpnSignature($rawBody, $signature)) {
            Log::warning('Invalid NOWPayments IPN signature');
            return response()->json(['status' => 'error'], 401);
        }

        $payload = json_decode($rawBody, true) ?: [];
        $orderId = $payload['order_id'] ?? null;
        $paymentId = $payload['payment_id'] ?? null;
        $status = strtolower((string) ($payload['payment_status'] ?? ''));

        if (!$orderId || !$paymentId) {
            return response()->json(['status' => 'ignored'], 200);
        }

        // Activate only on terminal success states.
        if (!in_array($status, ['confirmed', 'finished'], true)) {
            return response()->json(['status' => 'noop'], 200);
        }

        $transaction = Transaction::where('reference', $orderId)
            ->where('status', 'pending')
            ->first();

        if (!$transaction) {
            return response()->json(['status' => 'unknown_or_handled'], 200);
        }

        $lookup = $this->nowPayments->getPayment((string) $paymentId);
        if (!$lookup['success']) {
            Log::warning('NOWPayments IPN re-verify failed', [
                'order_id' => $orderId,
                'payment_id' => $paymentId,
            ]);
            return response()->json(['status' => 'reverify_failed'], 500);
        }

        $verified = $lookup['data'];
        $verifiedStatus = strtolower((string) ($verified['payment_status'] ?? ''));
        if (!in_array($verifiedStatus, ['confirmed', 'finished'], true)) {
            return response()->json(['status' => 'not_yet_final'], 200);
        }

        // Defence-in-depth: amount must match what we created the invoice with.
        $expected = (float) $transaction->amount;
        $actual = (float) ($verified['price_amount'] ?? 0);
        if (abs($expected - $actual) > 0.01) {
            Log::error('NOWPayments amount mismatch', [
                'order_id' => $orderId,
                'expected' => $expected,
                'actual' => $actual,
            ]);
            return response()->json(['status' => 'amount_mismatch'], 400);
        }

        $this->activateSubscription($transaction, $verified);

        return response()->json(['status' => 'success'], 200);
    }

    /**
     * Girostack webhook handler.
     *
     * Verifies HMAC-SHA512 over the raw body using the giro secret key, then on
     * `giro.account.credit` matches the credited collection account back to a
     * pending bank-transfer transaction and activates the subscription.
     *
     * Payload envelope (per real sample): `{event, data: {event, status,
     * account, amount, actualAmount, fee, reference, ...}}`. The inner
     * `account` is the stable internal ID we stashed on provider_reference at
     * create time — it's the only identifier echoed on every event for a given
     * collection account.
     *
     * Amount unit: Girostack stores amounts with the last 2 digits as the
     * decimal portion (10000 = ₦100). We compare `actualAmount` (gross paid by
     * the user) — not `amount` (net after Giro's fee) — against
     * transaction->amount * 100.
     */
    public function handleGirostackWebhook(Request $request)
    {
        $rawBody = $request->getContent();
        $signature = $request->header('x-giro-signature');

        if (!$this->girostack->verifyWebhookSignature($rawBody, $signature)) {
            Log::warning('Invalid Girostack webhook signature');
            return response()->json(['status' => 'error'], 401);
        }

        $payload = json_decode($rawBody, true) ?: [];
        $event = $payload['event'] ?? null;
        $data = $payload['data'] ?? [];

        // Only credit events activate subscriptions. Debit / debit.failed are
        // outbound/payout events and not relevant to incoming subscription pay.
        if ($event !== 'giro.account.credit') {
            return response()->json(['status' => 'noop'], 200);
        }

        $accountId = $data['account'] ?? null;
        $giroReference = $data['reference'] ?? null;
        // amount = net we receive after fees; actualAmount = what user actually
        // paid. Validate against actualAmount so a legit payment isn't rejected
        // for the fee delta.
        $actualMinor = (int) ($data['actualAmount'] ?? 0);
        $netMinor = (int) ($data['amount'] ?? 0);

        if (!$accountId) {
            Log::warning('Girostack credit missing `account` field', ['payload' => $data]);
            return response()->json(['status' => 'malformed'], 400);
        }

        $transaction = Transaction::where('payment_provider', 'girostack')
            ->where('status', 'pending')
            ->where('provider_reference', $accountId)
            ->first();

        if (!$transaction) {
            // Already-handled credits land here on retry; that's fine, ack 200.
            Log::info('Girostack credit not matched to pending transaction (likely already processed)', [
                'account' => $accountId,
                'reference' => $giroReference,
            ]);
            return response()->json(['status' => 'unknown_or_handled'], 200);
        }

        // transaction->amount is in major units (NGN). actualMinor is in minor
        // units (kobo). Convert and compare with sub-kobo tolerance.
        $expectedMinor = (int) round((float) $transaction->amount * 100);
        if (abs($expectedMinor - $actualMinor) > 1) {
            Log::error('Girostack amount mismatch', [
                'transaction_reference' => $transaction->reference,
                'expected_minor' => $expectedMinor,
                'actual_minor' => $actualMinor,
                'net_minor' => $netMinor,
            ]);
            return response()->json(['status' => 'amount_mismatch'], 400);
        }

        $this->activateSubscription($transaction, [
            'id' => $giroReference ?? $accountId,
            'payment_type' => 'banktransfer',
            // Convert back to major units for downstream storage / display.
            'amount' => $actualMinor / 100,
            'currency' => 'NGN',
            'status' => 'successful',
            'raw' => $data,
        ]);

        return response()->json(['status' => 'success'], 200);
    }

    /**
     * Show billing/subscription page for authenticated user
     */
    public function billing()
    {
        $user = Auth::user();

        $activeSubscription = $user->activeSubscription()
            ->with('plan')
            ->first();

        $transactions = $user->transactions()
            ->with('subscription.plan')
            ->latest()
            ->paginate(10);

        return Inertia::render('Subscriber/Billing', [
            'activeSubscription' => $activeSubscription,
            'transactions' => $transactions,
            'currentPlan' => $activeSubscription ? $activeSubscription->plan->name : 'Free',
        ]);
    }

    /**
     * Cancel subscription (stops auto-renewal, active until period end)
     */
    public function cancelSubscription(Request $request)
    {
        $user = Auth::user();
        $subscription = $user->activeSubscription;

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'No active subscription found.',
            ], 404);
        }

        // Keep status='active' so the user retains access until ends_at.
        // The daily subscriptions:expire job will flip active → expired when ends_at passes.
        $subscription->update([
            'auto_renew' => false,
            'cancelled_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subscription cancelled. You will retain access until ' . $subscription->ends_at->format('M d, Y') . '.',
        ]);
    }

    /**
     * Validate that payment matches what we expected
     */
    protected function validatePayment(Transaction $transaction, array $data): bool
    {
        $paidAmount = (float) ($data['amount'] ?? 0);
        $paidCurrency = $data['currency'] ?? '';
        $paymentStatus = $data['status'] ?? '';

        return $paymentStatus === 'successful'
            && $paidAmount >= (float) $transaction->amount
            && strtoupper($paidCurrency) === strtoupper($transaction->currency);
    }

    /**
     * Activate subscription after successful payment.
     *
     * Three-layer race guard for callback/webhook/retry overlap:
     *  1. Cache lock scoped to tx_ref — serialises any concurrent handlers
     *     touching the same transaction.
     *  2. Conditional UPDATE (`WHERE status='pending'`) — even if the lock is
     *     unavailable (cache backend issue), MySQL's atomic UPDATE ensures only
     *     one caller can flip the row. MyISAM ignores lockForUpdate, so we rely
     *     on per-row UPDATE semantics here rather than SELECT ... FOR UPDATE.
     *  3. Duplicate-active check — if the user somehow already has an active
     *     subscription from a parallel payment, we mark this one superseded
     *     instead of double-activating.
     */
    protected function activateSubscription(Transaction $transaction, array $providerData): void
    {
        $subscription = $transaction->subscription;

        if (!$subscription) {
            return;
        }

        $lock = Cache::lock("activate-tx-{$transaction->reference}", 15);
        if (!$lock->get()) {
            // Another handler is already activating this exact transaction.
            return;
        }

        try {
            // Re-read status inside the lock — another handler may have finished
            // between lock acquisition attempts.
            $freshSub = Subscription::where('id', $subscription->id)->first();
            if (!$freshSub || $freshSub->status !== 'pending') {
                return;
            }

            $startsAt = now();
            $endsAt = $subscription->billing_period === 'yearly'
                ? $startsAt->copy()->addYear()
                : $startsAt->copy()->addMonth();

            // Duplicate-active guard: if another sub for this user is already
            // active (and not the one we're activating), don't stack a second.
            $hasOtherActive = Subscription::where('user_id', $subscription->user_id)
                ->where('id', '!=', $subscription->id)
                ->where('status', 'active')
                ->where('ends_at', '>', now())
                ->exists();

            if ($hasOtherActive) {
                // Rare: user paid twice in parallel. Keep the duplicate sub as
                // cancelled (not active) and record the successful payment so
                // finances still reconcile. Ops watches for this log line and
                // processes a manual refund, flipping the transaction to refunded.
                Subscription::where('id', $subscription->id)
                    ->where('status', 'pending')
                    ->update(['status' => 'cancelled', 'cancelled_at' => now(), 'updated_at' => now()]);

                Transaction::where('id', $transaction->id)
                    ->where('status', 'pending')
                    ->update([
                        'status' => 'successful',
                        'provider_reference' => $providerData['id'] ?? null,
                        'payment_method' => $providerData['payment_type'] ?? null,
                        'provider_response' => json_encode($providerData),
                        'paid_at' => now(),
                        'updated_at' => now(),
                    ]);

                Log::warning('Duplicate paid subscription for user — flagged for manual refund', [
                    'user_id' => $subscription->user_id,
                    'duplicate_subscription_id' => $subscription->id,
                    'transaction_reference' => $transaction->reference,
                ]);
                return;
            }

            $affected = Subscription::where('id', $subscription->id)
                ->where('status', 'pending')
                ->update([
                    'status' => 'active',
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                    'provider_subscription_id' => $providerData['id'] ?? null,
                    'updated_at' => now(),
                ]);

            if ($affected === 0) {
                // Lost the race at the DB level — another handler activated first.
                return;
            }

            Transaction::where('id', $transaction->id)
                ->where('status', 'pending')
                ->update([
                    'status' => 'successful',
                    'provider_reference' => $providerData['id'] ?? null,
                    'payment_method' => $providerData['payment_type'] ?? null,
                    'provider_response' => json_encode($providerData),
                    'paid_at' => now(),
                    'updated_at' => now(),
                ]);

            // Any sibling pending subs for this user (shouldn't exist because
            // initiate-flow already abandons them, but belt-and-braces).
            Subscription::where('user_id', $subscription->user_id)
                ->where('id', '!=', $subscription->id)
                ->where('status', 'pending')
                ->update(['status' => 'cancelled', 'cancelled_at' => now(), 'updated_at' => now()]);
        } finally {
            $lock->release();
        }
    }
}
