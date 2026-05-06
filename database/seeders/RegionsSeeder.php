<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RegionsSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
            'north africa',
            'west africa',
            'central africa',
            'east africa',
            'southern africa',
            'sahel region',
        ];

        foreach ($regions as $name) {
            Region::firstOrCreate(
                ['name' => $name],
                ['slug' => Str::slug($name)]
            );
        }
    }
}
