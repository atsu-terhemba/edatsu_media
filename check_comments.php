<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Recent comments:\n";
$comments = DB::table('comments')->orderBy('created_at', 'desc')->limit(5)->get();

if ($comments->count() > 0) {
    foreach($comments as $comment) {
        echo "ID: {$comment->id}\n";
        echo "Comment: " . substr($comment->comment, 0, 100) . "...\n";
        echo "Approved: " . ($comment->is_approved ?? 'NULL') . "\n";
        echo "Commentable Type: {$comment->commentable_type}\n";
        echo "Commentable ID: {$comment->commentable_id}\n";
        echo "Created: {$comment->created_at}\n";
        echo "---\n";
    }
} else {
    echo "No comments found\n";
}

echo "\nComments specifically for products:\n";
$productComments = DB::table('comments')
    ->where('commentable_type', 'App\\Models\\Product')
    ->orderBy('created_at', 'desc')
    ->get();

echo "Count: " . $productComments->count() . "\n";
foreach($productComments as $comment) {
    echo "Product ID: {$comment->commentable_id}, Comment: " . substr($comment->comment, 0, 50) . "..., Approved: " . ($comment->is_approved ?? 'NULL') . "\n";
}
