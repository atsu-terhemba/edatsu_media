<?php

namespace App\Http\Controllers;

use App\Models\ForumThread;
use App\Models\Oppty;
use App\Models\Product;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Public RSS feeds — primary surface for syndication clients, news
 * aggregators, AI training crawlers, and Google News.
 *
 * Each feed is RSS 2.0, valid against validator.w3.org/feed, and cached
 * for 30 minutes since the underlying queries (opportunities listing,
 * recent products, hot forum threads) hit indexed columns but still
 * cost a few hundred ms when uncached.
 *
 * URLs:
 *   GET /rss               → HTML index listing the feeds
 *   GET /rss/opportunities → opportunities feed
 *   GET /rss/toolshed      → tools/products feed
 *   GET /rss/forum         → recent forum threads
 */
class PublicRssController extends Controller
{
    /**
     * HTML index page describing the available feeds. Discoverable for
     * humans, indexable by search engines, links out to each XML feed.
     */
    public function index()
    {
        $feeds = [
            [
                'title'       => 'Opportunities',
                'description' => 'Funding rounds, grants, accelerators and competitions for entrepreneurs — refreshed as new opportunities are published.',
                'url'         => route('rss.opportunities'),
                'page'        => '/opportunities',
            ],
            [
                'title'       => 'Toolshed',
                'description' => 'Software, services and resources curated for founders building or scaling their business.',
                'url'         => route('rss.toolshed'),
                'page'        => '/toolshed',
            ],
            [
                'title'       => 'Forum',
                'description' => 'Latest community discussions and conversations sparked by today\'s news.',
                'url'         => route('rss.forum'),
                'page'        => '/forum',
            ],
        ];

        return response()->view('public.rss-index', ['feeds' => $feeds]);
    }

    public function opportunities()
    {
        $xml = Cache::remember('rss:opportunities:v1', now()->addMinutes(30), function () {
            $items = Oppty::query()
                ->where('status', 'published')
                ->where(function ($q) {
                    $q->where('deleted', '!=', 1)->orWhereNull('deleted');
                })
                ->orderByDesc('created_at')
                ->limit(50)
                ->get(['id', 'title', 'slug', 'description', 'cover_img', 'deadline', 'created_at', 'updated_at']);

            $entries = $items->map(function ($o) {
                $slug = $o->slug ?: Str::slug($o->title);
                return [
                    'title'       => $o->title,
                    'link'        => $this->absoluteUrl("/op/{$o->id}/{$slug}"),
                    'guid'        => $this->absoluteUrl("/op/{$o->id}"),
                    'description' => $this->cleanDescription($o->description),
                    'pubDate'     => optional($o->created_at)->toRssString(),
                    'image'       => $o->cover_img ? $this->absoluteImage($o->cover_img) : null,
                ];
            })->values();

            return $this->renderFeed(
                'Edatsu Media — Opportunities',
                'Funding rounds, grants, accelerators and competitions for entrepreneurs.',
                $this->absoluteUrl('/opportunities'),
                $entries,
                'rss.opportunities'
            );
        });

        return response($xml, 200)->header('Content-Type', 'application/rss+xml; charset=UTF-8');
    }

    public function toolshed()
    {
        // Bump the cache key when the schema mapping changes so a stale
        // cached feed from before the rename doesn't keep serving.
        $xml = Cache::remember('rss:toolshed:v2', now()->addMinutes(30), function () {
            $items = Product::query()
                ->whereNull('deleted_at')
                ->orderByDesc('created_at')
                ->limit(50)
                ->get(['id', 'slug', 'product_name', 'product_description', 'cover_img', 'created_at']);

            $entries = $items->map(function ($p) {
                return [
                    'title'       => $p->product_name,
                    'link'        => $this->absoluteUrl("/product/{$p->id}/{$p->slug}"),
                    'guid'        => $this->absoluteUrl("/product/{$p->id}"),
                    'description' => $this->cleanDescription($p->product_description),
                    'pubDate'     => optional($p->created_at)->toRssString(),
                    'image'       => $p->cover_img ? $this->absoluteImage($p->cover_img) : null,
                ];
            })->values();

            return $this->renderFeed(
                'Edatsu Media — Toolshed',
                'Software, services and resources curated for founders.',
                $this->absoluteUrl('/toolshed'),
                $entries,
                'rss.toolshed'
            );
        });

        return response($xml, 200)->header('Content-Type', 'application/rss+xml; charset=UTF-8');
    }

