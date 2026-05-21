<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailSubscriptionModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MailSubscribersController extends Controller
{
    public function index(Request $request)
    {
        $search   = trim((string) $request->query('q', ''));
        $type     = (string) $request->query('type', '');

        $stats = [
            'total' => MailSubscriptionModel::count(),
            'last_30_days' => MailSubscriptionModel::where('created_at', '>=', now()->subDays(30))->count(),
            'this_week' => MailSubscriptionModel::where('created_at', '>=', now()->startOfWeek())->count(),
        ];

        $types = MailSubscriptionModel::query()
            ->whereNotNull('subscription_type')
            ->where('subscription_type', '!=', '')
            ->distinct()
            ->orderBy('subscription_type')
            ->pluck('subscription_type')
            ->values();

        $subscribers = MailSubscriptionModel::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('email', 'LIKE', "%{$search}%")
                       ->orWhere('first_name', 'LIKE', "%{$search}%")
                       ->orWhere('last_name', 'LIKE', "%{$search}%");
                });
            })
            ->when($type !== '', fn ($q) => $q->where('subscription_type', $type))
            ->latest()
            ->paginate(25)
            ->withQueryString()
            ->through(fn ($s) => [
                'id'                => $s->id,
                'first_name'        => $s->first_name,
                'last_name'         => $s->last_name,
                'email'             => $s->email,
                'subscription_type' => $s->subscription_type,
                'created_at'        => $s->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/MailSubscribers', [
            'subscribers' => $subscribers,
            'stats'       => $stats,
            'types'       => $types,
            'filters'     => [
                'q'    => $search,
                'type' => $type,
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $search = trim((string) $request->query('q', ''));
        $type   = (string) $request->query('type', '');

        $filename = 'mail-subscribers-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($search, $type) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['First name', 'Last name', 'Email', 'Subscription type', 'Subscribed at']);

            MailSubscriptionModel::query()
                ->when($search !== '', function ($q) use ($search) {
                    $q->where(function ($qq) use ($search) {
                        $qq->where('email', 'LIKE', "%{$search}%")
                           ->orWhere('first_name', 'LIKE', "%{$search}%")
                           ->orWhere('last_name', 'LIKE', "%{$search}%");
                    });
                })
                ->when($type !== '', fn ($q) => $q->where('subscription_type', $type))
                ->orderBy('created_at', 'desc')
                ->chunk(500, function ($chunk) use ($out) {
                    foreach ($chunk as $s) {
                        fputcsv($out, [
                            $s->first_name,
                            $s->last_name,
                            $s->email,
                            $s->subscription_type,
                            optional($s->created_at)->toDateTimeString(),
                        ]);
                    }
                });

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function destroy($id)
    {
        $sub = MailSubscriptionModel::findOrFail($id);
        $sub->delete();
        return back();
    }
}
