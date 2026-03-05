<?php

namespace App\Http\Controllers;

use App\Models\Oppty;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $urls = collect();

        // Static pages
        $staticPages = [
            ['url' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => '/opportunities', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/toolshed', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/about-us', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/advertise', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/subscription', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/help', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/terms', 'priority' => '0.3', 'changefreq' => 'yearly'],
            ['url' => '/privacy-policy', 'priority' => '0.3', 'changefreq' => 'yearly'],
            ['url' => '/feedback', 'priority' => '0.4', 'changefreq' => 'monthly'],
            ['url' => '/sponsorship', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/news', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['url' => '/events', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['url' => '/sign-up', 'priority' => '0.6', 'changefreq' => 'monthly'],
        ];

        foreach ($staticPages as $page) {
            $urls->push($page);
        }

        // Dynamic opportunity pages
        $opportunities = Oppty::where('status', 'published')
            ->select('id', 'title', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->get();

        foreach ($opportunities as $opp) {
            $slug = \Illuminate\Support\Str::slug($opp->title);
            $urls->push([
                'url' => "/op/{$opp->id}/{$slug}",
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $opp->updated_at->toW3cString(),
            ]);
        }

        // Dynamic product/tool pages
        $products = Product::select('id', 'slug', 'updated_at')
            ->whereNull('deleted_at')
            ->orderBy('updated_at', 'desc')
            ->get();

        foreach ($products as $product) {
            $urls->push([
                'url' => "/product/{$product->id}/{$product->slug}",
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $product->updated_at->toW3cString(),
            ]);
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $entry) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>https://www.edatsu.com" . htmlspecialchars($entry['url']) . "</loc>\n";
            if (isset($entry['lastmod'])) {
                $xml .= "    <lastmod>{$entry['lastmod']}</lastmod>\n";
            }
            $xml .= "    <changefreq>{$entry['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$entry['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
