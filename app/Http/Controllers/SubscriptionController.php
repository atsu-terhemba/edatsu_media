<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\MailSubscriptionModel;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Services\FlutterwaveService;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    protected FlutterwaveService $flutterwave;

    public function __construct(FlutterwaveService $flutterwave)
    {
        $this->flutterwave = $flutterwave;
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
            'payment_provider' => 'required|in:flutterwave',
            'payment_method' => 'nullable|in:card,banktransfer',
        ]);

        $user = Auth::user();

        // Check if user already has an active subscription
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

        // Create a unique transaction reference
        $txRef = 'EDATSU-' . strtoupper(Str::random(12)) . '-' . time();

        // Create pending transaction
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'reference' => $txRef,
            'payment_provider' => 'flutterwave',
            'amount' => $amount,
            'currency' => $request->currency,
            'status' => 'pending',
            'type' => 'subscription',
            'description' => "{$plan->name} plan - {$request->billing_period} ({$request->currency})",
        ]);

        // Create pending subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'subscription_plan_id' => $plan->id,
            'billing_period' => $request->billing_period,
            'currency' => $request->currency,
            'amount' => $amount,
            'status' => 'pending',
            'payment_provider' => 'flutterwave',
        ]);

        // Link transaction to subscription
        $transaction->update(['subscription_id' => $subscription->id]);

        // Initialize Flutterwave payment
        $result = $this->flutterwave->initializePayment([
            'tx_ref' => $txRef,
            'amount' => $amount,
            'currency' => $request->currency,
            'redirect_url' => route('subscription.callback'),
            'email' => $user->email,
            'name' => $user->name,
            'description' => $transaction->description,
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

        // Clean up on failure
        $transaction->update(['status' => 'failed']);
        $subscription->delete();

        return response()->json([
            'success' => false,
            'message' => $result['message'] ?? 'Could not initialize payment. Please try again.',
        ], 500);
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

        $txRef = 'EDATSU-' . strtoupper(Str::random(12)) . '-' . time();

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'reference' => $txRef,
            'payment_provider' => 'flutterwave',
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
            'payment_provider' => 'flutterwave',
        ]);

        $transaction->update(['subscription_id' => $subscription->id]);

        $result = $this->flutterwave->chargeBankTransfer([
            'tx_ref' => $txRef,
            'amount' => $amount,
            'currency' => $request->currency,
            'email' => $user->email,
            'name' => $user->name,
            'narration' => $transaction->description,
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

        $subscriptionHistory = $user->subscriptions()
            ->with('plan')
            ->latest()
            ->get();

        return Inertia::render('Subscriber/Billing', [
            'activeSubscription' => $activeSubscription,
            'transactions' => $transactions,
            'subscriptionHistory' => $subscriptionHistory,
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
     * Uses a conditional UPDATE (`WHERE status='pending'`) as the race guard so
     * a callback and a webhook arriving simultaneously can't both activate.
     * MyISAM tables silently ignore lockForUpdate, so we rely on MySQL's
     * per-row atomic UPDATE semantics instead. Affected-rows == 0 means another
     * path already activated this subscription — bail out.
     */
    protected function activateSubscription(Transaction $transaction, array $providerData): void
    {
        $subscription = $transaction->subscription;

        if (!$subscription) {
            return;
        }

        $startsAt = now();
        $endsAt = $subscription->billing_period === 'yearly'
            ? $startsAt->copy()->addYear()
            : $startsAt->copy()->addMonth();

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
            // Already activated by another path (callback vs. webhook race).
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
    }
}
