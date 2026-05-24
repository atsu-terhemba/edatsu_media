<?php

namespace App\Console\Commands;

use App\Mail\WeeklyReadingDigest;
use App\Models\ArticleEngagement;
use App\Models\SavedFeedArticle;
use App\Models\User;
use App\Models\UserNewsFeed;
use App\Models\UserPreference;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

/**
 * Sunday-morning personalized reading digest.
 *
 * For every user with reading_digest_optin = true and a not-too-recent
 * last-sent timestamp, we build a payload with:
 *   - Up to 4 articles from feeds *they follow*, ranked by platform-wide
 *     engagement weight (read=1, click=2, save=5) in the last 7 days
 *   - Up to 2 platform-Hot picks from feeds they DON'T follow, for
 *     cross-pollination
 *   - This-week stats (reads, saves, current streak)
 *
 * Skip rules:
 *   - Empty personal AND empty hot → skip; never queue an empty digest
 *   - Sent in the last 5 days → no-op (resend guard)
 *   - No email on file → skip silently
 */
class SendWeeklyReadingDigest extends Command
{
    protected $signature = 'newsletters:send-reading-digest
        {--dry-run : Log what would be sent, do not queue any mail}
        {--user= : Send to a single user ID (for testing)}';

    protected $description = 'Send the Sunday-morning personalized reading digest to opted-in users.';

    public function handle(): int
    {
        $dry = (bool) $this->option('dry-run');
        $singleUserId = $this->option('user');

        $windowStart = now()->subDays(7);
        $resendGuard = now()->subDays(5);

        $prefsQuery = UserPreference::where('reading_digest_optin', true)
            ->where(function ($q) use ($resendGuard) {
                $q->whereNull('reading_digest_last_sent_at')
                  ->orWhere('reading_digest_last_sent_at', '<', $resendGuard);
            });

        if ($singleUserId) {
            $prefsQuery->where('user_id', $singleUserId);
        }

        $sent = 0;
        $skippedEmpty = 0;
        $errors = 0;

        $prefsQuery->chunkById(200, function ($prefs) use (
            &$sent, &$skippedEmpty, &$errors, $windowStart, $dry
        ) {
            foreach ($prefs as $pref) {
                try {
                    $user = User::find($pref->user_id);
                    if (!$user || !$user->email) continue;

                    $personalArticles = $this->personalArticlesFor($user, $windowStart);
                    $hotArticles      = $this->hotArticlesFor($user, $windowStart, $personalArticles);

                    if ($personalArticles->isEmpty() && $hotArticles->isEmpty()) {
                        $skippedEmpty++;
                        continue;
                    }

                    $stats = $this->statsFor($user, $windowStart);
                    $unsubscribeUrl = URL::signedRoute(
                        'newsletter.reading_digest.unsubscribe',
                        ['user' => $user->id]
                    );

                    if ($dry) {
                        $this->info(sprintf(
                            '[dry-run] %s — personal=%d hot=%d streak=%d',
                            $user->email,
                            $personalArticles->count(),
                            $hotArticles->count(),
                            $stats['streak'] ?? 0
                        ));
                    } else {
                        Mail::to($user->email, $user->name)
                            ->queue(new WeeklyReadingDigest(
                                $user, $personalArticles, $hotArticles, $stats, $unsubscribeUrl
                            ));
                        $pref->update(['reading_digest_last_sent_at' => now()]);
                    }
                    $sent++;
                } catch (\Throwable $e) {
                    $errors++;
                    Log::warning("Reading digest failed for user_id {$pref->user_id}: " . $e->getMessage());
                }
            }
        });

        $this->info(sprintf(
            '%s: sent=%d, skipped_empty=%d, errors=%d',
            $dry ? 'Dry-run' : 'Done',
            $sent, $skippedEmpty, $errors
        ));

        return self::SUCCESS;
    }

