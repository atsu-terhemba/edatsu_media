<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Oppty;

class RssFeedController extends Controller
{

    public function index()
    {
        $opportunities = Oppty::orderBy('id', 'desc')->take(20)->get();

        $content = view('rssFeeds', [
            'opportunities' => $opportunities,
        ]);

        return response($content, 200)
        ->header('Content-Type', 'application/rss+xml');
    }


}
