<?php

use Illuminate\Support\Facades\DB;

// Simple database check
try {
    // Check if we have any bookmarks
    echo "=== Database Check ===\n";
    
    // Check bookmarks table
    $bookmarks = DB::table('bookmarks')->get();
    echo "Total bookmarks: " . $bookmarks->count() . "\n";
    
    foreach ($bookmarks as $bookmark) {
        echo "Bookmark ID: {$bookmark->id}, User: {$bookmark->user_id}, Post Type: {$bookmark->post_type}, Post ID: {$bookmark->post_id}, Removed: {$bookmark->removed}\n";
    }
    
    echo "\n";
    
    // Check opportunities
    $opportunities = DB::table('opportunities')->get();
    echo "Total opportunities: " . $opportunities->count() . "\n";
    
    foreach ($opportunities as $opp) {
        echo "Opportunity ID: {$opp->id}, Title: {$opp->title}, Deadline: {$opp->deadline}\n";
    }
    
    echo "\n";
    
    // Check users
    $users = DB::table('users')->get();
    echo "Total users: " . $users->count() . "\n";
    
    foreach ($users as $user) {
        echo "User ID: {$user->id}, Email: {$user->email}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
