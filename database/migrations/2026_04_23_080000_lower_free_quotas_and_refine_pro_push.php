<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Follows 2026_04_23_070000 with two tweaks that only make sense together:
 *  1. Lower Free bookmark/saved-article caps from 10/20 to 5/5 so both types
 *     feel equally "taster-sized" — product call, not a rollback of the
 *     create migration's schema default (leaving those at 10/20 for any
 *     environment that hasn't received this update yet).
 *  2. Drop the redundant "Real-time email & web push notifications" line on
 *     the Pro plan — it double-counts "Smart reminders: push & email alerts"
 *     now that we also advertise forum push as free. The remaining Pro
 *     differentiator on push is the bookmark-deadline reminder.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Clamp any existing caps above the new 5/5 ceiling. We use min() so
        // an admin who manually raised them via the ProGating UI keeps their
        // higher value; we only pull DOWN from the old defaults.
        $row = DB::table('pro_gating_settings')->where('id', 1)->first();
        if ($row) {
            DB::table('pro_gating_settings')->where('id', 1)->update([
                'bookmarks_max' => min((int) $row->bookmarks_max, 5),
                'saved_articles_max' => min((int) $row->saved_articles_max, 5),
                'updated_at' => now(),
            ]);
        }

        if (DB::table('subscription_plans')->where('slug', 'pro')->exists()) {
            DB::table('subscription_plans')->where('slug', 'pro')->update([
                'features' => json_encode([
                    ['text' => 'Unlimited bookmarks & saved articles',         'highlight' => true],
                    ['text' => 'Push & email alerts for bookmark deadlines',   'highlight' => true],
                    ['text' => 'Unlimited custom RSS feeds',                   'highlight' => true],
                    ['text' => 'Forum access with push alerts',                'highlight' => false],
                    ['text' => 'Compare up to 5 tools side-by-side',           'highlight' => false],
                    ['text' => 'Bulk export saved items (PDF / CSV)',          'highlight' => false],
                    ['text' => 'No ads in your reading feeds',                 'highlight' => false],
                ]),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        $row = DB::table('pro_gating_settings')->where('id', 1)->first();
        if ($row) {
            DB::table('pro_gating_settings')->where('id', 1)->update([
                // Restore the old create-migration defaults where they were 5.
                'bookmarks_max' => $row->bookmarks_max <= 5 ? 10 : $row->bookmarks_max,
                'saved_articles_max' => $row->saved_articles_max <= 5 ? 20 : $row->saved_articles_max,
                'updated_at' => now(),
            ]);
        }

        if (DB::table('subscription_plans')->where('slug', 'pro')->exists()) {
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
    }
};
