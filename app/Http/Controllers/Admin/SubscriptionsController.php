<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
}