    public function forum()
    {
        $xml = Cache::remember('rss:forum:v1', now()->addMinutes(30), function () {
            $items = ForumThread::query()
                ->where('is_hidden', false)
                ->orderByDesc('last_activity_at')
                ->limit(50)
                ->get(['id', 'title', 'body', 'article_source', 'last_activity_at', 'created_at']);

            $entries = $items->map(function ($t) {
                return [
                    'title'       => $t->title,
                    'link'        => $this->absoluteUrl("/forum/{$t->id}"),
                    'guid'        => $this->absoluteUrl("/forum/{$t->id}"),
                    'description' => $this->cleanDescription($t->body),
                    'pubDate'     => optional($t->last_activity_at ?: $t->created_at)->toRssString(),
                    'image'       => null,
                ];
            })->values();

            return $this->renderFeed(
                'Edatsu Media — Forum',
                'Community discussions and conversations sparked by today\'s news.',
                $this->absoluteUrl('/forum'),
                $entries,
                'rss.forum'
            );
        });

        return response($xml, 200)->header('Content-Type', 'application/rss+xml; charset=UTF-8');
    }

    /**
     * Build an RSS 2.0 document. Atom self-link is included so feed
     * readers can follow redirects; itunes/dublin-core namespaces left
     * out since we're not a podcast.
     */
    protected function renderFeed(string $title, string $description, string $siteUrl, $entries, string $selfRouteName): string
    {
        $selfUrl = route($selfRouteName);
        $now = Carbon::now()->toRssString();

        $xml  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">' . "\n";
        $xml .= "  <channel>\n";
        $xml .= '    <title>' . $this->xmlEscape($title) . "</title>\n";
        $xml .= '    <link>' . $this->xmlEscape($siteUrl) . "</link>\n";
        $xml .= '    <description>' . $this->xmlEscape($description) . "</description>\n";
        $xml .= '    <language>en-us</language>' . "\n";
        $xml .= '    <lastBuildDate>' . $now . "</lastBuildDate>\n";
        $xml .= '    <atom:link href="' . $this->xmlEscape($selfUrl) . '" rel="self" type="application/rss+xml" />' . "\n";
        $xml .= '    <generator>Edatsu Media</generator>' . "\n";

        foreach ($entries as $e) {
            $xml .= "    <item>\n";
            $xml .= '      <title>' . $this->xmlEscape($e['title']) . "</title>\n";
            $xml .= '      <link>' . $this->xmlEscape($e['link']) . "</link>\n";
            $xml .= '      <guid isPermaLink="true">' . $this->xmlEscape($e['guid']) . "</guid>\n";
            if (!empty($e['pubDate'])) {
                $xml .= '      <pubDate>' . $e['pubDate'] . "</pubDate>\n";
            }
            if (!empty($e['image'])) {
                $xml .= '      <enclosure url="' . $this->xmlEscape($e['image']) . '" type="image/jpeg" length="0" />' . "\n";
            }
            if (!empty($e['description'])) {
                $xml .= '      <description>' . $this->xmlEscape($e['description']) . "</description>\n";
            }
            $xml .= "    </item>\n";
        }

        $xml .= "  </channel>\n";
        $xml .= '</rss>';
        return $xml;
    }

    protected function cleanDescription(?string $raw): string
    {
        if (!$raw) return '';
        $text = strip_tags($raw);
        $text = preg_replace('/\s+/', ' ', $text);
        return trim(Str::limit($text, 480));
    }

    protected function absoluteUrl(string $path): string
    {
        return rtrim(config('app.url'), '/') . '/' . ltrim($path, '/');
    }

    protected function absoluteImage(string $path): string
    {
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        return $this->absoluteUrl('/storage/' . ltrim($path, '/'));
    }

    protected function xmlEscape(string $s): string
    {
        return htmlspecialchars($s, ENT_XML1 | ENT_COMPAT, 'UTF-8');
    }
}
