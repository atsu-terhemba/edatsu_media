<?php

namespace App\Http\Controllers;

use App\Models\SavedFeedArticle;
use App\Models\UserNewsFeed;
use App\Services\FeatureGate;
use App\Services\RssFeedService;
use fivefilters\Readability\Configuration as ReadabilityConfiguration;
use fivefilters\Readability\Readability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NewsFeedController extends Controller
{
    protected RssFeedService $rssFeedService;

    protected const DEFAULT_FEEDS = [
        'Global' => [
            'https://feeds.bbci.co.uk/news/business/rss.xml',
            'https://www.forbes.com/innovation/feed/',
            'https://techcrunch.com/feed/',
            'https://www.wired.com/feed/rss',
            'https://www.reuters.com/rssFeed/technologyNews',
            'https://www.cnbc.com/id/100003114/device/rss/rss.html',
            'https://feeds.bloomberg.com/markets/news.rss',
            'https://finance.yahoo.com/news/rssindex',
            'https://www.ft.com/?format=rss',
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
            'https://www.theverge.com/rss/index.xml',
            'https://feeds.arstechnica.com/arstechnica/index',
            'https://www.inc.com/rss',
            'https://entrepreneur.com/latest.rss',
            'https://www.marketwatch.com/rss/topstories',
            'https://www.wsj.com/xml/rss/3_7085.xml',
            'https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_headline',
            'https://seekingalpha.com/market_currents.xml',
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
