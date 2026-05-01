<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Relax the global UNIQUE constraint on transactions.provider_reference.
 *
 * Why: Girostack reuses the same internal `account` ID across some create-
 * collection-account responses (observed when the parent VBA's processor
 * recycles its object id). Once a previous attempt is marked failed, its
 * provider_reference lingers — when Girostack returns the same id for a
 * retry, the unique index rejects the new write with a 1062 violation:
 *
 *   "Duplicate entry '681dcc97...' for key
 *    'transactions.transactions_provider_reference_unique'"
 *
 * Webhook matching does not depend on DB-level uniqueness — both
 * handleGirostackWebhook and handleOpayWebhook scope by status='pending',
 * so a stale failed row with the same provider_reference can't be
 * mismatched. We replace UNIQUE with a non-unique index so the webhook
 * lookup stays fast.
 *
 * Also nulls out provider_reference on existing failed rows as a one-time
 * heal — anyone whose retry is currently blocked stops being blocked
 * after this runs.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('transactions')) {
            return;
        }

        // 1. Free up any failed-state rows that are sitting on a
        //    provider_reference. Defensive — abandonPendingForUser()
        //    handles new ones going forward.
        DB::table('transactions')
            ->where('status', 'failed')
            ->whereNotNull('provider_reference')
            ->update(['provider_reference' => null]);

        // 2. Swap the unique index for a non-unique index of the same shape.
        //    Done as drop-then-create so the webhook lookup keeps using an
        //    index for `where provider_reference = ?`.
        if ($this->indexExists('transactions', 'transactions_provider_reference_unique')) {
            DB::statement('DROP INDEX transactions_provider_reference_unique ON transactions');
        }

        if (!$this->indexExists('transactions', 'transactions_provider_reference_index')) {
            // 100-char prefix matches the original UNIQUE definition — stays
            // under the MyISAM 1000-byte key limit with utf8mb4 (see memory
            // feedback_myisam_keys.md).
            DB::statement('CREATE INDEX transactions_provider_reference_index ON transactions (provider_reference(100))');
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('transactions')) {
            return;
        }

        if ($this->indexExists('transactions', 'transactions_provider_reference_index')) {
            DB::statement('DROP INDEX transactions_provider_reference_index ON transactions');
        }

        // Re-creating UNIQUE will fail if duplicates exist by the time someone
        // rolls back. That's fine — the rollback will surface them and the
        // operator can decide what to do.
        if (!$this->indexExists('transactions', 'transactions_provider_reference_unique')) {
            DB::statement('CREATE UNIQUE INDEX transactions_provider_reference_unique ON transactions (provider_reference(100))');
        }
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $rows = DB::select('SHOW INDEX FROM `' . $table . '` WHERE Key_name = ?', [$indexName]);
        return count($rows) > 0;
    }
};
