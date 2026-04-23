<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Replaces the marketed Pro feature list with one that matches what
 * FeatureGate actually enforces. Drops items that were advertised but
 * never built (Google Calendar sync, reader mode, full-text search +
 * keyword alerts) and softens copy that implied unenforced quotas
 * (forum threads/replies). Adds tool-compare and ad-free-in-feeds —
 * those land in subsequent migrations.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! DB::table('subscription_plans')->where('slug', 'pro')->exists()) {
            return;
        }

        DB::table('subscription_plans')->where('slug', 'pro')->update([
            'features' => json_encode([
                ['text' => 'Unlimited bookmarks & saved articles', 'highlight' => true],
                ['text' => 'Smart reminders: push & email alerts',  'highlight' => true],
                ['text' => 'Unlimited custom RSS feeds',            'highlight' => true],
                ['text' => 'Forum access',                          'highlight' => false],
                ['text' => 'Compare up to 5 tools side-by-side',    'highlight' => false],
                ['text' => 'Real-time web push & email notifications', 'highlight' => false],
                ['text' => 'Bulk export saved items (PDF / CSV)',   'highlight' => false],
                ['text' => 'No ads in your reading feeds',          'highlight' => false],
            ]),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        if (! DB::table('subscription_plans')->where('slug', 'pro')->exists()) {
            return;
        }

        DB::table('subscription_plans')->where('slug', 'pro')->update([
            'features' => json_encode([
                ['text' => 'Unlimited bookmarks & saved articles', 'highlight' => true],
                ['text' => 'Smart reminders: push, email & Google Calendar sync', 'highlight' => true],
                ['text' => 'Unlimited custom RSS feeds & reader mode', 'highlight' => true],
                ['text' => 'Full-text search & keyword alerts across feeds', 'highlight' => true],
                ['text' => 'Unlimited forum threads & replies',     'highlight' => false],
                ['text' => 'Compare up to 5 tools side-by-side',    'highlight' => false],
                ['text' => 'Real-time email & web push notifications', 'highlight' => false],
                ['text' => 'Bulk export saved items (PDF / CSV)',   'highlight' => false],
            ]),
            'updated_at' => now(),
        ]);
    }
};
