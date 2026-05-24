<?php

namespace App\Services;

use App\Models\ProGatingSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class FeatureGate
{
    public static function enabled(): bool
    {
        return (bool) ProGatingSetting::current()->enabled;
    }

    public static function isPro(?User $user): bool
    {
        return (bool) ($user && $user->isPro());
    }

    public static function bypass(?User $user): bool
    {
        if (!self::enabled()) {
            return true;
        }
        return self::isPro($user);
    }

    public static function quotaFor(string $feature): int
    {
        $setting = ProGatingSetting::current();
        return match ($feature) {
            'bookmarks' => (int) $setting->bookmarks_max,
            'saved_articles' => (int) $setting->saved_articles_max,
            'reminders' => (int) $setting->reminders_max,
            'custom_feeds' => (int) $setting->custom_feeds_max,
            'public_lists' => (int) $setting->public_lists_max,
            default => PHP_INT_MAX,
        };
    }

    public static function proOnly(?User $user, string $feature): bool
    {
        if (self::bypass($user)) {
            return true;
        }
        $setting = ProGatingSetting::current();
        $requiresPro = match ($feature) {
            'bulk_export' => (bool) $setting->bulk_export_pro_only,
            'web_push' => (bool) $setting->web_push_pro_only,
            default => false,
        };
        return !$requiresPro;
    }

    public static function withinQuota(?User $user, string $feature, int $currentCount): bool
    {
        if (self::bypass($user)) {
            return true;
        }
        return $currentCount < self::quotaFor($feature);
    }

    public static function denied(string $feature, string $message, ?int $limit = null): JsonResponse
    {
        return response()->json([
            'error' => 'quota_exceeded',
            'feature' => $feature,
            'message' => $message,
            'limit' => $limit,
            'upgrade_url' => '/upgrade-plan',
        ], 402);
    }
}
