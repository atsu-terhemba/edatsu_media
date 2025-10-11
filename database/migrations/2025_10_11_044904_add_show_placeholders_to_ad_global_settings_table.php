<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ad_global_settings', function (Blueprint $table) {
            $table->boolean('show_placeholders')->default(true)->after('ads_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_global_settings', function (Blueprint $table) {
            $table->dropColumn('show_placeholders');
        });
    }
};
