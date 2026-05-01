<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds opt-in + idempotency columns for the Saturday-morning opportunity
 * digest. Opt-in defaults to true — existing users are auto-subscribed and
 * can opt out via the email's unsubscribe link or the preferences page.
 * `weekly_digest_last_sent_at` is the belt-and-braces guard against the
 * command running twice in one week (manual kick-off, scheduler overlap).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('user_preferences')) {
            return;
        }

        Schema::table('user_preferences', function (Blueprint $table) {
            if (!Schema::hasColumn('user_preferences', 'weekly_digest_optin')) {
                $table->boolean('weekly_digest_optin')->default(true);
            }
            if (!Schema::hasColumn('user_preferences', 'weekly_digest_last_sent_at')) {
                $table->timestamp('weekly_digest_last_sent_at')->nullable()->after('weekly_digest_optin');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('user_preferences')) {
            return;
        }

        Schema::table('user_preferences', function (Blueprint $table) {
            if (Schema::hasColumn('user_preferences', 'weekly_digest_last_sent_at')) {
                $table->dropColumn('weekly_digest_last_sent_at');
            }
            if (Schema::hasColumn('user_preferences', 'weekly_digest_optin')) {
                $table->dropColumn('weekly_digest_optin');
            }
        });
    }
};
