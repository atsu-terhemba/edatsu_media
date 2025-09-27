<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Basic products query:\n";
$products = DB::table('products')->where('deleted', '!=', 1)->get();
echo "Count: " . $products->count() . "\n";

echo "\nCategory selections for products:\n";
$categorySelections = DB::table('category_selections')->where('post_type', 'products')->get();
echo "Count: " . $categorySelections->count() . "\n";

if ($categorySelections->count() > 0) {
    foreach($categorySelections as $selection) {
        echo "Product ID: {$selection->post_id}, Category ID: {$selection->category_id}\n";
    }
} else {
    echo "No category selections found for products!\n";
}

echo "\nTesting the actual searchProducts query without filters:\n";
$query = DB::table('products')
    ->select([
        'products.id', 
        'products.product_name', 
        'products.slug',
        'products.product_description as description',
        'products.cover_img',
        'products.direct_link',
        'products.youtube_link',
        'products.created_at',
        'products.updated_at'
    ])
    ->where('products.deleted', '!=', 1);

$results = $query->get();
echo "Simple query results count: " . $results->count() . "\n";

if ($results->count() > 0) {
    foreach($results as $product) {
        echo "Product: {$product->product_name} (ID: {$product->id})\n";
    }
}
