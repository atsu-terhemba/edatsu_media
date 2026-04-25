<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Manual subscription activations (admin flips a pending sub to active
 * because a webhook never fired) need to leave an audit trail. Without
 * this, finance reconciliation against bank statements has no way to
 * tell a real Flutterwave activation from one ops did by hand.
 *
 * Two columns on `subscriptions`:
 * - activated_by_admin_id: who pressed the button. Plain int (no FK
 *   per project memory: tables are MyISAM and FKs are silently dropped).
 * - admin_activation_note: the why — required at the controller layer.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('subscriptions')) {
            return;
        }

        Schema::table('subscriptions', function (Blueprint $table) {
            if (!Schema::hasColumn('subscriptions', 'activated_by_admin_id')) {
                $table->unsignedBigInteger('activated_by_admin_id')->nullable()->after('provider_subscription_id');
                $table->index('activated_by_admin_id');
            }
            if (!Schema::hasColumn('subscriptions', 'admin_activation_note')) {
                $table->text('admin_activation_note')->nullable()->after('activated_by_admin_id');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('subscriptions')) {
            return;
        }

        Schema::table('subscriptions', function (Blueprint $table) {
            if (Schema::hasColumn('subscriptions', 'admin_activation_note')) {
                $table->dropColumn('admin_activation_note');
            }
            if (Schema::hasColumn('subscriptions', 'activated_by_admin_id')) {
                $table->dropIndex(['activated_by_admin_id']);
                $table->dropColumn('activated_by_admin_id');
            }
        });
    }
};
