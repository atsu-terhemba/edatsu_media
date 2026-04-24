<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('bookmarks:process-reminders')->everyMinute();
Schedule::command('subscriptions:handle-expired')->daily();

// Saturday 08:00 Africa/Lagos weekly opportunity digest. Single-run guarded
// inside the command via weekly_digest_last_sent_at, so a server restart or
// manual trigger in the same window is a no-op rather than a double-send.
Schedule::command('newsletters:send-weekly-digest')
    ->weeklyOn(6, '08:00')
    ->timezone('Africa/Lagos')
    ->onOneServer();

// Dry-run preview 10 min before the real send. Appends the summary line
// (sent=X, skipped_no_prefs=Y, skipped_no_matches=Z) to digest-dryrun.log
// so we can eyeball the batch size before any mail is queued.
Schedule::command('newsletters:send-weekly-digest --dry-run')
    ->weeklyOn(6, '07:50')
    ->timezone('Africa/Lagos')
    ->appendOutputTo(storage_path('logs/digest-dryrun.log'))
    ->onOneServer();
