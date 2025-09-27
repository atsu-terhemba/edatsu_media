<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Product;
use Illuminate\Support\Facades\DB;

echo "Testing the actual buildBaseQuery method logic:\n";

$user_id = null; // No user authentication for this test

$query = Product::query()
    ->select([
        'products.id', 
        'products.product_name', 
        'products.slug',
        'products.product_description as description',
        'products.cover_img',
        'products.direct_link',
        'products.youtube_link',
        'products.created_at',
        'products.updated_at',
        DB::raw('GROUP_CONCAT(DISTINCT product_categories.name SEPARATOR ", ") as category_name'),
        DB::raw('GROUP_CONCAT(DISTINCT brand_labels.name SEPARATOR ", ") as brand_labels'),
        DB::raw('GROUP_CONCAT(DISTINCT tags.name SEPARATOR ", ") as tags'),
        DB::raw('CASE WHEN bookmarks.id IS NOT NULL AND bookmarks.removed != 1 THEN 1 ELSE 0 END as is_bookmarked'),
        DB::raw('COALESCE(AVG(ratings.rating), 0) as average_rating'),
        DB::raw('COUNT(DISTINCT ratings.id) as total_ratings'),
        DB::raw('COUNT(DISTINCT comments.id) as total_comments')
    ])
    ->where('products.deleted', '!=', 1)
    ->leftJoin('category_selections', function($join) {
        $join->on('category_selections.post_id', '=', 'products.id')
             ->where('category_selections.post_type', '=', 'products');
    })
    ->leftJoin('product_categories', 'product_categories.id', '=', 'category_selections.category_id')
    ->leftJoin('brand_labels_selections', function($join) {
        $join->on('brand_labels_selections.post_id', '=', 'products.id')
             ->where('brand_labels_selections.post_type', '=', 'products');
    })
    ->leftJoin('brand_labels', 'brand_labels.id', '=', 'brand_labels_selections.brand_label_id')
    ->leftJoin('tags_selections', function($join) {
        $join->on('tags_selections.post_id', '=', 'products.id')
             ->where('tags_selections.post_type', '=', 'products');
    })
    ->leftJoin('tags', 'tags.id', '=', 'tags_selections.tag_id')
    ->leftJoin('bookmarks', function ($join) use ($user_id) {
        $join->on('bookmarks.post_id', '=', 'products.id')
            ->where('bookmarks.post_type', '=', 'tool')
            ->where('bookmarks.user_id', '=', $user_id);
    })
    ->leftJoin('ratings', function($join) {
        $join->on('ratings.rateable_id', '=', 'products.id')
             ->where('ratings.rateable_type', '=', 'App\\Models\\Product');
    })
    ->leftJoin('comments', function($join) {
        $join->on('comments.commentable_id', '=', 'products.id')
             ->where('comments.commentable_type', '=', 'App\\Models\\Product');
    })
    ->groupBy([
        'products.id', 
        'products.product_name', 
        'products.slug',
        'products.product_description',
        'products.cover_img',
        'products.direct_link',
        'products.youtube_link',
        'products.created_at',
        'products.updated_at',
        'bookmarks.id',
        'bookmarks.removed'
    ]);

echo "Generated SQL query:\n";
echo $query->toSql() . "\n";

echo "\nQuery bindings:\n";
print_r($query->getBindings());

echo "\nExecuting query...\n";
try {
    $results = $query->get();
    echo "Results count: " . $results->count() . "\n";
    
    if ($results->count() > 0) {
        foreach($results as $product) {
            echo "Product: {$product->product_name} (ID: {$product->id})\n";
        }
    }
} catch (Exception $e) {
    echo "Error executing query: " . $e->getMessage() . "\n";
}
