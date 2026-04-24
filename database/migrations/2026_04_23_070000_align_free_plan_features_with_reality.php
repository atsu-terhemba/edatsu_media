<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Companion to 2026_04_23_060000 — same alignment pass for the Free row.
 * - Tightens bookmark/saved-article quota copy to match the new 5/5 caps
 *   set by 2026_04_23_080000.
 * - Drops `limitations` that named features we never built (Google Calendar
 *   sync, full-text search, keyword alerts).
 * - Advertises forum push (free for everyone, wired in ForumController).
 * - Flags bookmark-reminder push as Pro-only.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! DB::table('subscription_plans')->where('slug', 'free')->exists()) {
            return;
        }

        DB::table('subscription_plans')->where('slug', 'free')->update([
            'features' => json_encode([
                ['text' => 'Save up to 5 opportunities & tools', 'highlight' => false],
                ['text' => 'Save up to 5 articles from feeds',  'highlight' => false],
                ['text' => 'Up to 3 bookmark reminders',         'highlight' => false],
                ['text' => 'Add up to 5 custom RSS feeds',       'highlight' => false],
                ['text' => 'Compare 2 tools side-by-side',       'highlight' => false],
                ['text' => 'Forum & community access',           'highlight' => false],
                ['text' => 'Push alerts for forum activity',     'highlight' => false],
            ]),
            'limitations' => json_encode([
                'Limited bookmarks, reminders, and custom feeds',
                'No push alerts for bookmark deadline reminders',
                'No bulk export (PDF / CSV)',
                'Ads in reading feeds',
            ]),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        if (! DB::table('subscription_plans')->where('slug', 'free')->exists()) {
            return;
        }

        DB::table('subscription_plans')->where('slug', 'free')->update([
            'features' => json_encode([
                ['text' => 'Save up to 10 opportunities & tools', 'highlight' => false],
                ['text' => 'Save up to 20 articles from feeds',   'highlight' => false],
                ['text' => 'Up to 3 bookmark reminders',          'highlight' => false],
                ['text' => 'Add up to 5 custom RSS feeds',        'highlight' => false],
                ['text' => 'Compare 2 tools side-by-side',        'highlight' => false],
                ['text' => 'Weekly digest & community access',    'highlight' => false],
            ]),
            'limitations' => json_encode([
                'Limited bookmarks, reminders, and custom feeds',
                'No push notifications or Google Calendar sync',
                'No full-text search or keyword alerts across feeds',
                'Weekly digest only (no real-time notifications)',
            ]),
            'updated_at' => now(),
        ]);
    }
};
