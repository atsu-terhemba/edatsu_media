<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Exception;

class RssFeedService
{
    protected Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'verify' => false,
            RequestOptions::HTTP_ERRORS => false,
            RequestOptions::ALLOW_REDIRECTS => true,
            RequestOptions::TIMEOUT => 5,
            RequestOptions::CONNECT_TIMEOUT => 5,
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (compatible; EdatsuBot/1.0)',
            ],
        ]);
    }

    /**
     * Discover and fetch an RSS feed from a URL.
     * Returns structured feed data or null on failure.
     */
    public function fetchFeed(string $url): ?array
    {
        $url = $this->normalizeUrl($url);
        $cacheKey = 'rss_feed_' . md5($url);

        return Cache::remember($cacheKey, 900, function () use ($url) {
            // First, try the URL directly as an RSS feed
            $feedData = $this->tryParseFeed($url);
            if ($feedData) {
                return $feedData;
            }

            // If not a feed, try to discover the RSS URL from the HTML page
            $discoveredUrl = $this->discoverFeedUrl($url);
            if ($discoveredUrl) {
                $feedData = $this->tryParseFeed($discoveredUrl);
                if ($feedData) {
                    return $feedData;
                }
            }

            // Fall back to common feed paths
            $basePaths = ['/feed', '/rss', '/atom.xml', '/feed.xml', '/rss.xml', '/feeds/posts/default'];
            $parsedUrl = parse_url($url);
            $baseUrl = ($parsedUrl['scheme'] ?? 'https') . '://' . ($parsedUrl['host'] ?? '');

            foreach ($basePaths as $path) {
                $feedData = $this->tryParseFeed($baseUrl . $path);
                if ($feedData) {
                    return $feedData;
                }
            }

            return null;
        });
    }

    /**
     * Try to fetch and parse a URL as an RSS/Atom feed.
     */
    protected function tryParseFeed(string $url): ?array
    {
        try {
            $response = $this->client->get($url);
            if ($response->getStatusCode() !== 200) {
                return null;
            }

            $body = (string) $response->getBody();
            $xml = @simplexml_load_string($body);
            if ($xml === false) {
                return null;
            }

            // RSS 2.0 format
            if (isset($xml->channel)) {
                return $this->parseRss($xml, $url);
            }

            // Atom format
            if ($xml->getName() === 'feed') {
                return $this->parseAtom($xml, $url);
            }

            return null;
        } catch (Exception $e) {
            Log::debug('RssFeedService: Failed to parse feed at ' . $url . ': ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Parse RSS 2.0 feed.
     */
    protected function parseRss(\SimpleXMLElement $xml, string $feedUrl): array
    {
        $channel = $xml->channel;
        $siteUrl = (string) ($channel->link ?? '');
        $title = (string) ($channel->title ?? $this->getDomainName($feedUrl));

        $articles = [];
        $count = 0;
        foreach ($channel->item as $item) {
            if ($count >= 10) break;

            $articles[] = [
                'title' => (string) ($item->title ?? 'Untitled'),
                'link' => (string) ($item->link ?? ''),
                'description' => $this->cleanDescription((string) ($item->description ?? '')),
                'published_at' => $this->formatDate((string) ($item->pubDate ?? '')),
            ];
            $count++;
        }

        return [
            'feed_url' => $feedUrl,
            'site_url' => $siteUrl ?: $feedUrl,
            'title' => $title,
            'favicon' => $this->getFavicon($siteUrl ?: $feedUrl),
            'articles' => $articles,
        ];
    }

    /**
     * Parse Atom feed.
     */
    protected function parseAtom(\SimpleXMLElement $xml, string $feedUrl): array
    {
        $title = (string) ($xml->title ?? $this->getDomainName($feedUrl));
        $siteUrl = '';

        foreach ($xml->link as $link) {
            $rel = (string) ($link['rel'] ?? 'alternate');
            if ($rel === 'alternate') {
                $siteUrl = (string) $link['href'];
                break;
            }
        }

        $articles = [];
        $count = 0;
        foreach ($xml->entry as $entry) {
            if ($count >= 10) break;

            $entryLink = '';
            foreach ($entry->link as $link) {
                $rel = (string) ($link['rel'] ?? 'alternate');
                if ($rel === 'alternate') {
                    $entryLink = (string) $link['href'];
                    break;
                }
            }

            $articles[] = [
                'title' => (string) ($entry->title ?? 'Untitled'),
                'link' => $entryLink,
                'description' => $this->cleanDescription((string) ($entry->summary ?? (string) ($entry->content ?? ''))),
                'published_at' => $this->formatDate((string) ($entry->published ?? (string) ($entry->updated ?? ''))),
            ];
            $count++;
        }

        return [
            'feed_url' => $feedUrl,
            'site_url' => $siteUrl ?: $feedUrl,
            'title' => $title,
            'favicon' => $this->getFavicon($siteUrl ?: $feedUrl),
            'articles' => $articles,
        ];
    }

    /**
     * Discover RSS feed URL from an HTML page.
     */
    protected function discoverFeedUrl(string $url): ?string
    {
        try {
            $response = $this->client->get($url);
            if ($response->getStatusCode() !== 200) {
                return null;
            }

            $html = (string) $response->getBody();

            // Look for <link rel="alternate" type="application/rss+xml"> or atom+xml
            if (preg_match('/<link[^>]+type=["\']application\/(rss|atom)\+xml["\'][^>]*>/i', $html, $match)) {
                if (preg_match('/href=["\']([^"\']+)["\']/i', $match[0], $hrefMatch)) {
                    $feedUrl = $hrefMatch[1];
                    // Handle relative URLs
                    if (!str_starts_with($feedUrl, 'http')) {
                        $parsed = parse_url($url);
                        $feedUrl = ($parsed['scheme'] ?? 'https') . '://' . ($parsed['host'] ?? '') . '/' . ltrim($feedUrl, '/');
                    }
                    return $feedUrl;
                }
            }

            return null;
        } catch (Exception $e) {
            return null;
        }
    }

    protected function normalizeUrl(string $url): string
    {
        $url = trim($url);
        if (!preg_match('/^https?:\/\//i', $url)) {
            $url = 'https://' . $url;
        }
        return $url;
    }

    protected function getDomainName(string $url): string
    {
        $parsed = parse_url($url);
        return $parsed['host'] ?? $url;
    }

    protected function getFavicon(string $url): string
    {
        $parsed = parse_url($url);
        $domain = ($parsed['scheme'] ?? 'https') . '://' . ($parsed['host'] ?? '');
        return 'https://www.google.com/s2/favicons?domain=' . urlencode($parsed['host'] ?? '') . '&sz=32';
    }

    protected function cleanDescription(string $description): string
    {
        $description = strip_tags($description);
        $description = html_entity_decode($description, ENT_QUOTES, 'UTF-8');
        $description = trim($description);
        return mb_strlen($description) > 200 ? mb_substr($description, 0, 200) . '...' : $description;
    }

    protected function formatDate(string $date): ?string
    {
        if (empty($date)) return null;
        try {
            return date('M j, Y', strtotime($date));
        } catch (Exception $e) {
            return null;
        }
    }
}
