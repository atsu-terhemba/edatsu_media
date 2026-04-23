<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds is_feed_ad so admins can mark ads that render inside reading
 * feeds (between opportunity cards, between articles, etc.). The
 * Inertia adSettings share strips these for Pro users so paying
 * subscribers get an ad-free reading experience.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('ad_settings') || Schema::hasColumn('ad_settings', 'is_feed_ad')) {
            return;
        }

        Schema::table('ad_settings', function (Blueprint $table) {
            $table->boolean('is_feed_ad')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        if (Schema::hasTable('ad_settings') && Schema::hasColumn('ad_settings', 'is_feed_ad')) {
            Schema::table('ad_settings', function (Blueprint $table) {
                $table->dropColumn('is_feed_ad');
            });
        }
    }
};
