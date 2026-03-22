<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');             // Free, Pro
            $table->string('slug', 50)->unique();   // free, pro
            $table->text('description')->nullable();
            $table->decimal('price_monthly_usd', 10, 2)->default(0);
            $table->decimal('price_yearly_usd', 10, 2)->default(0);
            $table->decimal('price_monthly_ngn', 10, 2)->default(0);
            $table->decimal('price_yearly_ngn', 10, 2)->default(0);
            $table->json('features')->nullable();       // JSON array of feature strings
            $table->json('limitations')->nullable();    // JSON array of limitation strings
            $table->boolean('is_active')->default(true);
            $table->boolean('is_popular')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Seed the default plans
        $now = now();

        DB::table('subscription_plans')->insert([
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Perfect for getting started with opportunities',
                'price_monthly_usd' => 0,
                'price_yearly_usd' => 0,
                'price_monthly_ngn' => 0,
                'price_yearly_ngn' => 0,
                'features' => json_encode([
                    'Access to basic opportunities',
                    'Weekly newsletter',
                    'Community access',
                    'Basic search filters',
                    'Save up to 10 opportunities',
                ]),
                'limitations' => json_encode([
                    'Limited bookmarks (10 max)',
                    'Ads displayed while browsing',
                    'No calendar integration',
                    'No AI assistant',
                ]),
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Unlock all features and supercharge your hunt',
                'price_monthly_usd' => 3.50,
                'price_yearly_usd' => 38.00,
                'price_monthly_ngn' => 5000,
                'price_yearly_ngn' => 54000,
                'features' => json_encode([
                    'Unlimited saved opportunities',
                    'Smart reminders via push & email',
                    'Google Calendar sync',
                    'AI Assistant',
                    'Ad-free browsing',
                    'Priority access to new opportunities',
                    'Export saved items (PDF / CSV)',
                ]),
                'limitations' => json_encode([]),
                'is_active' => true,
                'is_popular' => true,
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
