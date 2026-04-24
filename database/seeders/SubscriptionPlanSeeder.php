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
                    ['text' => 'Save up to 5 opportunities & tools', 'highlight' => false],
                    ['text' => 'Save up to 5 articles from feeds', 'highlight' => false],
                    ['text' => 'Up to 3 bookmark reminders', 'highlight' => false],
                    ['text' => 'Add up to 5 custom RSS feeds', 'highlight' => false],
                    ['text' => 'Compare 2 tools side-by-side', 'highlight' => false],
                    ['text' => 'Forum & community access', 'highlight' => false],
                    ['text' => 'Push alerts for forum activity', 'highlight' => false],
                ],
                'limitations' => [
                    'Limited bookmarks, reminders, and custom feeds',
                    'No push alerts for bookmark deadline reminders',
                    'No bulk export (PDF / CSV)',
                    'Ads in reading feeds',
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
                    ['text' => 'Unlimited bookmarks & saved articles', 'highlight' => true],
                    ['text' => 'Push & email alerts for bookmark deadlines', 'highlight' => true],
                    ['text' => 'Unlimited custom RSS feeds', 'highlight' => true],
                    ['text' => 'Forum access with push alerts', 'highlight' => false],
                    ['text' => 'Compare up to 5 tools side-by-side', 'highlight' => false],
                    ['text' => 'Bulk export saved items (PDF / CSV)', 'highlight' => false],
                    ['text' => 'No ads in your reading feeds', 'highlight' => false],
                ],
                'limitations' => [],
                'is_active' => true,
                'is_popular' => true,
                'sort_order' => 1,
            ]
        );
    }
}
