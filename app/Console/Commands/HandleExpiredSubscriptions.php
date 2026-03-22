<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;

class HandleExpiredSubscriptions extends Command
{
    protected $signature = 'subscriptions:handle-expired';
    protected $description = 'Mark expired subscriptions and clean up stale pending ones';

    public function handle(): int
    {
        // Mark active subscriptions that have passed their end date as expired
        $expired = Subscription::where('status', 'active')
            ->where('ends_at', '<', now())
            ->update(['status' => 'expired']);

        // Also mark cancelled subscriptions past their end date as expired
        $cancelledExpired = Subscription::where('status', 'cancelled')
            ->where('ends_at', '<', now())
            ->update(['status' => 'expired']);

        // Clean up pending subscriptions older than 24 hours (abandoned payments)
        $stale = Subscription::where('status', 'pending')
            ->where('created_at', '<', now()->subDay())
            ->delete();

        $this->info("Expired: {$expired} active, {$cancelledExpired} cancelled. Cleaned {$stale} stale pending.");

        return self::SUCCESS;
    }
}
