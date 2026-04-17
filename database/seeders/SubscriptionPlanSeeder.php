<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        SubscriptionPlan::updateOrCreate(
            ['slug' => 'free'],
            [
                'name' => 'Free',
                'description' => 'Perfect for getting started with opportunities',
                'price_monthly_usd' => 0,
                'price_yearly_usd' => 0,
                'price_monthly_ngn' => 0,
                'price_yearly_ngn' => 0,
                'features' => [
                    ['text' => 'Access to basic opportunities', 'highlight' => false],
                    ['text' => 'Weekly newsletter', 'highlight' => false],
                    ['text' => 'Community access', 'highlight' => false],
                    ['text' => 'Basic search filters', 'highlight' => false],
                    ['text' => 'Save up to 10 opportunities', 'highlight' => false],
                ],
                'limitations' => [
                    'Limited bookmarks (10 max)',
                    'Ads displayed while browsing',
                    'No calendar integration',
                    'No AI assistant',
                ],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 0,
            ]
        );

        SubscriptionPlan::updateOrCreate(
            ['slug' => 'pro'],
            [
                'name' => 'Pro',
                'description' => 'Unlock all features and supercharge your hunt',
                'price_monthly_usd' => 3.50,
                'price_yearly_usd' => 38.00,
                'price_monthly_ngn' => 5000,
                'price_yearly_ngn' => 54000,
                'features' => [
                    ['text' => 'Unlimited saved opportunities', 'highlight' => true],
                    ['text' => 'Smart reminders via push & email', 'highlight' => true],
                    ['text' => 'Google Calendar sync', 'highlight' => true],
                    ['text' => 'AI Assistant', 'highlight' => true],
                    ['text' => 'Ad-free browsing', 'highlight' => false],
                    ['text' => 'Priority access to new opportunities', 'highlight' => false],
                    ['text' => 'Export saved items (PDF / CSV)', 'highlight' => false],
                ],
                'limitations' => [],
                'is_active' => true,
                'is_popular' => true,
                'sort_order' => 1,
            ]
        );
    }
}
