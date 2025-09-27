<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$product = DB::table('products')->where('id', 2)->first();
echo "Product ID 2:\n";
echo "Name: " . $product->product_name . "\n";
echo "Slug: " . $product->slug . "\n";
echo "URL should be: product/2/" . $product->slug . "\n";
