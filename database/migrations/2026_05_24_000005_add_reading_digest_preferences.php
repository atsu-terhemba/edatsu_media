<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('user_preferences')) return;

        Schema::table('user_preferences', function (Blueprint $table) {
            if (!Schema::hasColumn('user_preferences', 'reading_digest_optin')) {
                // Off by default: we're introducing this on an existing user
                // base, so explicit opt-in is the safer deliverability stance.
                $table->boolean('reading_digest_optin')->default(false)->after('weekly_digest_last_sent_at');
            }
            if (!Schema::hasColumn('user_preferences', 'reading_digest_last_sent_at')) {
                $table->timestamp('reading_digest_last_sent_at')->nullable()->after('reading_digest_optin');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('user_preferences')) return;
        Schema::table('user_preferences', function (Blueprint $table) {
            if (Schema::hasColumn('user_preferences', 'reading_digest_last_sent_at')) {
                $table->dropColumn('reading_digest_last_sent_at');
            }
            if (Schema::hasColumn('user_preferences', 'reading_digest_optin')) {
                $table->dropColumn('reading_digest_optin');
            }
        });
    }
};
