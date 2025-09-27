<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "Comments table columns:\n";
$columns = Schema::getColumnListing('comments');
foreach($columns as $column) {
    echo "- $column\n";
}

echo "\nChecking if comments table exists:\n";
echo Schema::hasTable('comments') ? "Comments table exists" : "Comments table does not exist";
echo "\n";

echo "\nChecking other tables mentioned in the query:\n";
$tables = ['bookmarks', 'ratings', 'brand_labels_selections', 'tags_selections'];
foreach($tables as $table) {
    $exists = Schema::hasTable($table);
    echo "$table: " . ($exists ? "exists" : "does not exist") . "\n";
    if ($exists) {
        $columns = Schema::getColumnListing($table);
        echo "  Columns: " . implode(', ', $columns) . "\n";
    }
}
