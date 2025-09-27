<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Auth;
use App\Models\Bookmark;
use App\Models\User;
use Carbon\Carbon;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Get a user (assume user with ID 1 exists)
$user = User::find(1);
if (!$user) {
    echo "No user found with ID 1\n";
    exit;
}

echo "=== Dashboard Stats Debug ===\n";
echo "User ID: " . $user->id . "\n";
echo "User Email: " . $user->email . "\n\n";

// Check all bookmarks for this user
$allBookmarks = Bookmark::where('user_id', $user->id)->get();
echo "Total bookmarks: " . $allBookmarks->count() . "\n";

foreach ($allBookmarks as $bookmark) {
    echo "Bookmark ID: {$bookmark->id}, Post Type: {$bookmark->post_type}, Post ID: {$bookmark->post_id}, Removed: {$bookmark->removed}\n";
}

echo "\n";

// Get total bookmarked tools/products
$totalBookmarkedTools = Bookmark::where('user_id', $user->id)
    ->where('post_type', 'tool')
    ->where('removed', 0)
    ->count();

echo "Total bookmarked tools: " . $totalBookmarkedTools . "\n";

// Check opportunities table
$opptyBookmarks = Bookmark::where('user_id', $user->id)
    ->where('post_type', 'opp')
    ->where('removed', 0)
    ->get();

echo "Opportunity bookmarks: " . $opptyBookmarks->count() . "\n";

foreach ($opptyBookmarks as $oppBookmark) {
    echo "Opp Bookmark - Post ID: {$oppBookmark->post_id}\n";
    
    // Check if the opportunity exists
    $opportunity = \App\Models\Oppty::find($oppBookmark->post_id);
    if ($opportunity) {
        echo "  - Opportunity found: {$opportunity->name}\n";
        echo "  - Deadline: {$opportunity->deadline}\n";
        echo "  - Is future deadline: " . (Carbon::parse($opportunity->deadline)->isFuture() ? 'Yes' : 'No') . "\n";
    } else {
        echo "  - Opportunity NOT found in database\n";
    }
}

// Test the exact query from the controller
$upcomingOpportunities = Bookmark::join('opportunities', 'bookmarks.post_id', '=', 'opportunities.id')
    ->where('bookmarks.user_id', $user->id)
    ->where('bookmarks.post_type', 'opp')
    ->where('bookmarks.removed', 0)
    ->where('opportunities.deadline', '>=', Carbon::now()->toDateString())
    ->count();

echo "\nUpcoming opportunities (controller query): " . $upcomingOpportunities . "\n";

// Check the opportunities table directly
$allOpportunities = \App\Models\Oppty::all();
echo "\nAll opportunities in database: " . $allOpportunities->count() . "\n";

foreach ($allOpportunities as $opp) {
    echo "Opportunity ID: {$opp->id}, Name: {$opp->name}, Deadline: {$opp->deadline}\n";
}
