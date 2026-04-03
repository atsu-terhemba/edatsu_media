<?php

namespace App\Http\Controllers;

use App\Models\SavedFeedArticle;
use App\Models\UserNewsFeed;
use App\Services\RssFeedService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        ],
        'Africa' => [
            'https://disrupt-africa.com/feed/',
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

        return Inertia::render('News', [
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
}