    /**
     * Top-engaging articles in the last 7 days from feeds this user follows.
     * Returns a Collection of associative arrays (not Eloquent models) so
     * the mailable + view can stay shape-agnostic.
     */
    protected function personalArticlesFor(User $user, Carbon $windowStart): Collection
    {
        $feedUrls = UserNewsFeed::where('user_id', $user->id)
            ->whereNotNull('feed_url')
            ->pluck('feed_url')
            ->all();

        if (empty($feedUrls)) return collect();

        $weight = "SUM(CASE WHEN event_type='save' THEN 5 WHEN event_type='click' THEN 2 ELSE 1 END)";

        $rows = ArticleEngagement::query()
            ->where('created_at', '>=', $windowStart)
            ->whereIn('feed_url', $feedUrls)
            ->selectRaw("article_link_hash,
                MAX(article_link)        AS article_link,
                MAX(article_title)       AS article_title,
                MAX(article_description) AS article_description,
                MAX(article_date)        AS article_date,
                MAX(feed_title)          AS feed_title,
                {$weight}                AS score")
            ->groupBy('article_link_hash')
            ->orderByDesc('score')
            ->limit(4)
            ->get();

        return $rows->map(fn ($r) => [
            'title'        => $r->article_title,
            'link'         => $r->article_link,
            'description'  => $r->article_description,
            'article_date' => $r->article_date,
            'feed_title'   => $r->feed_title,
        ])->values();
    }

    /**
     * Up to 2 platform-Hot articles from feeds the user does NOT follow,
     * deduped against the personal list. Pure exploration / cross-pollination.
     */
    protected function hotArticlesFor(User $user, Carbon $windowStart, Collection $exclude): Collection
    {
        $excludeLinks = $exclude->pluck('link')->filter()->all();
        $followedFeedUrls = UserNewsFeed::where('user_id', $user->id)->pluck('feed_url')->all();

        $weight = "SUM(CASE WHEN event_type='save' THEN 5 WHEN event_type='click' THEN 2 ELSE 1 END)";
        $decay  = "{$weight} / POW(TIMESTAMPDIFF(HOUR, MIN(created_at), NOW()) + 2, 1.5)";

        $q = ArticleEngagement::query()
            ->where('created_at', '>=', $windowStart)
            ->selectRaw("article_link_hash,
                MAX(article_link)        AS article_link,
                MAX(article_title)       AS article_title,
                MAX(article_description) AS article_description,
                MAX(feed_title)          AS feed_title,
                MAX(feed_url)            AS feed_url,
                {$decay}                 AS hot_score")
            ->groupBy('article_link_hash')
            ->orderByDesc('hot_score');

        if (!empty($excludeLinks)) {
            $q->whereNotIn('article_link', $excludeLinks);
        }
        if (!empty($followedFeedUrls)) {
            $q->whereNotIn('feed_url', $followedFeedUrls);
        }

        return $q->limit(2)->get()->map(fn ($r) => [
            'title'       => $r->article_title,
            'link'        => $r->article_link,
            'description' => $r->article_description,
            'feed_title'  => $r->feed_title,
        ])->values();
    }

    protected function statsFor(User $user, Carbon $windowStart): array
    {
        $reads = ArticleEngagement::where('user_id', $user->id)
            ->where('event_type', 'read')
            ->where('created_at', '>=', $windowStart)
            ->count();

        $saves = SavedFeedArticle::where('user_id', $user->id)
            ->where('created_at', '>=', $windowStart)
            ->count();

        $streak = $this->currentStreakFor($user);

        return compact('reads', 'saves', 'streak');
    }

    /**
     * Mirrors NewsFeedController::readingStreak — kept inline rather than
     * extracted so this command stays self-contained and a future refactor
     * to a shared service is a small move.
     */
    protected function currentStreakFor(User $user): int
    {
        $dates = ArticleEngagement::where('user_id', $user->id)
            ->where('event_type', 'read')
            ->selectRaw('DATE(created_at) AS d')
            ->groupBy('d')
            ->orderByDesc('d')
            ->pluck('d')
            ->map(fn ($d) => Carbon::parse($d)->toDateString())
            ->values()
            ->all();

        if (empty($dates)) return 0;

        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();
        $cursor = $dates[0] === $today ? $today : ($dates[0] === $yesterday ? $yesterday : null);
        if ($cursor === null) return 0;

        $set = array_flip($dates);
        $count = 0;
        while (isset($set[$cursor])) {
            $count++;
            $cursor = Carbon::parse($cursor)->subDay()->toDateString();
        }
        return $count;
    }
}
