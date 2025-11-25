# Resend Email Setup for Edatsu

## Quick Setup (3 minutes)

### 1. Get Your Resend API Key

1. Go to https://resend.com/
2. Sign up for a free account (100 emails/day free)
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy the API key (starts with `re_`)

### 2. Configure .env

Add these lines to your `.env` file:

```env
MAIL_MAILER=resend
RESEND_KEY=re_your_api_key_here

MAIL_FROM_ADDRESS=onboarding@resend.dev
MAIL_FROM_NAME="Edatsu"

QUEUE_CONNECTION=database
```

**Note:** Resend's free tier uses `onboarding@resend.dev` as the sender. To use your own domain:
1. Add and verify your domain in Resend dashboard
2. Update `MAIL_FROM_ADDRESS` to `noreply@yourdomain.com`

### 3. Update config/services.php

The Resend configuration is already in your `config/services.php`:

```php
'resend' => [
    'key' => env('RESEND_KEY'),
],
```

### 4. Clear Config Cache

```bash
php artisan config:clear
```

### 5. Start Queue Worker

```bash
php artisan queue:work
```

### 6. Test It!

```bash
php artisan test:reminder-notification 1
```

Check your email inbox! You should receive a beautiful reminder notification.

## Verify Setup

Test email delivery:

```bash
php artisan tinker
```

```php
Mail::raw('Test email from Resend', function($msg) {
    $msg->to('your-email@example.com')
        ->subject('Test Email');
});
```

Check your inbox (and spam folder).

## Production Setup

### Add Your Custom Domain

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `edatsu.com`)
4. Add the DNS records shown (SPF, DKIM, DMARC)
5. Wait for verification (usually 5-30 minutes)
6. Update `.env`:

```env
MAIL_FROM_ADDRESS=noreply@edatsu.com
MAIL_FROM_NAME="Edatsu"
```

### Email Limits

- **Free Tier**: 100 emails/day, 1 domain
- **Paid Tier**: Starts at $20/month for 50k emails

## What Users Will Receive

When a reminder is set/updated, users get an email like:

```
From: Edatsu <noreply@edatsu.com>
Subject: Reminder set for: AI Startup Grant

Hello John Doe!

Your reminder has been set for the opportunity: 
**AI Startup Grant**

You will be reminded on: **Dec 01, 2025 at 10:00 AM**

[View Opportunity]

Thank you for using Edatsu!
```

## Features

✅ Beautiful HTML emails with your branding
✅ Mobile-responsive design
✅ One-click action buttons
✅ Automatic retry on failure (queued)
✅ 99.9% deliverability
✅ DKIM/SPF authentication
✅ Real-time delivery tracking in Resend dashboard

## Troubleshooting

### Emails not sending?

1. Check API key is correct in `.env`
2. Ensure queue worker is running: `php artisan queue:work`
3. Check Resend dashboard for errors
4. Check Laravel logs: `storage/logs/laravel.log`

### Check failed jobs:
```bash
php artisan queue:failed
php artisan queue:retry all
```

### Monitor queue:
```bash
php artisan queue:work --verbose
```

## Next Steps

1. ✅ Set up Resend account
2. ✅ Add API key to `.env`
3. ✅ Start queue worker
4. ✅ Test with command
5. 🔄 Add custom domain (optional, for production)
6. 🔄 Set up push notifications (optional)

---

**Current Status:**
- Resend PHP SDK installed
- Configuration ready
- Just need API key in `.env`
- Queue worker ready to process emails
