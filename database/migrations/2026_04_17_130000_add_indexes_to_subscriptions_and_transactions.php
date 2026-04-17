<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Adds race-safety + hot-path indexes required by the subscription architecture
 * (see docs/SUBSCRIPTION_ARCHITECTURE.md §2).
 *
 * - transactions.reference          → UNIQUE (our tx_ref, must never collide)
 * - transactions.provider_reference → UNIQUE (Flutterwave flw_ref, webhook idempotency key)
 * - subscriptions (user_id, status, ends_at) → composite for isPro() hot path
 *
 * Uses raw DB statements with prefix lengths so the UNIQUE keys fit under the
 * 1000-byte MyISAM key limit with utf8mb4 (see memory note feedback_myisam_keys.md).
 * 100 chars × 4 bytes = 400 bytes — well within budget, and bigger than any real
 * tx_ref / flw_ref value we generate.
 *
 * IMPORTANT: if duplicate values already exist in either column, CREATE UNIQUE
 * INDEX will abort. Run this first to find them:
 *
 *   SELECT reference, COUNT(*) c FROM transactions GROUP BY reference HAVING c > 1;
 *   SELECT provider_reference, COUNT(*) c FROM transactions
 *     WHERE provider_reference IS NOT NULL
 *     GROUP BY provider_reference HAVING c > 1;
 *
 * Dedupe before retrying if any show up.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('transactions')) {
            if (Schema::hasColumn('transactions', 'reference')
                && !$this->indexExists('transactions', 'transactions_reference_unique')) {
                DB::statement('CREATE UNIQUE INDEX transactions_reference_unique ON transactions (reference(100))');
            }

            if (Schema::hasColumn('transactions', 'provider_reference')
                && !$this->indexExists('transactions', 'transactions_provider_reference_unique')) {
                DB::statement('CREATE UNIQUE INDEX transactions_provider_reference_unique ON transactions (provider_reference(100))');
            }
        }

        if (Schema::hasTable('subscriptions')
            && Schema::hasColumn('subscriptions', 'user_id')
            && Schema::hasColumn('subscriptions', 'status')
            && Schema::hasColumn('subscriptions', 'ends_at')
            && !$this->indexExists('subscriptions', 'subscriptions_user_status_ends_idx')) {
            DB::statement('CREATE INDEX subscriptions_user_status_ends_idx ON subscriptions (user_id, status, ends_at)');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('transactions')) {
            if ($this->indexExists('transactions', 'transactions_provider_reference_unique')) {
                DB::statement('DROP INDEX transactions_provider_reference_unique ON transactions');
            }
            if ($this->indexExists('transactions', 'transactions_reference_unique')) {
                DB::statement('DROP INDEX transactions_reference_unique ON transactions');
            }
        }

        if (Schema::hasTable('subscriptions')
            && $this->indexExists('subscriptions', 'subscriptions_user_status_ends_idx')) {
            DB::statement('DROP INDEX subscriptions_user_status_ends_idx ON subscriptions');
        }
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $rows = DB::select('SHOW INDEX FROM `' . $table . '` WHERE Key_name = ?', [$indexName]);
        return count($rows) > 0;
    }
};
