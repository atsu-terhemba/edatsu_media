# Push Notifications & Email Setup Guide

## Overview
The reminder system now sends notifications via:
1. **Email** - Beautiful HTML emails to the user's inbox
2. **Database** - In-app notification badge with count
3. **Broadcast/Push** - Real-time push notifications to user's device

## What's Already Implemented

### 1. Notification Class
- **File**: `app/Notifications/ReminderNotification.php`
- Handles all three notification channels (email, database, broadcast)
- Queued for better performance
- Beautiful email templates with action buttons

### 2. Controller Updates
- **File**: `app/Http/Controllers/SubscriberController.php`
- `setBookmarkReminder()` - Sends notification when reminder is set
- `updateBookmarkReminder()` - Sends notification when reminder is updated

### 3. Database
- Notifications table already exists with proper structure
- Stores notification data with read/unread status

## Setup Instructions

### Step 1: Configure Email Settings

Add these to your `.env` file:

```env
# For Gmail (recommended for testing)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Edatsu"

# For Production (use services like Mailgun, SendGrid, SES)
# MAIL_MAILER=mailgun
# MAILGUN_DOMAIN=your-domain.com
# MAILGUN_SECRET=your-mailgun-key
```

**For Gmail:**
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate an "App Password" for "Mail"
4. Use that password in `MAIL_PASSWORD`

### Step 2: Set Up Queue System

Since notifications are queued, you need a queue worker:

#### Option A: Database Queue (Recommended for now)

1. Update `.env`:
```env
QUEUE_CONNECTION=database
```

2. Create jobs table:
```bash
php artisan queue:table
php artisan migrate
```

3. Run the queue worker:
```bash
php artisan queue:work
```

#### Option B: Redis Queue (For production)
```env
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Step 3: Set Up Push Notifications

Choose one of these services:

#### Option A: Firebase Cloud Messaging (FCM) - Recommended

1. Install the package:
```bash
composer require laravel-notification-channels/fcm
```

2. Get FCM credentials from Firebase Console
3. Add to `.env`:
```env
FCM_SERVER_KEY=your-fcm-server-key
```

4. Create FCM channel in `ReminderNotification.php`:
```php
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;

public function via($notifiable)
{
    return ['mail', 'database', FcmChannel::class];
}

public function toFcm($notifiable)
{
    return FcmMessage::create()
        ->setData([
            'title' => $this->getTitle(),
            'body' => $this->getMessage(),
            'action_url' => $this->getActionUrl()
        ])
        ->setNotification(\NotificationChannels\Fcm\Resources\Notification::create()
            ->setTitle($this->getTitle())
            ->setBody($this->getMessage())
        );
}
```

5. Store FCM tokens in users table:
```bash
php artisan make:migration add_fcm_token_to_users
```

```php
$table->string('fcm_token')->nullable();
```

#### Option B: Pusher Beams

1. Install package:
```bash
composer require pusher/pusher-php-server
```

2. Add to `.env`:
```env
PUSHER_BEAMS_INSTANCE_ID=your-instance-id
PUSHER_BEAMS_SECRET_KEY=your-secret-key
```

#### Option C: WebPush (Browser Push)

1. Install package:
```bash
composer require laravel-notification-channels/webpush
```

2. Publish config:
```bash
php artisan vendor:publish --provider="NotificationChannels\WebPush\WebPushServiceProvider" --tag="config"
php artisan webpush:vapid
```

3. Create subscriptions table:
```bash
php artisan migrate
```

### Step 4: Frontend Integration (for Web Push)

If using WebPush, add this to your frontend:

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered');
            
            // Subscribe to push notifications
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
            }).then(subscription => {
                // Send subscription to server
                axios.post('/api/push-subscriptions', {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
                        auth: arrayBufferToBase64(subscription.getKey('auth'))
                    }
                });
            });
        });
}
```

## Testing

### Test Email
```bash
php artisan tinker
```

```php
$user = App\Models\User::find(1);
$user->notify(new App\Notifications\ReminderNotification(
    'set',
    'Test Opportunity',
    now()->addDays(7),
    1,
    1,
    'test-opportunity'
));
```

Check your email inbox!

### Test Database Notification
```php
$user = App\Models\User::find(1);
$user->notifications; // See all notifications
$user->unreadNotifications; // See unread only
```

### Monitor Queue
```bash
# See failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush
```

## Production Checklist

- [ ] Set up proper mail service (Mailgun/SendGrid/SES)
- [ ] Configure queue driver (Redis recommended)
- [ ] Set up queue worker as supervisor process
- [ ] Choose push notification service (FCM recommended)
- [ ] Test notification delivery on staging
- [ ] Set up notification preferences UI
- [ ] Add notification rate limiting
- [ ] Monitor email deliverability
- [ ] Set up error tracking for failed notifications

## Current Status

✅ Email notification system configured
✅ Database notifications working
✅ Notification badge showing count in header
✅ Queue system ready
⏳ Push notifications - needs service selection
⏳ Queue worker - needs to be running
⏳ Email credentials - needs configuration

## Next Steps

1. **Immediate**: Configure `.env` with email credentials
2. **Immediate**: Start queue worker: `php artisan queue:work`
3. **Soon**: Choose and integrate push notification service
4. **Later**: Add notification preferences for users

## Troubleshooting

### Emails not sending
- Check `.env` mail configuration
- Ensure queue worker is running
- Check `storage/logs/laravel.log`
- Test with: `php artisan tinker` then `Mail::raw('Test', function($msg) { $msg->to('your@email.com'); });`

### Notifications not appearing
- Check notifications table in database
- Verify `is_read` is false
- Check header notification fetching logic
- Clear cache: `php artisan cache:clear`

### Queue not processing
- Ensure queue worker is running
- Check `jobs` table for pending jobs
- Check `failed_jobs` table
- Restart queue: `php artisan queue:restart`
