<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('pro_gating_settings')) return;
        if (Schema::hasColumn('pro_gating_settings', 'public_lists_max')) return;

        Schema::table('pro_gating_settings', function (Blueprint $table) {
            // Free tier defaults to 1 public reading list — enough to prove the
            // feature works, narrow enough that prolific curators upgrade.
            $table->unsignedInteger('public_lists_max')->default(1)->after('custom_feeds_max');
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('pro_gating_settings')) return;
        if (!Schema::hasColumn('pro_gating_settings', 'public_lists_max')) return;
        Schema::table('pro_gating_settings', function (Blueprint $table) {
            $table->dropColumn('public_lists_max');
        });
    }
};
