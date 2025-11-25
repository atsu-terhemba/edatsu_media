<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Storage;

echo "Testing R2 Upload...\n\n";

// Test content
$testContent = "Test file uploaded at " . date('Y-m-d H:i:s');
$testPath = 'uploads/opp/edatsu_media/test-' . time() . '.txt';

try {
    // Upload to R2
    $result = Storage::disk('r2')->put($testPath, $testContent);
    
    if ($result) {
        echo "✓ File uploaded successfully!\n";
        echo "Path: {$testPath}\n";
        echo "Public URL: " . env('VITE_R2_PUBLIC_URL') . "/{$testPath}\n\n";
        
        // Check if file exists
        $exists = Storage::disk('r2')->exists($testPath);
        echo "File exists in R2: " . ($exists ? "YES" : "NO") . "\n";
        
        // Get file URL
        $url = Storage::disk('r2')->url($testPath);
        echo "Storage URL: {$url}\n";
        
    } else {
        echo "✗ Upload failed!\n";
    }
    
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

// List recent files in the opportunity folder
echo "\n\nRecent files in uploads/opp/edatsu_media/:\n";
try {
    $files = Storage::disk('r2')->files('uploads/opp/edatsu_media');
    echo "Total files: " . count($files) . "\n";
    foreach (array_slice($files, -5) as $file) {
        echo "  - {$file}\n";
    }
} catch (\Exception $e) {
    echo "Error listing files: " . $e->getMessage() . "\n";
}
