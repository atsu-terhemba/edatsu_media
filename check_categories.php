<?php

require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';

use App\Models\ProductCategory;

echo "Total Product Categories: " . ProductCategory::count() . "\n\n";

echo "Latest 10 categories:\n";
$categories = ProductCategory::latest()->take(10)->get();

foreach ($categories as $category) {
    echo $category->id . ": " . $category->name . " (" . $category->slug . ")\n";
}

echo "\nFirst 5 categories by name:\n";
$categories = ProductCategory::orderBy('name')->take(5)->get();

foreach ($categories as $category) {
    echo $category->id . ": " . $category->name . " (" . $category->slug . ")\n";
}