<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SubscriptionsController extends Controller
{
    public function index(Request $request)
    {
        $tab = in_array($request->query('tab'), ['transactions', 'subscriptions', 'pro_users'], true)
            ? $request->query('tab')
            : 'transactions';

        $statusFilter = $request->query('status');

        $stats = [
            'active_subscriptions' => Subscription::where('status', 'active')
                ->where(function ($q) {
                    $q->whereNull('ends_at')->orWhere('ends_at', '>', now());
                })
                ->count(),
            'total_pro_users' => Subscription::where('status', 'active')
                ->where(function ($q) {
                    $q->whereNull('ends_at')->orWhere('ends_at', '>', now());
                })
                ->distinct('user_id')
                ->count('user_id'),
            'pending_payments' => Transaction::where('status', 'pending')->count(),
            'successful_payments' => Transaction::where('status', 'successful')->count(),
            'revenue_usd' => (float) Transaction::where('status', 'successful')
                ->where('currency', 'USD')
                ->sum('amount'),
            'revenue_ngn' => (float) Transaction::where('status', 'successful')
                ->where('currency', 'NGN')
                ->sum('amount'),
        ];

        $transactions = Transaction::query()
            ->with(['user:id,name,email', 'subscription:id,billing_period'])
            ->when($statusFilter && $tab === 'transactions', fn ($q) => $q->where('status', $statusFilter))
            ->latest()
            ->paginate(25, ['*'], 'tx_page')
            ->withQueryString()
            ->through(fn ($t) => [
                'id' => $t->id,
                'reference' => $t->reference,
                'user' => $t->user ? ['id' => $t->user->id, 'name' => $t->user->name, 'email' => $t->user->email] : null,
                'amount' => (float) $t->amount,
                'currency' => $t->currency,
                'provider' => $t->payment_provider,
                'method' => $t->payment_method,
                'status' => $t->status,
                'type' => $t->type,
                'billing_period' => $t->subscription?->billing_period,
                'paid_at' => optional($t->paid_at)?->toIso8601String(),
                'created_at' => $t->created_at?->toIso8601String(),
            ]);

        $subscriptions = Subscription::query()
            ->with(['user:id,name,email', 'plan:id,name,slug'])
            ->when($statusFilter && $tab === 'subscriptions', fn ($q) => $q->where('status', $statusFilter))
            ->latest()
            ->paginate(25, ['*'], 'sub_page')
            ->withQueryString()
            ->through(fn ($s) => [
                'id' => $s->id,
                'user' => $s->user ? ['id' => $s->user->id, 'name' => $s->user->name, 'email' => $s->user->email] : null,
                'plan' => $s->plan ? ['name' => $s->plan->name, 'slug' => $s->plan->slug] : null,
                'billing_period' => $s->billing_period,
                'amount' => (float) $s->amount,
                'currency' => $s->currency,
                'status' => $s->status,
                'starts_at' => optional($s->starts_at)?->toIso8601String(),
                'ends_at' => optional($s->ends_at)?->toIso8601String(),
                'cancelled_at' => optional($s->cancelled_at)?->toIso8601String(),
                'auto_renew' => (bool) $s->auto_renew,
                'provider' => $s->payment_provider,
                'created_at' => $s->created_at?->toIso8601String(),
            ]);

        // Pro users = users with at least one active, non-expired subscription
        $proUsers = User::query()
            ->select('users.id', 'users.name', 'users.email', 'users.created_at')
            ->whereHas('subscriptions', function ($q) {
                $q->where('status', 'active')
                    ->where(function ($qq) {
                        $qq->whereNull('ends_at')->orWhere('ends_at', '>', now());
                    });
            })
            ->withMax(['subscriptions as current_period_ends_at' => function ($q) {
                $q->where('status', 'active')
                    ->where(function ($qq) {
                        $qq->whereNull('ends_at')->orWhere('ends_at', '>', now());
                    });
            }], 'ends_at')
            ->orderByDesc('current_period_ends_at')
            ->paginate(25, ['*'], 'user_page')
            ->withQueryString()
            ->through(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'joined_at' => $u->created_at?->toIso8601String(),
                'current_period_ends_at' => $u->current_period_ends_at,
            ]);

        return Inertia::render('Admin/Subscriptions', [
            'stats' => $stats,
            'transactions' => $transactions,
            'subscriptions' => $subscriptions,
            'proUsers' => $proUsers,
            'currentTab' => $tab,
            'statusFilter' => $statusFilter,
        ]);
    }

    /**
     * Manually activate a pending subscription. Used when a payment landed
     * (bank transfer credited, USDT confirmed, etc.) but our webhook never
     * fired or failed verification, leaving the user paid-but-not-Pro.
     *
     * Mirrors SubscriptionController::activateSubscription's three-layer
     * race guard so a webhook arriving 5min after admin clicked Activate
     * is a no-op rather than a double-activation:
     *  1. Cache lock per-tx_ref / per-sub_id
     *  2. Conditional UPDATE (`WHERE status='pending'`)
     *  3. Duplicate-active check on the user
     *
     * Stamps `activated_by_admin_id` and `admin_activation_note` so finance
     * reconciliation can tell manual activations from real provider-driven
     * ones. The linked Transaction (if pending) flips to successful with
     * `provider_reference = MANUAL-ADMIN-{adminId}-{ts}` for grep-ability.
     */
    public function activatePending(Request $request, int $id)
    {
        $validated = $request->validate([
            'note' => 'required|string|min:6|max:1000',
        ]);

        $admin = Auth::user();
        $subscription = Subscription::find($id);

        if (!$subscription) {
            return response()->json(['success' => false, 'message' => 'Subscription not found.'], 404);
        }

        if ($subscription->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => "Cannot activate — subscription is currently '{$subscription->status}'. Only pending subscriptions can be manually activated.",
            ], 422);
        }

        $lockKey = "activate-sub-{$subscription->id}";
        $lock = Cache::lock($lockKey, 15);
        if (!$lock->get()) {
            return response()->json([
                'success' => false,
                'message' => 'Another activation is already in progress for this subscription. Try again in a moment.',
            ], 429);
        }

        try {
            // Re-read inside the lock — webhook may have flipped it during the modal.
            $fresh = Subscription::find($subscription->id);
            if (!$fresh || $fresh->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription is no longer pending. Refresh and try again.',
                ], 409);
            }

            // Duplicate-active guard: don't stack a second active sub on the user.
            $hasOtherActive = Subscription::where('user_id', $fresh->user_id)
                ->where('id', '!=', $fresh->id)
                ->where('status', 'active')
                ->where('ends_at', '>', now())
                ->exists();

            if ($hasOtherActive) {
                return response()->json([
                    'success' => false,
                    'message' => 'User already has another active subscription. Cancel that one first or pick a different action.',
                ], 422);
            }

            $startsAt = now();
            $endsAt = $fresh->billing_period === 'yearly'
                ? $startsAt->copy()->addYear()
                : $startsAt->copy()->addMonth();

            $manualRef = 'MANUAL-ADMIN-' . $admin->id . '-' . time();

            $affected = Subscription::where('id', $fresh->id)
                ->where('status', 'pending')
                ->update([
                    'status' => 'active',
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                    'activated_by_admin_id' => $admin->id,
                    'admin_activation_note' => $validated['note'],
                    'updated_at' => now(),
                ]);

            if ($affected === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Race lost — another process activated this subscription first.',
                ], 409);
            }

            // Flip the linked pending transaction (if any) to successful so the
            // payments dashboard shows the revenue and so the audit trail is
            // searchable by reference.
            $transaction = Transaction::where('subscription_id', $fresh->id)
                ->where('status', 'pending')
                ->first();

            if ($transaction) {
                Transaction::where('id', $transaction->id)
                    ->where('status', 'pending')
                    ->update([
                        'status' => 'successful',
                        'provider_reference' => $manualRef,
                        'provider_response' => json_encode([
                            'manual_activation' => true,
                            'admin_id' => $admin->id,
                            'admin_email' => $admin->email,
                            'note' => $validated['note'],
                            'activated_at' => now()->toIso8601String(),
                        ]),
                        'paid_at' => now(),
                        'updated_at' => now(),
                    ]);
            }

            Log::info('Subscription manually activated by admin', [
                'subscription_id' => $fresh->id,
                'user_id' => $fresh->user_id,
                'admin_id' => $admin->id,
                'admin_email' => $admin->email,
                'note' => $validated['note'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Subscription activated. User now has Pro access until ' . $endsAt->format('M j, Y') . '.',
            ]);
        } finally {
            $lock->release();
        }
    }
}
