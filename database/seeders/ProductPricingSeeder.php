<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductPricing;

class ProductPricingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pricings = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Free tools and software'
            ],
            [
                'name' => 'Freemium',
                'slug' => 'freemium',
                'description' => 'Free with premium features available'
            ],
            [
                'name' => 'One-time Purchase',
                'slug' => 'one-time-purchase',
                'description' => 'Pay once, own forever'
            ],
            [
                'name' => 'Monthly Subscription',
                'slug' => 'monthly-subscription',
                'description' => 'Monthly recurring payment'
            ],
            [
                'name' => 'Annual Subscription',
                'slug' => 'annual-subscription',
                'description' => 'Annual recurring payment'
            ],
            [
                'name' => 'Pay Per Use',
                'slug' => 'pay-per-use',
                'description' => 'Pay based on usage'
            ]
        ];

        foreach ($pricings as $pricing) {
            ProductPricing::create($pricing);
        }
    }
}
