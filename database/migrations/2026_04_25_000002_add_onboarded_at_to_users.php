<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds onboarded_at to users so the subscriber intro tour fires once
 * for new accounts and never again. Stamping a timestamp (vs a boolean)
 * lets us see WHEN they finished the tour for funnel analysis without
 * a second column. NULL = never seen the tour.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'onboarded_at')) {
                $table->timestamp('onboarded_at')->nullable()->after('last_seen_at');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'onboarded_at')) {
                $table->dropColumn('onboarded_at');
            }
        });
    }
};
