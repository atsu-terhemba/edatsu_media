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
                    'Access to basic opportunities',
                    'Weekly newsletter',
                    'Community access',
                    'Basic search filters',
                    'Save up to 10 opportunities',
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
                    'Unlimited saved opportunities',
                    'Smart reminders via push & email',
                    'Google Calendar sync',
                    'AI Assistant',
                    'Ad-free browsing',
                    'Priority access to new opportunities',
                    'Export saved items (PDF / CSV)',
                ],
                'limitations' => [],
                'is_active' => true,
                'is_popular' => true,
                'sort_order' => 1,
            ]
        );
    }
}
