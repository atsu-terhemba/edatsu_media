<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ad_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('ad_settings', 'ad_type')) {
                $table->string('ad_type', 20)->default('adsense')->after('ad_code');
            }
            if (!Schema::hasColumn('ad_settings', 'image_url')) {
                $table->string('image_url')->nullable()->after('ad_type');
            }
            if (!Schema::hasColumn('ad_settings', 'link_url')) {
                $table->string('link_url')->nullable()->after('image_url');
            }
            if (!Schema::hasColumn('ad_settings', 'link_target')) {
                $table->string('link_target', 20)->default('_blank')->after('link_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('ad_settings', function (Blueprint $table) {
            $table->dropColumn(['ad_type', 'image_url', 'link_url', 'link_target']);
        });
    }
};
