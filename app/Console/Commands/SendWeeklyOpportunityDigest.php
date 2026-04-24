<?php

namespace App\Console\Commands;

use App\Mail\WeeklyOpportunityDigest;
use App\Models\AdSetting;
use App\Models\Oppty;
use App\Models\User;
use App\Models\UserPreference;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

/**
 * Saturday-morning opportunity digest command.
 *
 * For every user whose UserPreference has `weekly_digest_optin = true`, we:
 *   1. AND-intersect their four opportunity filter arrays (categories,
 *      countries, regions, brands) against opportunities created in the
 *      last 7 days with deadlines still in the future.
 *   2. Skip if the intersection is empty — never send an empty digest (hurts
 *      deliverability more than it helps retention).
 *   3. Skip if `weekly_digest_last_sent_at` is within the last 5 days — a
 *      second scheduler tick / manual rerun in the same week is a no-op.
 *   4. Queue the mailable (SMTP is slow; the command shouldn't block on it).
 *   5. Stamp `weekly_digest_last_sent_at = now()` so the guard in (3) holds.
 *
 * Users with zero preferences across all four arrays are skipped entirely —
 * we have nothing to match them on. They'll get the digest as soon as they
 * set any preference on /preferences.
 */
class SendWeeklyOpportunityDigest extends Command
{
    protected $signature = 'newsletters:send-weekly-digest
        {--dry-run : Log what would have been sent, don\'t queue any mail}
        {--user= : Send to a single user ID (for testing)}';

    protected $description = 'Send the Saturday-morning opportunity digest to all opted-in users whose preferences match new opportunities.';

    public function handle(): int
    {
        $dry = (bool) $this->option('dry-run');
        $singleUserId = $this->option('user');

        $windowStart = now()->subDays(7);
        $resendGuard = now()->subDays(5);

        $prefsQuery = UserPreference::where('weekly_digest_optin', true)
            ->where(function ($q) use ($resendGuard) {
                $q->whereNull('weekly_digest_last_sent_at')
                  ->orWhere('weekly_digest_last_sent_at', '<', $resendGuard);
            });

        if ($singleUserId) {
            $prefsQuery->where('user_id', $singleUserId);
        }

        $ad = AdSetting::active()->visible()->forPage('newsletter')
            ->orderBy('order')
            ->first();

        $sent = 0;
        $skippedNoPrefs = 0;
        $skippedNoMatches = 0;

        $prefsQuery->chunkById(200, function ($prefs) use (
            &$sent, &$skippedNoPrefs, &$skippedNoMatches,
            $windowStart, $ad, $dry
        ) {
            foreach ($prefs as $pref) {
                try {
                    $catIds = array_map('intval', $pref->opportunity_categories ?? []);
                    $countryIds = array_map('intval', $pref->opportunity_countries ?? []);
                    $regionIds = array_map('intval', $pref->opportunity_regions ?? []);
                    $brandIds = array_map('intval', $pref->opportunity_brands ?? []);

                    if (empty($catIds) && empty($countryIds) && empty($regionIds) && empty($brandIds)) {
                        $skippedNoPrefs++;
                        continue;
                    }

                    $user = User::find($pref->user_id);
                    if (!$user || !$user->email) {
                        continue;
                    }

                    $opps = $this->matchingOpportunities(
                        $windowStart, $catIds, $countryIds, $regionIds, $brandIds
                    );

                    if ($opps->isEmpty()) {
                        $skippedNoMatches++;
                        continue;
                    }

                    $unsubscribeUrl = URL::signedRoute(
                        'newsletter.weekly_digest.unsubscribe',
                        ['user' => $user->id]
                    );

                    if ($dry) {
                        $this->info("[dry-run] would send {$opps->count()} opps to {$user->email}");
                    } else {
                        Mail::to($user->email, $user->name)
                            ->queue(new WeeklyOpportunityDigest($user, $opps, $unsubscribeUrl, $ad));
                        $pref->update(['weekly_digest_last_sent_at' => now()]);
                    }

                    $sent++;
                } catch (\Throwable $e) {
                    Log::warning("Weekly digest failed for user_id {$pref->user_id}: " . $e->getMessage());
                }
            }
        });

        $this->info(sprintf(
            '%s: sent=%d, skipped_no_prefs=%d, skipped_no_matches=%d',
            $dry ? 'Dry-run' : 'Done',
            $sent,
            $skippedNoPrefs,
            $skippedNoMatches
        ));

        return self::SUCCESS;
    }

    /**
     * Pull opportunities created in the rolling 7-day window whose pivot
     * relations intersect every non-empty preference array. Empty preference
     * arrays are treated as "don't filter on this axis" rather than "match
     * nothing" — otherwise a user with categories but no countries would
     * always get zero matches.
     */
    protected function matchingOpportunities(
        Carbon $windowStart,
        array $catIds,
        array $countryIds,
        array $regionIds,
        array $brandIds
    ) {
        $query = Oppty::with(['categories:id,name'])
            ->where('created_at', '>=', $windowStart)
            ->where(function ($q) {
                $q->whereNull('deadline')
                  ->orWhere('deadline', '>=', now()->toDateString());
            });

        if (!empty($catIds)) {
            $query->whereHas('categories', fn ($q) => $q->whereIn('categories.id', $catIds));
        }
        if (!empty($countryIds)) {
            $query->whereHas('countries', fn ($q) => $q->whereIn('countries.id', $countryIds));
        }
        if (!empty($regionIds)) {
            $query->whereHas('regions', fn ($q) => $q->whereIn('regions.id', $regionIds));
        }
        if (!empty($brandIds)) {
            $query->whereHas('brands', fn ($q) => $q->whereIn('brand_labels.id', $brandIds));
        }

        return $query->orderByDesc('created_at')
            ->limit(4)
            ->get();
    }
}
