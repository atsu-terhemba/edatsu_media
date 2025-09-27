<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Comments table structure:\n";
$result = DB::select("DESCRIBE comments");
foreach($result as $column) {
    echo $column->Field . " - " . $column->Type . " - " . $column->Null . " - " . $column->Default . "\n";
}
