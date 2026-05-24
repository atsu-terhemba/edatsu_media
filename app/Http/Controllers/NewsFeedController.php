<?php

namespace App\Http\Controllers;

use App\Models\ArticleEngagement;
use App\Models\ArticleHighlight;
use App\Models\ArticleReaction;
use App\Models\SavedFeedArticle;
use App\Models\UserNewsFeed;
use App\Services\FeatureGate;
use App\Services\RssFeedService;
use fivefilters\Readability\Configuration as ReadabilityConfiguration;
use fivefilters\Readability\Readability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NewsFeedController extends Controller
{
    protected RssFeedService $rssFeedService;

    protected const DEFAULT_FEEDS = [
        'Global' => [
            // Finance
            'https://feeds.bbci.co.uk/news/business/rss.xml',
            'https://www.cnbc.com/id/100003114/device/rss/rss.html',
            'https://feeds.bloomberg.com/markets/news.rss',
            'https://finance.yahoo.com/news/rssindex',
            'https://www.ft.com/?format=rss',
            'https://www.economist.com/finance-and-economics/rss.xml',
            'https://www.investing.com/rss/news.rss',
            // Tech
            'https://www.forbes.com/innovation/feed/',
            'https://techcrunch.com/feed/',
            'https://www.wired.com/feed/rss',
            'https://www.reuters.com/rssFeed/technologyNews',
            'https://www.engadget.com/rss.xml',
            'https://www.technologyreview.com/feed/',
            'https://news.ycombinator.com/rss',
            // Crypto
            'https://www.coindesk.com/arc/outboundfeeds/rss/',
            'https://cointelegraph.com/rss',
        ],
        'Africa' => [
            'https://disruptafrica.com/feed/',
            'https://techpoint.africa/feed/',
            'https://techcabal.com/feed/',
            'https://technext24.com/feed/',
            'https://techbuild.africa/feed/',
            'https://www.benjamindada.com/rss/',
            'https://nairametrics.com/feed/',
            'https://businessday.ng/feed/',
        ],
        'North America' => [
            // Tech
            'https://www.theverge.com/rss/index.xml',
            'https://feeds.arstechnica.com/arstechnica/index',
            'https://venturebeat.com/feed/',
            'https://mashable.com/feeds/rss/all',
            'https://www.inc.com/rss',
            'https://entrepreneur.com/latest.rss',
            // Finance
            'https://www.marketwatch.com/rss/topstories',
            'https://www.wsj.com/xml/rss/3_7085.xml',
            'https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_headline',
            'https://seekingalpha.com/market_currents.xml',
            'https://www.businessinsider.com/rss',
            // Crypto
            'https://www.theblock.co/rss.xml',
            'https://decrypt.co/feed',
        ],
        'Europe' => [
            'https://sifted.eu/feed',
            'https://tech.eu/feed/',
            'https://thenextweb.com/feed',
        ],
        'Asia' => [
            'https://www.techinasia.com/feed',
            'https://e27.co/feed/',
            'https://kr-asia.com/feed',
        ],
        'South America' => [
            'https://contxto.com/feed/',
            'https://labsnews.com/en/feed/',
        ],
    ];

    public function __construct(RssFeedService $rssFeedService)
    {
        $this->rssFeedService = $rssFeedService;
    }

    /**
     * Render the News page. Pass feed metadata only — articles are fetched client-side.
     */
    public function index()
    {
        $savedFeeds = [];
        $savedFeedUrls = [];

        if (Auth::check()) {
            $userFeeds = UserNewsFeed::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            foreach ($userFeeds as $feed) {
                $savedFeeds[] = [
                    'id' => $feed->id,
                    'feed_url' => $feed->feed_url,
                    'site_url' => $feed->site_url,
                    'title' => $feed->feed_title,
                    'favicon' => $feed->feed_favicon,
                    'articles' => null, // loaded client-side
                ];
                $savedFeedUrls[] = $feed->feed_url;
            }
        }

        // Build default feed metadata by region (no HTTP fetching)
        $defaultFeedsByRegion = [];
        $regions = array_keys(self::DEFAULT_FEEDS);

        foreach (self::DEFAULT_FEEDS as $region => $feedUrls) {
            $regionFeeds = [];
            foreach ($feedUrls as $feedUrl) {
                if (in_array($feedUrl, $savedFeedUrls)) continue;

                $parsed = parse_url($feedUrl);
                $host = $parsed['host'] ?? '';

                $regionFeeds[] = [
                    'id' => null,
                    'feed_url' => $feedUrl,
                    'site_url' => ($parsed['scheme'] ?? 'https') . '://' . $host,
                    'title' => ucfirst(str_replace('www.', '', $host)),
                    'favicon' => 'https://www.google.com/s2/favicons?domain=' . urlencode($host) . '&sz=32',
                    'articles' => null, // loaded client-side
                    'is_default' => true,
                    'region' => $region,
                ];
            }
            if (!empty($regionFeeds)) {
                $defaultFeedsByRegion[$region] = $regionFeeds;
            }
        }

        // Get saved article links for the authenticated user
        $savedArticleLinks = [];
        if (Auth::check()) {
            $savedArticleLinks = SavedFeedArticle::where('user_id', Auth::id())
                ->pluck('article_link')
                ->toArray();
        }

        return Inertia::render('Feeds', [
            'savedFeeds' => $savedFeeds,
            'defaultFeedsByRegion' => $defaultFeedsByRegion,
            'regions' => $regions,
            'savedArticleLinks' => $savedArticleLinks,
        ]);
    }

    /**
     * Fetch articles for a single feed URL (used for lazy-loading).
     */
    public function fetchArticles(Request $request)
    {
        $request->validate([
            'url' => 'required|string|max:500',
        ]);

        $feedData = $this->rssFeedService->fetchFeed($request->url);

        if (!$feedData) {
            return response()->json([
                'articles' => [],
                'title' => null,
                'favicon' => null,
            ]);
        }

        return response()->json($feedData);
    }

    /**
     * Preview a feed from a URL (no auth required).
     */
    public function preview(Request $request)
    {
        $request->validate([
            'url' => 'required|url|max:500',
        ]);

        $feedData = $this->rssFeedService->fetchFeed($request->url);

        if (!$feedData) {
            return response()->json([
                'error' => 'No RSS feed found for this URL. Try a different link.',
            ], 404);
        }

        return response()->json($feedData);
    }

    /**
     * Save a feed to the user's account.
     */
    public function store(Request $request)
    {
        $request->validate([
            'feed_url' => 'required|string|max:500',
            'site_url' => 'required|string|max:500',
            'feed_title' => 'nullable|string|max:255',
            'feed_favicon' => 'nullable|string|max:500',
        ]);

        $alreadyHas = UserNewsFeed::where('user_id', Auth::id())
            ->where('feed_url', $request->feed_url)
            ->exists();

        if (!$alreadyHas) {
            $currentCount = UserNewsFeed::where('user_id', Auth::id())->count();
            if (!FeatureGate::withinQuota($request->user(), 'custom_feeds', $currentCount)) {
                $limit = FeatureGate::quotaFor('custom_feeds');
                return FeatureGate::denied(
                    'custom_feeds',
                    "Free plan supports {$limit} custom feeds. Upgrade to Pro to follow unlimited sources.",
                    $limit
                );
            }
        }

        $feed = UserNewsFeed::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'feed_url' => $request->feed_url,
            ],
            [
                'site_url' => $request->site_url,
                'feed_title' => $request->feed_title,
                'feed_favicon' => $request->feed_favicon,
            ]
        );

        return response()->json($feed, 201);
    }

    /**
     * Get the user's saved feeds with fresh articles.
     */
    public function savedFeeds()
    {
        $userFeeds = UserNewsFeed::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        $feeds = [];
        foreach ($userFeeds as $feed) {
            $feedData = $this->rssFeedService->fetchFeed($feed->feed_url);
            $feeds[] = [
                'id' => $feed->id,
                'feed_url' => $feed->feed_url,
                'site_url' => $feed->site_url,
                'title' => $feedData['title'] ?? $feed->feed_title,
                'favicon' => $feedData['favicon'] ?? $feed->feed_favicon,
                'articles' => $feedData['articles'] ?? [],
            ];
        }

        return response()->json($feeds);
    }

    /**
     * Show a single news item (placeholder for /news/{id} route).
     */
    public function show($id)
    {
        return redirect()->route('feeds');
    }

    /**
     * Remove a saved feed.
     */
    public function destroy($id)
    {
        $feed = UserNewsFeed::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $feed->delete();

        return response()->json(['message' => 'Feed removed'], 200);
    }

    /**
     * Save an article for later.
     */
    public function saveArticle(Request $request)
    {
        $request->validate([
            'article_title' => 'required|string|max:255',
            'article_link' => 'required|string|max:500',
            'article_description' => 'nullable|string',
            'article_date' => 'nullable|string|max:255',
            'feed_title' => 'nullable|string|max:255',
            'feed_favicon' => 'nullable|string|max:500',
        ]);

        $alreadySaved = SavedFeedArticle::where('user_id', Auth::id())
            ->where('article_link_hash', hash('sha256', $request->article_link))
            ->exists();

        if (!$alreadySaved) {
            $currentCount = SavedFeedArticle::where('user_id', Auth::id())->count();
            if (!FeatureGate::withinQuota($request->user(), 'saved_articles', $currentCount)) {
                $limit = FeatureGate::quotaFor('saved_articles');
                return FeatureGate::denied(
                    'saved_articles',
                    "Free plan lets you save {$limit} articles. Upgrade to Pro for unlimited saves.",
                    $limit
                );
            }
        }

        $article = SavedFeedArticle::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'article_link_hash' => hash('sha256', $request->article_link),
            ],
            [
                'article_title' => $request->article_title,
                'article_link' => $request->article_link,
                'article_description' => $request->article_description,
                'article_date' => $request->article_date,
                'feed_title' => $request->feed_title,
                'feed_favicon' => $request->feed_favicon,
            ]
        );

        if (!$alreadySaved) {
            ArticleEngagement::create([
                'article_link_hash' => hash('sha256', $request->article_link),
                'article_link' => $request->article_link,
                'article_title' => $request->article_title,
                'article_description' => $request->article_description,
                'article_date' => $request->article_date,
                'feed_title' => $request->feed_title,
                'feed_favicon' => $request->feed_favicon,
                'event_type' => ArticleEngagement::EVENT_SAVE,
                'user_id' => Auth::id(),
            ]);
        }

        return response()->json($article, 201);
    }

    /**
     * Remove a saved article.
     */
    public function unsaveArticle(Request $request)
    {
        $request->validate([
            'article_link' => 'required|string|max:500',
        ]);

        SavedFeedArticle::where('user_id', Auth::id())
            ->where('article_link_hash', hash('sha256', $request->article_link))
            ->delete();

        return response()->json(['message' => 'Article removed'], 200);
    }

    public function checkFrameable(Request $request)
    {
        $request->validate([
            'url' => 'required|url|max:2000',
        ]);

        $url = $request->query('url');
        $host = parse_url($url, PHP_URL_HOST);
        if (!$host || in_array(strtolower($host), ['localhost', '127.0.0.1', '0.0.0.0'], true)) {
            return response()->json(['frameable' => false, 'reason' => 'invalid_host']);
        }

        try {
            $response = Http::timeout(4)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 (compatible; EdatsuBot/1.0; +https://edatsu.com)'])
                ->withOptions(['allow_redirects' => ['max' => 3]])
                ->head($url);
        } catch (\Throwable $e) {
            return response()->json(['frameable' => false, 'reason' => 'unreachable']);
        }

        $xfo = strtolower((string) $response->header('X-Frame-Options'));
        if ($xfo && (str_contains($xfo, 'deny') || str_contains($xfo, 'sameorigin'))) {
            return response()->json(['frameable' => false, 'reason' => 'x-frame-options']);
        }

        $csp = strtolower((string) $response->header('Content-Security-Policy'));
        if ($csp && preg_match('/frame-ancestors\s+([^;]+)/', $csp, $m)) {
            $sources = preg_split('/\s+/', trim($m[1]));
            $allowed = false;
            foreach ($sources as $src) {
                if ($src === '*' || str_contains($src, 'edatsu')) {
                    $allowed = true;
                    break;
                }
            }
            if (!$allowed) {
                return response()->json(['frameable' => false, 'reason' => 'csp-frame-ancestors']);
            }
        }

        return response()->json(['frameable' => true]);
    }

    /**
     * Server-side fetch an article URL and run Readability to return a clean reader view.
     * Caches results for an hour keyed by URL hash.
     */
    public function extractArticle(Request $request)
    {
        $request->validate([
            'url' => 'required|url|max:2000',
        ]);

        $url = $request->query('url');

        if (!$this->isSafeUrl($url)) {
            return response()->json(['success' => false, 'reason' => 'blocked_host'], 400);
        }

        $cacheKey = 'reader:' . hash('sha256', $url);

        $cached = Cache::get($cacheKey);
        if ($cached) {
            return response()->json($cached);
        }

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; EdatsuBot/1.0; +https://edatsu.com)',
                    'Accept' => 'text/html,application/xhtml+xml',
                ])
                ->withOptions(['allow_redirects' => ['max' => 5]])
                ->get($url);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'reason' => 'unreachable'], 502);
        }

        if (!$response->ok()) {
            return response()->json(['success' => false, 'reason' => 'bad_status', 'status' => $response->status()], 502);
        }

        $contentType = strtolower((string) $response->header('Content-Type'));
        if ($contentType && !str_contains($contentType, 'html')) {
            return response()->json(['success' => false, 'reason' => 'not_html'], 415);
        }

        $html = $response->body();
        if (strlen($html) > 3 * 1024 * 1024) {
            return response()->json(['success' => false, 'reason' => 'too_large'], 413);
        }

        try {
            $config = new ReadabilityConfiguration([
                'fixRelativeURLs' => true,
                'originalURL' => $url,
                'summonCthulhu' => true,
            ]);
            $readability = new Readability($config);
            $parsed = $readability->parse($html);
        } catch (\Throwable $e) {
            Log::warning('Readability parse failed', ['url' => $url, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'reason' => 'parse_failed'], 500);
        }

        if (!$parsed) {
            return response()->json(['success' => false, 'reason' => 'no_content'], 422);
        }

        $payload = [
            'success' => true,
            'title' => $readability->getTitle(),
            'content' => $readability->getContent(),
            'excerpt' => $readability->getExcerpt(),
            'author' => $readability->getAuthor(),
            'image' => $readability->getImage(),
            'site_name' => $readability->getSiteName(),
            'direction' => $readability->getDirection(),
            'url' => $url,
        ];

        Cache::put($cacheKey, $payload, now()->addHour());

        return response()->json($payload);
    }

    /**
     * Log an engagement event (read/click/save) for an article.
     * Anonymous-friendly — guests can fire events; user_id is nullable.
     */
    public function trackEngagement(Request $request)
    {
        $request->validate([
            'article_link' => 'required|string|max:500',
            'article_title' => 'required|string|max:255',
            'article_description' => 'nullable|string',
            'article_date' => 'nullable|string|max:255',
            'feed_title' => 'nullable|string|max:255',
            'feed_favicon' => 'nullable|string|max:500',
            'feed_url' => 'nullable|string|max:500',
            'event_type' => 'required|in:read,click,save',
        ]);

        ArticleEngagement::create([
            'article_link_hash' => hash('sha256', $request->article_link),
            'article_link' => $request->article_link,
            'article_title' => $request->article_title,
            'article_description' => $request->article_description,
            'article_date' => $request->article_date,
            'feed_title' => $request->feed_title,
            'feed_favicon' => $request->feed_favicon,
            'feed_url' => $request->feed_url,
            'event_type' => $request->event_type,
            'user_id' => Auth::id(),
        ]);

        return response()->json(['ok' => true]);
    }

    /**
     * Return the top "Hot" articles in the requested time window, ranked by
     * weighted engagement with mild time decay (Reddit/HN-style).
     *
     *   weights: read=1, click=2, save=5
     *   score   = SUM(weight)
     *   decayed = score / POW(hours_since_first_engagement + 2, 1.5)
     */
    public function hot(Request $request)
    {
        $window = $request->query('window', '7d');
        $hours = match ($window) {
            '24h' => 24,
            '30d' => 24 * 30,
            default => 24 * 7,
        };
        $limit = min((int) $request->query('limit', 30), 60);

        $cacheKey = "feeds:hot:{$window}:{$limit}";

        $articles = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($hours, $limit) {
            $since = now()->subHours($hours);

            $weightSql = "SUM(CASE
                WHEN event_type = 'save' THEN 5
                WHEN event_type = 'click' THEN 2
                WHEN event_type = 'read' THEN 1
                ELSE 0
            END)";

            $rows = ArticleEngagement::query()
                ->selectRaw("article_link_hash,
                    MAX(article_link) AS article_link,
                    MAX(article_title) AS article_title,
                    MAX(article_description) AS article_description,
                    MAX(article_date) AS article_date,
                    MAX(feed_title) AS feed_title,
                    MAX(feed_favicon) AS feed_favicon,
                    MAX(feed_url) AS feed_url,
                    {$weightSql} AS raw_score,
                    {$weightSql} / POW(TIMESTAMPDIFF(HOUR, MIN(created_at), NOW()) + 2, 1.5) AS hot_score,
                    SUM(CASE WHEN event_type = 'read' THEN 1 ELSE 0 END) AS read_count,
                    SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) AS click_count,
                    SUM(CASE WHEN event_type = 'save' THEN 1 ELSE 0 END) AS save_count")
                ->where('created_at', '>=', $since)
                ->groupBy('article_link_hash')
                ->orderByDesc('hot_score')
                ->limit($limit)
                ->get();

            return $rows->map(fn ($r) => [
                'link' => $r->article_link,
                'title' => $r->article_title,
                'description' => $r->article_description,
                'published_at' => $r->article_date,
                'feed_title' => $r->feed_title,
                'feed_favicon' => $r->feed_favicon,
                'feed_url' => $r->feed_url,
                'engagement' => [
                    'reads' => (int) $r->read_count,
                    'clicks' => (int) $r->click_count,
                    'saves' => (int) $r->save_count,
                ],
            ])->values()->all();
        });

        return response()->json([
            'window' => $window,
            'articles' => $articles,
        ]);
    }

    /**
     * Toggle a reaction (like / insightful / fire) on an article for the
     * authenticated user. Same user can hold multiple reaction types on the
     * same article; each one toggles independently.
     */
    public function toggleReaction(Request $request)
    {
        $request->validate([
            'article_link'  => 'required|string|max:500',
            'article_title' => 'required|string|max:255',
            'feed_title'    => 'nullable|string|max:255',
            'feed_favicon'  => 'nullable|string|max:500',
            'feed_url'      => 'nullable|string|max:500',
            'reaction_type' => 'required|in:' . implode(',', ArticleReaction::TYPES),
        ]);

        $hash = hash('sha256', $request->article_link);
        $userId = Auth::id();

        $existing = ArticleReaction::where('user_id', $userId)
            ->where('article_link_hash', $hash)
            ->where('reaction_type', $request->reaction_type)
            ->first();

        if ($existing) {
            $existing->delete();
            $reacted = false;
        } else {
            ArticleReaction::create([
                'article_link_hash' => $hash,
                'article_link'      => $request->article_link,
                'article_title'     => $request->article_title,
                'feed_title'        => $request->feed_title,
                'feed_favicon'      => $request->feed_favicon,
                'feed_url'          => $request->feed_url,
                'reaction_type'     => $request->reaction_type,
                'user_id'           => $userId,
            ]);
            $reacted = true;
        }

        $counts = ArticleReaction::where('article_link_hash', $hash)
            ->selectRaw('reaction_type, COUNT(*) AS c')
            ->groupBy('reaction_type')
            ->pluck('c', 'reaction_type');

        $mine = ArticleReaction::where('user_id', $userId)
            ->where('article_link_hash', $hash)
            ->pluck('reaction_type')
            ->values();

        return response()->json([
            'ok'      => true,
            'reacted' => $reacted,
            'counts'  => [
                'like'       => (int) ($counts['like']       ?? 0),
                'insightful' => (int) ($counts['insightful'] ?? 0),
                'fire'       => (int) ($counts['fire']       ?? 0),
            ],
            'mine'    => $mine,
        ]);
    }

    /**
     * Bulk fetch reaction counts (and the current user's own reactions, if
     * authenticated) for a batch of article links. Used by the feeds list to
     * paint reactions without N round-trips.
     */
    public function bulkReactions(Request $request)
    {
        $request->validate([
            'article_links'   => 'required|array|min:1|max:300',
            'article_links.*' => 'string|max:500',
        ]);

        $hashToLink = [];
        foreach ($request->article_links as $link) {
            $hashToLink[hash('sha256', $link)] = $link;
        }
        $hashes = array_keys($hashToLink);

        $rows = ArticleReaction::whereIn('article_link_hash', $hashes)
            ->selectRaw('article_link_hash, reaction_type, COUNT(*) AS c')
            ->groupBy('article_link_hash', 'reaction_type')
            ->get();

        $mineByHash = [];
        if (Auth::check()) {
            $myRows = ArticleReaction::whereIn('article_link_hash', $hashes)
                ->where('user_id', Auth::id())
                ->get(['article_link_hash', 'reaction_type']);
            foreach ($myRows as $r) {
                $mineByHash[$r->article_link_hash][] = $r->reaction_type;
            }
        }

        $result = [];
        foreach ($hashToLink as $hash => $link) {
            $result[$link] = [
                'counts' => ['like' => 0, 'insightful' => 0, 'fire' => 0],
                'mine'   => $mineByHash[$hash] ?? [],
            ];
        }
        foreach ($rows as $r) {
            if (!isset($hashToLink[$r->article_link_hash])) continue;
            $link = $hashToLink[$r->article_link_hash];
            if (isset($result[$link]['counts'][$r->reaction_type])) {
                $result[$link]['counts'][$r->reaction_type] = (int) $r->c;
            }
        }

        return response()->json(['reactions' => $result]);
    }

    /**
     * Update the user-private note attached to a saved article. Pass an empty
     * string to clear it.
     */
    public function updateArticleNote(Request $request, int $id)
    {
        $request->validate([
            'note' => 'nullable|string|max:10000',
        ]);

        $article = SavedFeedArticle::where('user_id', Auth::id())->findOrFail($id);
        $note = trim((string) $request->input('note', ''));
        $article->note = $note === '' ? null : $note;
        $article->save();

        return response()->json(['ok' => true, 'note' => $article->note]);
    }

    /**
     * Add a highlight to a saved article.
     */
    public function addHighlight(Request $request, int $id)
    {
        $data = $request->validate([
            'text'  => 'required|string|min:1|max:5000',
            'color' => 'nullable|string|max:16',
        ]);

        $article = SavedFeedArticle::where('user_id', Auth::id())->findOrFail($id);

        $highlight = ArticleHighlight::create([
            'saved_article_id' => $article->id,
            'text'             => trim($data['text']),
            'color'            => $data['color'] ?? 'yellow',
        ]);

        return response()->json([
            'ok' => true,
            'highlight' => [
                'id'         => $highlight->id,
                'text'       => $highlight->text,
                'color'      => $highlight->color,
                'created_at' => $highlight->created_at?->toIso8601String(),
            ],
        ], 201);
    }

    public function deleteHighlight(int $id)
    {
        $highlight = ArticleHighlight::findOrFail($id);
        $article = SavedFeedArticle::find($highlight->saved_article_id);
        if (!$article || $article->user_id !== Auth::id()) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $highlight->delete();
        return response()->json(['ok' => true]);
    }

    /**
     * Compute the authenticated user's current + longest reading streak.
     *
     * A "day" is a calendar day in app time. A streak is consecutive days
     * where the user logged at least one 'read' engagement. The streak is
     * considered alive if the most recent activity is today or yesterday —
     * a user who hasn't read today still has until end of day to keep going.
     */
    public function readingStreak()
    {
        $userId = Auth::id();
        $empty = ['current' => 0, 'longest' => 0, 'today_active' => false, 'last_read_date' => null];
        if (!$userId) return response()->json($empty);

        $dates = ArticleEngagement::query()
            ->where('user_id', $userId)
            ->where('event_type', 'read')
            ->selectRaw('DATE(created_at) AS d')
            ->groupBy('d')
            ->orderByDesc('d')
            ->pluck('d')
            ->map(fn ($d) => \Carbon\Carbon::parse($d)->toDateString())
            ->values()
            ->all();

        if (empty($dates)) return response()->json($empty);

        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();
        $todayActive = $dates[0] === $today;

        // Current streak: walk back from today (or yesterday if not read today)
        $current = 0;
        $cursor = $todayActive ? $today : ($dates[0] === $yesterday ? $yesterday : null);
        if ($cursor !== null) {
            $set = array_flip($dates);
            while (isset($set[$cursor])) {
                $current++;
                $cursor = \Carbon\Carbon::parse($cursor)->subDay()->toDateString();
            }
        }

        // Longest streak across all dates. Carbon's diffInDays returns float
        // in recent versions, so cast to int and use loose comparison.
        $longest = 0;
        $run = 0;
        $prev = null;
        foreach (array_reverse($dates) as $d) {
            if ($prev !== null && (int) \Carbon\Carbon::parse($prev)->diffInDays(\Carbon\Carbon::parse($d)) === 1) {
                $run++;
            } else {
                $run = 1;
            }
            if ($run > $longest) $longest = $run;
            $prev = $d;
        }

        return response()->json([
            'current'        => $current,
            'longest'        => $longest,
            'today_active'   => $todayActive,
            'last_read_date' => $dates[0],
        ]);
    }

    /**
     * Reject non-http(s) schemes and internal hosts to mitigate SSRF.
     */
    protected function isSafeUrl(string $url): bool
    {
        $parsed = parse_url($url);
        if (!$parsed || empty($parsed['scheme']) || empty($parsed['host'])) {
            return false;
        }
        if (!in_array(strtolower($parsed['scheme']), ['http', 'https'], true)) {
            return false;
        }

        $host = strtolower($parsed['host']);
        if (in_array($host, ['localhost', '0.0.0.0'], true)) {
            return false;
        }

        $ips = @gethostbynamel($host) ?: [$host];
        foreach ($ips as $ip) {
            if (!filter_var($ip, FILTER_VALIDATE_IP)) continue;
            if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return false;
            }
        }

        return true;
    }
}
