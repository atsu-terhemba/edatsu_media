# Quick Start: Email & Push Notifications

## What We Just Built

Your reminder system now sends **three types of notifications** when a user sets or updates a reminder:

1. ✉️ **Email** - Beautiful HTML email to user's inbox
2. 📱 **Push Notification** - Real-time notification to user's device (browser/mobile)
3. 🔔 **Database Notification** - In-app notification with badge count (already working)

## Files Created/Modified

### New Files
- `app/Notifications/ReminderNotification.php` - Main notification class
- `app/Console/Commands/TestReminderNotification.php` - Test command
- `docs/PUSH_NOTIFICATIONS_EMAIL_SETUP.md` - Detailed setup guide
- `.env.notifications.example` - Configuration template

### Modified Files
- `app/Http/Controllers/SubscriberController.php` - Updated to use Laravel notifications

## Quick Setup (5 minutes)

### 1. Configure Email with Resend

**Get Resend API Key:**
1. Go to https://resend.com/ and sign up (free tier: 100 emails/day)
2. Create an API key from the dashboard
3. Copy the API key (starts with `re_`)

**Update your `.env` file:**

```env
MAIL_MAILER=resend
RESEND_KEY=re_your_api_key_here

MAIL_FROM_ADDRESS=onboarding@resend.dev
MAIL_FROM_NAME="Edatsu"

QUEUE_CONNECTION=database
```

**Note:** Free tier uses `onboarding@resend.dev`. For production, add your domain in Resend and use `noreply@yourdomain.com`.

### 2. Clear Config Cache

```bash
php artisan config:clear
```

### 3. Start Queue Worker

Open a **new terminal** and run:

```bash
php artisan queue:work
```

Leave this running in the background.

### 4. Test It!

```bash
php artisan test:reminder-notification 1
```

Replace `1` with any user ID in your system.

**Check:**
- ✓ Email should arrive in inbox (check spam if not)
- ✓ Notification appears in database (`notifications` table)
- ✓ Badge count increases in header

## How It Works Now

When a user sets/updates a reminder:

```php
// Old way (manual)
Notification::create([...]);

// New way (automatic email + push + database)
$user->notify(new ReminderNotification(...));
```

### What Happens:

1. User clicks "Set Reminder" button
2. `SubscriberController` calls `$user->notify()`
3. Laravel queues the notification job
4. Queue worker picks up the job
5. Sends email via SMTP
6. Saves to database (for badge count)
7. Broadcasts for push notifications (if configured)

## Email Preview

Users will receive an email like:

```
Subject: Reminder set for: [Opportunity Name]

Hello [User Name]!

Your reminder has been set for the opportunity: **[Opportunity Name]**

You will be reminded on: **Dec 01, 2025 at 10:00 AM**

[View Opportunity Button]

Thank you for using Edatsu!
```

## Adding Push Notifications (Optional)

The notification system is **ready for push**, you just need to choose a service:

### Option A: Firebase Cloud Messaging (Best for mobile apps)
```bash
composer require laravel-notification-channels/fcm
```

### Option B: WebPush (Best for browser notifications)
```bash
composer require laravel-notification-channels/webpush
php artisan webpush:vapid
```

### Option C: Pusher Beams (Easiest to set up)
```bash
composer require pusher/pusher-php-server
```

See `docs/PUSH_NOTIFICATIONS_EMAIL_SETUP.md` for detailed instructions.

## Troubleshooting

### Emails not sending?

1. Check queue worker is running:
   ```bash
   php artisan queue:work
   ```

2. Check failed jobs:
   ```bash
   php artisan queue:failed
   ```

3. Check Laravel logs:
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. Test mail config:
   ```bash
   php artisan tinker
   >>> Mail::raw('Test', function($msg) { $msg->to('your@email.com'); });
   ```

### Queue not processing?

- Restart queue worker: `php artisan queue:restart`
- Check `jobs` table for pending jobs
- Ensure `QUEUE_CONNECTION=database` in `.env`

### Notification badge not updating?

- Check `notifications` table has new entries
- Verify `is_read` is `false`
- Check browser console for fetch errors

## Production Deployment

Before going live:

1. ✅ Switch to production mail service (Mailgun/SendGrid)
2. ✅ Use Redis for queue (`QUEUE_CONNECTION=redis`)
3. ✅ Set up Supervisor to keep queue worker running
4. ✅ Configure push notification service
5. ✅ Test email deliverability
6. ✅ Set up notification preferences UI

## Monitoring

Watch queue in real-time:

```bash
# Terminal 1: Queue worker
php artisan queue:work --verbose

# Terminal 2: Database monitoring
php artisan tinker
>>> DB::table('jobs')->count()
>>> DB::table('notifications')->where('created_at', '>', now()->subHour())->count()
```

## Current Status

✅ Notification class created
✅ Controller updated
✅ Queue system ready
✅ Test command available
⏳ Email config needed
⏳ Queue worker needs to run
⏳ Push service optional

## Next Steps

1. **Now**: Configure email in `.env`
2. **Now**: Start queue worker
3. **Now**: Test with `php artisan test:reminder-notification`
4. **Later**: Choose and add push notification service
5. **Later**: Create notification preferences page

---

**Need help?** Check `docs/PUSH_NOTIFICATIONS_EMAIL_SETUP.md` for detailed instructions.
