# Notification & Background Jobs Setup

This document explains the server-side configuration required for push notifications, bookmark reminders, and email delivery to work in production.

---

## Overview

Three components must be running on your server for the notification system to function:

| Component | Command | Purpose |
|-----------|---------|---------|
| Cron Job | `php artisan schedule:run` | Triggers scheduled tasks (bookmark reminders) |
| Queue Worker | `php artisan queue:work` | Processes queued jobs (push notifications, emails) |
| Mail Driver | `.env` configuration | Sends real emails instead of writing to log files |

Without all three, the notification chain breaks. Here's how they connect:

```
Cron (every minute)
  -> Scheduler finds due tasks (e.g., bookmark reminder at 9am)
    -> Dispatches a notification job to the queue
      -> Queue worker picks up the job
        -> Sends web push (via VAPID/web-push)
        -> Sends email (via configured mail driver)
          -> User receives notification on device + inbox
```

---

## 1. Cron Job

### What it does

Laravel's task scheduler defines recurring jobs in code (e.g., "check for due bookmark reminders every minute"). The OS cron daemon wakes Laravel up every minute to check if any tasks are due.

Without the cron job, Laravel never checks for scheduled tasks — reminders and scheduled notifications will silently never fire.

### Setup

SSH into your server and open the crontab:

```bash
crontab -e
```

Add this single line:

```
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Replace `/path-to-your-project` with the absolute path to your Laravel installation (e.g., `/var/www/edatsu_media`).

### Verify it's working

```bash
# List active cron jobs
crontab -l

# Manually test the scheduler
cd /path-to-your-project
php artisan schedule:run
```

You should see output indicating which scheduled tasks were checked/executed.

### What it powers

- Bookmark reminders — checks every minute for reminders where `reminder_date` has passed and `reminder_sent` is false
- Any future scheduled tasks added via `app/Console/Kernel.php`

---

## 2. Queue Worker

### What it does

When your app needs to send a push notification or email, doing it during the HTTP request would make the page slow for the user. Instead, Laravel **queues** the job — it writes a record to the `jobs` database table saying "send this notification later."

The queue worker is a long-running process that watches the jobs table and processes each job as it arrives. This keeps your web responses fast while heavy work (sending emails, hitting external APIs) happens in the background.

Without a running queue worker, jobs pile up in the `jobs` table and never execute.

### Setup (Development)

For local development, you can run it manually:

```bash
cd /path-to-your-project
php artisan queue:work --sleep=3 --tries=3
```

- `--sleep=3` — wait 3 seconds between polling when the queue is empty
- `--tries=3` — retry failed jobs up to 3 times before marking them as failed

### Setup (Production with Supervisor)

In production, use **Supervisor** to keep the worker running and auto-restart it if it crashes.

Install Supervisor:

```bash
# Ubuntu/Debian
sudo apt-get install supervisor

