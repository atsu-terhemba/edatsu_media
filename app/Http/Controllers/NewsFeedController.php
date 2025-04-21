<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsFeedController extends Controller
{
    //
    function index()
    {
        return Inertia::render('News');
    }
}
