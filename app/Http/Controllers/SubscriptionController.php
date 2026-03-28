<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
        return Inertia::render('Subscription');
    }

    // Show upgrade plan page with user's current subscription status
    public function showUpgrade()
    {
        $user = Auth::user();
        $activeSubscription = $user ? $user->activeSubscription()->with('plan')->first() : null;

        return Inertia::render('Upgrade', [
            'activeSubscription' => $activeSubscription,
            'currentPlan' => $activeSubscription ? $activeSubscription->plan->slug : 'free',
        ]);
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

            if ($txRef) {
                $transaction = Transaction::where('reference', $txRef)
                    ->where('status', 'pending')
                    ->first();

                if ($transaction && $this->validatePayment($transaction, $data)) {
                    $this->activateSubscription($transaction, $data);
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

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'auto_renew' => false,
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
     * Activate subscription after successful payment
     */
    protected function activateSubscription(Transaction $transaction, array $providerData): void
    {
        $subscription = $transaction->subscription;

        if (!$subscription || $subscription->status === 'active') {
            return;
        }

        $startsAt = now();
        $endsAt = $subscription->billing_period === 'yearly'
            ? $startsAt->copy()->addYear()
            : $startsAt->copy()->addMonth();

        $subscription->update([
            'status' => 'active',
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'provider_subscription_id' => $providerData['id'] ?? null,
        ]);

        $transaction->update([
            'status' => 'successful',
            'provider_reference' => $providerData['id'] ?? null,
            'payment_method' => $providerData['payment_type'] ?? null,
            'provider_response' => $providerData,
            'paid_at' => now(),
        ]);
    }
}