# CentOS/RHEL
sudo yum install supervisor
```

Create a configuration file:

```bash
sudo nano /etc/supervisor/conf.d/edatsu-worker.conf
```

Add the following:

```ini
[program:edatsu-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path-to-your-project/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path-to-your-project/storage/logs/worker.log
stopwaitsecs=3600
```

Replace `/path-to-your-project` with your actual path and `www-data` with your web server user.

Start the worker:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start edatsu-worker:*
```

### Verify it's working

```bash
# Check worker status
sudo supervisorctl status edatsu-worker:*

# Check for failed jobs
cd /path-to-your-project
php artisan queue:failed

# Retry all failed jobs
php artisan queue:retry all
```

### Important: Restart after deployments

After deploying new code, restart the queue worker so it picks up the changes:

```bash
cd /path-to-your-project
php artisan queue:restart
```

### What it powers

- Web push notifications (sent via `minishlink/web-push` with VAPID keys)
- Email notifications (bookmark reminders, account alerts)
- Any jobs dispatched via `dispatch()` or `Mail::queue()`

---

## 3. Mail Driver

### What it does

The `MAIL_MAILER` setting in `.env` controls how Laravel sends emails. When set to `log` (the development default), emails are written to `storage/logs/laravel.log` instead of actually being delivered. This is useful for development but means no real emails go out in production.

### Current state

```env
MAIL_MAILER=log  # Emails go to storage/logs/laravel.log — NOT delivered
```

### Setup with Resend (recommended)

[Resend](https://resend.com) is simple to set up and has a free tier (3,000 emails/month).

1. Sign up at resend.com and get an API key
2. Verify your sending domain (e.g., `edatsu.com`)
3. Install the Laravel package:

```bash
composer require resend/resend-laravel
```

4. Update `.env`:

```env
MAIL_MAILER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
MAIL_FROM_ADDRESS=notifications@edatsu.com
MAIL_FROM_NAME="Edatsu Media"
```

### Setup with SMTP

Works with any SMTP provider (Gmail, Mailgun, Amazon SES, etc.).

Update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=notifications@edatsu.com
MAIL_FROM_NAME="Edatsu Media"
```

### Verify it's working

```bash
cd /path-to-your-project

# Send a test email via tinker
php artisan tinker
>>> Mail::raw('Test email from Edatsu', function($msg) { $msg->to('your@email.com')->subject('Test'); });
```

Check your inbox. If the email arrives, the mail driver is configured correctly.

### What it powers

- Bookmark reminder emails
- Account verification emails
- Password reset emails
- Any future email notifications

---

## Web Push Notifications (VAPID Keys)

Web push notifications are already configured in the codebase. They require VAPID keys in your `.env`:

```env
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
```

If these are not set, generate them:

```bash
cd /path-to-your-project
php artisan webpush:vapid
```

This will output a public/private key pair. Add them to your `.env` file.

### How web push works

1. User visits the site, browser registers a service worker (`/sw.js`)
2. App requests notification permission and subscribes via the Push API
3. Subscription endpoint is stored in the `push_subscriptions` table
4. When a notification is triggered, the queue worker sends it via `minishlink/web-push` using the VAPID keys
5. The browser's push service delivers it to the user's device — even if the browser tab is closed

---

## Weekly Opportunity Digest

The Saturday-morning digest (`newsletters:send-weekly-digest`) reuses the cron + queue worker + mail driver you already set up above — no new infrastructure, but a few things must be true for any mail to leave the box.

### What fires when

Both entries live in `routes/console.php`:

| Cron | Local time (Africa/Lagos) | What happens |
|------|---------------------------|--------------|
| `newsletters:send-weekly-digest --dry-run` | Saturday 07:50 | Logs `sent=X, skipped_no_prefs=Y, skipped_no_matches=Z` to `storage/logs/digest-dryrun.log`. No mail queued. |
| `newsletters:send-weekly-digest` | Saturday 08:00 | Queues one `WeeklyOpportunityDigest` mailable per matched user. |

The command is idempotent: `weekly_digest_last_sent_at` on `user_preferences` blocks a re-send within 5 days, so a scheduler overlap or manual trigger in the same window is a no-op.

### Required for delivery

- **Cron job** — same `* * * * * php artisan schedule:run` line above. Without it, neither entry fires.
- **Queue worker** — the mailable is `ShouldQueue`; without a worker, jobs pile up in the `jobs` table and no email leaves. Supervisor config above already covers this.
- **Mail driver** — `MAIL_MAILER` must be a real provider. On `log` the digest "sends" silently to `storage/logs/laravel.log`.
- **Queue backend** — `QUEUE_CONNECTION=database` (default) needs the `jobs` table migrated. `sync` works but blocks the scheduler for SMTP latency on every user.

### Ad slot (optional)

The email has a single ad block in the footer rendered from `ad_settings` when a matching row exists:

```sql
INSERT INTO ad_settings (slot_name, page, position, size, ad_type, image_url, link_url, link_target, is_active, is_visible, is_feed_ad, `order`, created_at, updated_at)
VALUES ('newsletter_footer', 'newsletter', 'footer', '600x150', 'image', 'https://...', 'https://...', '_blank', 1, 1, 0, 0, NOW(), NOW());
```

`page='all'` also matches. If no row is found, the ad slot is simply omitted — the email still ships.

### Opt-out paths

- One-click: signed-URL link at the bottom of the email (`/newsletter/weekly-digest/unsubscribe/{user}`). No auth required — the signature is the auth.
- Settings: the "Weekly Opportunity Digest" toggle on `/preferences` writes `weekly_digest_optin` directly.

Both flip the same flag, so a user who opts out via either never gets the digest again unless they re-enable it on `/preferences`.

### Log rotation

`storage/logs/digest-dryrun.log` grows ~1 line/week (empty weeks skip it). If you ever tail it and it's huge, that's a sign the command is failing mid-run — check `storage/logs/laravel.log` for the stacktrace. Add to logrotate if you care:

```
/path-to-your-project/storage/logs/digest-dryrun.log {
    monthly
    rotate 6
    missingok
    notifempty
    compress
}
```

### Verify end-to-end

```bash
# Fake the send for yourself to see the real email
cd /path-to-your-project
php artisan newsletters:send-weekly-digest --user=<your-user-id>

# Inspect what would happen in the real batch, no mail queued
php artisan newsletters:send-weekly-digest --dry-run

# Worker log will show the queued job being picked up
tail -f storage/logs/worker.log
```

If `--user=<id>` reports "sent=1" but no email arrives, the queue worker isn't running or the mail driver is still `log`.

---

## Quick Checklist

- [ ] Cron job added: `* * * * * cd /path && php artisan schedule:run >> /dev/null 2>&1`
- [ ] Queue worker running via Supervisor (or manually for dev)
- [ ] `MAIL_MAILER` set to a real provider (not `log`)
- [ ] `MAIL_FROM_ADDRESS` and `MAIL_FROM_NAME` configured
- [ ] `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` set in `.env`
- [ ] Queue worker restarted after each deployment (`php artisan queue:restart`)
- [ ] Weekly digest dry-run confirmed once: `php artisan newsletters:send-weekly-digest --dry-run`
- [ ] (Optional) `ad_settings` row with `page='newsletter'` for the footer ad slot

---

## Troubleshooting

### Notifications not sending

1. Check the queue worker is running: `sudo supervisorctl status`
2. Check for failed jobs: `php artisan queue:failed`
3. Check the log: `tail -f storage/logs/laravel.log`

### Emails going to log file

Your `MAIL_MAILER` is still set to `log`. Update `.env` to a real provider.

### Bookmark reminders not triggering

1. Verify the cron job is active: `crontab -l`
2. Run the scheduler manually: `php artisan schedule:run`
3. Check that the queue worker is processing the dispatched jobs

### Push notifications not received

1. Verify VAPID keys are set in `.env`
2. Check that the user has granted notification permission in their browser
3. Check the `push_subscriptions` table has an entry for the user
4. Ensure the queue worker is running to process the push jobs
