<?php

namespace App\Http\Controllers;

use App\Models\ArticleCollection;
use App\Models\ForumThread;
use App\Models\Oppty;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    public function index()
    {
        $xml = Cache::remember('sitemap:v2', now()->addMinutes(30), function () {
            return $this->build();
        });

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    protected function build(): string
    {
        $urls = collect();

        $staticPages = [
            ['url' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => '/opportunities', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/toolshed', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/feeds', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/forum', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['url' => '/news', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['url' => '/events', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['url' => '/rss', 'priority' => '0.6', 'changefreq' => 'weekly'],
            ['url' => '/about-us', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/advertise', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/subscription', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/help', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/sponsorship', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/feedback', 'priority' => '0.4', 'changefreq' => 'monthly'],
            ['url' => '/sign-up', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/terms', 'priority' => '0.3', 'changefreq' => 'yearly'],
            ['url' => '/privacy-policy', 'priority' => '0.3', 'changefreq' => 'yearly'],
        ];
        foreach ($staticPages as $page) $urls->push($page);

        // Opportunities — biggest content surface
        Oppty::query()
            ->where('status', 'published')
            ->where(function ($q) {
                $q->where('deleted', '!=', 1)->orWhereNull('deleted');
            })
            ->select('id', 'title', 'updated_at')
            ->orderByDesc('updated_at')
            ->chunk(500, function ($chunk) use ($urls) {
                foreach ($chunk as $opp) {
                    $slug = \Illuminate\Support\Str::slug($opp->title);
                    $urls->push([
                        'url' => "/op/{$opp->id}/{$slug}",
                        'priority' => '0.8',
                        'changefreq' => 'weekly',
                        'lastmod' => optional($opp->updated_at)->toW3cString(),
                    ]);
                }
            });

        // Toolshed products
        Product::query()
            ->whereNull('deleted_at')
            ->select('id', 'slug', 'updated_at')
            ->orderByDesc('updated_at')
            ->chunk(500, function ($chunk) use ($urls) {
                foreach ($chunk as $product) {
                    $urls->push([
                        'url' => "/product/{$product->id}/{$product->slug}",
                        'priority' => '0.8',
                        'changefreq' => 'weekly',
                        'lastmod' => optional($product->updated_at)->toW3cString(),
                    ]);
                }
            });

        // Forum threads — public discussions
        ForumThread::query()
            ->where('is_hidden', false)
            ->select('id', 'updated_at', 'last_activity_at')
            ->orderByDesc('last_activity_at')
            ->limit(2000)
            ->get()
            ->each(function ($t) use ($urls) {
                $urls->push([
                    'url' => "/forum/{$t->id}",
                    'priority' => '0.6',
                    'changefreq' => 'weekly',
                    'lastmod' => optional($t->last_activity_at ?: $t->updated_at)->toW3cString(),
                ]);
            });

        // Public reader profiles
        User::query()
            ->whereNotNull('profile_slug')
            ->whereExists(function ($q) {
                $q->select(\DB::raw(1))
                    ->from('article_collections')
                    ->whereColumn('article_collections.user_id', 'users.id')
                    ->where('article_collections.is_public', true);
            })
            ->select('profile_slug', 'updated_at')
            ->get()
            ->each(function ($u) use ($urls) {
                $urls->push([
                    'url' => "/u/{$u->profile_slug}",
                    'priority' => '0.5',
                    'changefreq' => 'weekly',
                    'lastmod' => optional($u->updated_at)->toW3cString(),
                ]);
            });

        // Public reading lists — every collection that's opted into being shared
        ArticleCollection::query()
            ->where('is_public', true)
            ->whereNotNull('slug')
            ->join('users', 'users.id', '=', 'article_collections.user_id')
            ->whereNotNull('users.profile_slug')
            ->select('article_collections.slug as coll_slug', 'article_collections.updated_at', 'users.profile_slug as profile_slug')
            ->get()
            ->each(function ($row) use ($urls) {
                $urls->push([
                    'url' => "/u/{$row->profile_slug}/{$row->coll_slug}",
                    'priority' => '0.5',
                    'changefreq' => 'weekly',
                    'lastmod' => optional($row->updated_at)->toW3cString(),
                ]);
            });

        $base = rtrim(config('app.url'), '/');
        $xml  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $entry) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>' . htmlspecialchars($base . $entry['url'], ENT_XML1, 'UTF-8') . "</loc>\n";
            if (!empty($entry['lastmod'])) {
                $xml .= "    <lastmod>{$entry['lastmod']}</lastmod>\n";
            }
            $xml .= "    <changefreq>{$entry['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$entry['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }
        $xml .= '</urlset>';
        return $xml;
    }
}
