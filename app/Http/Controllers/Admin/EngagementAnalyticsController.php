<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArticleEngagement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EngagementAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $window = $request->query('window', '7d');
        [$hours, $bucket] = match ($window) {
            '24h'   => [24, 'hour'],
            '30d'   => [24 * 30, 'day'],
            '90d'   => [24 * 90, 'day'],
            default => [24 * 7, 'day'],
        };

        $now       = now();
        $start     = $now->copy()->subHours($hours);
        $prevStart = $start->copy()->subHours($hours);

        $current = ArticleEngagement::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('event_type, COUNT(*) AS c')
            ->groupBy('event_type')
            ->pluck('c', 'event_type');

        $prev = ArticleEngagement::query()
            ->whereBetween('created_at', [$prevStart, $start])
            ->selectRaw('event_type, COUNT(*) AS c')
            ->groupBy('event_type')
            ->pluck('c', 'event_type');

        $reads     = (int) ($current['read']  ?? 0);
        $clicks    = (int) ($current['click'] ?? 0);
        $saves     = (int) ($current['save']  ?? 0);
        $total     = $reads + $clicks + $saves;

        $prevReads  = (int) ($prev['read']  ?? 0);
        $prevClicks = (int) ($prev['click'] ?? 0);
        $prevSaves  = (int) ($prev['save']  ?? 0);
        $prevTotal  = $prevReads + $prevClicks + $prevSaves;

        $pct = function (int $cur, int $previous): float {
            if ($previous === 0) return $cur > 0 ? 100.0 : 0.0;
            return round((($cur - $previous) / $previous) * 100, 1);
        };

        $uniqueUsers = ArticleEngagement::where('created_at', '>=', $start)
            ->whereNotNull('user_id')
            ->distinct()
            ->count('user_id');
        $prevUniqueUsers = ArticleEngagement::whereBetween('created_at', [$prevStart, $start])
            ->whereNotNull('user_id')
            ->distinct()
            ->count('user_id');

        $stats = [
            'reads'        => ['value' => $reads,       'change' => $pct($reads, $prevReads)],
            'clicks'       => ['value' => $clicks,      'change' => $pct($clicks, $prevClicks)],
            'saves'        => ['value' => $saves,       'change' => $pct($saves, $prevSaves)],
            'total'        => ['value' => $total,       'change' => $pct($total, $prevTotal)],
            'unique_users' => ['value' => $uniqueUsers, 'change' => $pct($uniqueUsers, $prevUniqueUsers)],
        ];

        $dateFormat = $bucket === 'hour' ? '%Y-%m-%d %H:00' : '%Y-%m-%d';
        $rows = ArticleEngagement::query()
            ->where('created_at', '>=', $start)
            ->selectRaw("DATE_FORMAT(created_at, '{$dateFormat}') AS bucket, event_type, COUNT(*) AS c")
            ->groupBy('bucket', 'event_type')
            ->orderBy('bucket')
            ->get();

        $series = [];
        $cursor = $start->copy();
        while ($cursor < $now) {
            $key = $bucket === 'hour'
                ? $cursor->format('Y-m-d H:00')
                : $cursor->format('Y-m-d');
            $series[$key] = [
                'bucket' => $key,
                'label'  => $bucket === 'hour' ? $cursor->format('M j H:00') : $cursor->format('M j'),
                'read'   => 0,
                'click'  => 0,
                'save'   => 0,
            ];
            $bucket === 'hour' ? $cursor->addHour() : $cursor->addDay();
        }
        foreach ($rows as $r) {
            if (isset($series[$r->bucket]) && in_array($r->event_type, ['read', 'click', 'save'], true)) {
                $series[$r->bucket][$r->event_type] = (int) $r->c;
            }
        }

        // `reads` is a reserved word in MySQL 8 — backtick-quoted aliases keep
        // the parser happy. Same for the article-level aggregation below.
        $topFeeds = ArticleEngagement::query()
            ->where('created_at', '>=', $start)
            ->whereNotNull('feed_title')
            ->where('feed_title', '!=', '')
            ->selectRaw("feed_title,
                MAX(feed_favicon) AS feed_favicon,
                COUNT(*) AS events,
                SUM(CASE WHEN event_type='read'  THEN 1 ELSE 0 END) AS `reads`,
                SUM(CASE WHEN event_type='click' THEN 1 ELSE 0 END) AS clicks,
                SUM(CASE WHEN event_type='save'  THEN 1 ELSE 0 END) AS saves")
            ->groupBy('feed_title')
            ->orderByDesc('events')
            ->limit(10)
            ->get();

        $topArticles = ArticleEngagement::query()
            ->where('created_at', '>=', $start)
            ->selectRaw("article_link_hash,
                MAX(article_link) AS article_link,
                MAX(article_title) AS article_title,
                MAX(feed_title) AS feed_title,
                MAX(feed_favicon) AS feed_favicon,
                COUNT(*) AS events,
                SUM(CASE WHEN event_type='save' THEN 5 WHEN event_type='click' THEN 2 ELSE 1 END) AS score,
                SUM(CASE WHEN event_type='read'  THEN 1 ELSE 0 END) AS `reads`,
                SUM(CASE WHEN event_type='click' THEN 1 ELSE 0 END) AS clicks,
                SUM(CASE WHEN event_type='save'  THEN 1 ELSE 0 END) AS saves")
            ->groupBy('article_link_hash')
            ->orderByDesc('score')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Engagement', [
            'window'       => $window,
            'stats'        => $stats,
            'time_series'  => array_values($series),
            'top_feeds'    => $topFeeds,
            'top_articles' => $topArticles,
        ]);
    }
}
