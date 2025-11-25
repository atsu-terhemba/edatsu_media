<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Check opportunities with images
$opportunities = DB::table('opportunities')
    ->whereNotNull('cover_img')
    ->select('id', 'title', 'cover_img')
    ->limit(10)
    ->get();

echo "=== Opportunities with images ===\n\n";
foreach ($opportunities as $opp) {
    echo "ID: {$opp->id}\n";
    echo "Title: {$opp->title}\n";
    echo "Cover Image: {$opp->cover_img}\n";
    echo "---\n";
}

echo "\nTotal opportunities with images: " . $opportunities->count() . "\n";
