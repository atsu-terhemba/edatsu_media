<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\AdSetting;

// Create a test ad slot
$timestamp = time();
$ad = AdSetting::create([
    'slot_name' => 'test_slot_' . $timestamp,
    'page' => 'toolshed',
    'position' => 'top',
    'size' => 'leaderboard',
    'is_active' => true,
    'is_visible' => true,
    'order' => 1,
    'ad_code' => '<!-- Test Ad Code -->'
]);

echo "✅ Ad Slot Created Successfully!\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "ID:          " . $ad->id . "\n";
echo "Slot Name:   " . $ad->slot_name . "\n";
echo "Page:        " . $ad->page . "\n";
echo "Position:    " . $ad->position . "\n";
echo "Size:        " . $ad->size . "\n";
echo "Is Active:   " . ($ad->is_active ? 'Yes' : 'No') . "\n";
echo "Is Visible:  " . ($ad->is_visible ? 'Yes' : 'No') . "\n";
echo "Order:       " . $ad->order . "\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

// Verify we can retrieve it
$retrieved = AdSetting::where('slot_name', $ad->slot_name)->first();
echo "\n✅ Ad Slot Retrieved Successfully!\n";
echo "Retrieved ID: " . $retrieved->id . "\n";

// Count total ad slots
$total = AdSetting::count();
echo "\n📊 Total Ad Slots in Database: " . $total . "\n";
