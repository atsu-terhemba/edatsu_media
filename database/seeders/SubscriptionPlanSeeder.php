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
                    ['text' => 'Save up to 10 opportunities & tools', 'highlight' => false],
                    ['text' => 'Save up to 20 articles from feeds', 'highlight' => false],
                    ['text' => 'Up to 3 bookmark reminders', 'highlight' => false],
                    ['text' => 'Add up to 5 custom RSS feeds', 'highlight' => false],
                    ['text' => 'Compare 2 tools side-by-side', 'highlight' => false],
                    ['text' => 'Weekly digest & community access', 'highlight' => false],
                ],
                'limitations' => [
                    'Limited bookmarks, reminders, and custom feeds',
                    'No push notifications or Google Calendar sync',
                    'No full-text search or keyword alerts across feeds',
                    'Weekly digest only (no real-time notifications)',
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
                    ['text' => 'Smart reminders: push, email & Google Calendar sync', 'highlight' => true],
                    ['text' => 'Unlimited custom RSS feeds & reader mode', 'highlight' => true],
                    ['text' => 'Full-text search & keyword alerts across feeds', 'highlight' => true],
                    ['text' => 'Unlimited forum threads & replies', 'highlight' => false],
                    ['text' => 'Compare up to 5 tools side-by-side', 'highlight' => false],
                    ['text' => 'Real-time email & web push notifications', 'highlight' => false],
                    ['text' => 'Bulk export saved items (PDF / CSV)', 'highlight' => false],
                ],
                'limitations' => [],
                'is_active' => true,
                'is_popular' => true,
                'sort_order' => 1,
            ]
        );
    }
}
