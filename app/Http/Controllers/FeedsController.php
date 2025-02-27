<?php

namespace App\Http\Controllers;

use App\Models\FeedsChannel;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use GuzzleHttp\Client;
use GuzzleHttp\Promise;
use GuzzleHttp\RequestOptions;
use GuzzleHttp\Psr7\Uri;
use Exception;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;



class FeedsController extends Controller
{
    
    /**get domain name */
    function getDomainName($url) {
        $parsedUrl = parse_url($url);
        $domain = explode(':', $parsedUrl['host'])[0];
        return $domain;
    }

    public function displayFeeds(){
        $feeds = FeedsChannel::all()->where('is_deleted', 0);
        return view('feeds', ['channels' => $feeds]);
    }


    
    public function fetchFeeds(Request $request)
    {

        $feeds = [];
    
        if ($request->has("feeder") && $request->feeder !== null) {
            $url = $request->input("feeder");
            $feeds[] = $url;
            Cache::forget('feeds_data');
            $parsedUrl = parse_url($url);
        } else {
            $feeds = [
                "https://disrupt-africa.com/feed/",
                "https://techpoint.africa/feed/",
                "https://techcabal.com/feed/",
                "https://technext24.com/feed/",
                "https://techbuild.africa/feed/",
                "https://www.benjamindada.com/rss/",
                "https://nairametrics.com/feed/",
                "https://businessday.ng/feed/"
            ];
            Cache::forget('feeds_data'); // Clear the cached data
        }
    
        $cacheKey = 'feeds_data';
        $data = Cache::get($cacheKey);
    
        if (!$data) {
            $data = [];
            $promises = [];
            $client = new Client([
                'verify' => false, // Disable SSL verification
                RequestOptions::HTTP_ERRORS => false, // Prevent throwing exceptions on HTTP errors
                RequestOptions::ALLOW_REDIRECTS => true, // Allow following redirects
                RequestOptions::SINK => null, // Disable saving response to a file
            ]);
    
            foreach ($feeds as $url) {
                $promises[] = $client->getAsync($url);
            }

            // return response()->json(['data' => $promises]);
    
            $responses = Promise\Utils::unwrap($promises);
    
            foreach ($responses as $response) {
                if ($response->getStatusCode() !== 200) {
                    continue;
                    //send erorr message to admin = $response->getStatusCode();
                }
    
                try {
                    $xml = simplexml_load_string($response->getBody());
                    if ($xml === false) {
                        // Handle invalid XML
                        continue;
                    }

                    foreach ($xml->channel->item as $item) {
                        $pubDate = strtotime((string) $item->pubDate);
                        $today = strtotime('today');
    
                        if ($pubDate < $today) {
                            continue;
                        }
    
                        $title = (string) $item->title;
                        $description = (string) $item->description;
                        $link = (string) $item->link;
                        $date = date('jS M, Y', $pubDate);
    
                        $description = strip_tags($description);
                        $description = strlen($description) >= 200 ? substr($description, 0, 200) . "..." : $description;
    
                        $data[] = [
                            'title' => $title,
                            'description' => $description,
                            'link' => $link,
                            'date' => $date,
                            'domain_name' => $this->getDomainName($link)
                        ];
                    }
                } catch (Exception $e) {
                    // Handle any exceptions that occur during parsing
                    continue;
                }
            }
    
            if (count($data) > 0) {
                // shuffle($data);
                Cache::put($cacheKey, $data, 60); // Cache the data for 60 minutes
            } else {
                $data[] = [
                    'title' => 'Oops! No post yet',
                    'description' => 'Please check back later',
                    'link' => '',
                    'date' => '',
                    'domain_name' => ''
                ];
            }
        }

        /**
         * Pagination Handle
         */
        $perPage = 10; // Number of items per page
        $currentPage = $request->input('page', 1); // Get the current page from the request, default to 1 if not provided
    
        // Calculate the starting index of the items based on the current page
        $startIndex = ($currentPage - 1) * $perPage;
        $paginatedData = array_slice($data, $startIndex, $perPage);
    
        // Create a Paginator instance with the paginated data
        $paginator = new LengthAwarePaginator($paginatedData, count($data), $perPage, $currentPage);
    
        // Customize the pagination links
        $paginator->withPath('/feeds')->appends($request->all());
    
        return response()->json([
            'data' => $paginator->items(),
            'links' => [
                'first_page_url' => $paginator->url(1),
                'last_page_url' => $paginator->url($paginator->lastPage()),
                'next_page_url' => $paginator->nextPageUrl(),
                'prev_page_url' => $paginator->previousPageUrl(),
            ],
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
        ]);
    
    }
    
    
}