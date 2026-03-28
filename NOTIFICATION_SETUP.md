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

## Quick Checklist

- [ ] Cron job added: `* * * * * cd /path && php artisan schedule:run >> /dev/null 2>&1`
- [ ] Queue worker running via Supervisor (or manually for dev)
- [ ] `MAIL_MAILER` set to a real provider (not `log`)
- [ ] `MAIL_FROM_ADDRESS` and `MAIL_FROM_NAME` configured
- [ ] `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` set in `.env`
- [ ] Queue worker restarted after each deployment (`php artisan queue:restart`)

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
