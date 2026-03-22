<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'currentPlan' => fn () => $request->user()
                    ? (rescue(fn () => $request->user()->activeSubscription?->plan->name, 'Free', false) ?? 'Free')
                    : null,
                'isPro' => fn () => $request->user()
                    ? rescue(fn () => $request->user()->isPro(), false, false)
                    : false,
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'csrf_token' => csrf_token(),
            'vapidPublicKey' => config('webpush.vapid.public_key'),
        ];
    }
}
