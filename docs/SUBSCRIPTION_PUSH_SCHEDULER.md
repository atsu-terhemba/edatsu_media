# Edatsu Media — Subscription, Push Notifications & Scheduler

Technical documentation covering the payment/subscription system, web push notifications, and background task scheduling.

---

## Table of Contents

1. [Subscription & Payment System](#1-subscription--payment-system)
2. [Web Push Notifications](#2-web-push-notifications)
3. [Scheduler & Queue Worker](#3-scheduler--queue-worker)
4. [Environment Variables](#4-environment-variables)
5. [Deployment](#5-deployment)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Subscription & Payment System

### Overview

Users can subscribe to a **Pro** plan (or stay on **Free**) using Flutterwave as the payment gateway. Flutterwave supports card payments, bank transfers, and USSD. A stablecoin (crypto) payment option is planned for the future.

### Pricing

| Plan | Monthly (NGN) | Monthly (USD) | Yearly (NGN) | Yearly (USD) |
|------|--------------|--------------|--------------|--------------|
| Free | 0            | 0            | 0            | 0            |
| Pro  | 5,000        | $3.50        | 54,000       | $38.00       |

Yearly pricing includes a ~10% discount.

### Database Schema

Three tables power the subscription system:

**`subscription_plans`** — Stores available plans (Free, Pro).
- `name`, `slug` — Plan identity
- `price_monthly_usd`, `price_yearly_usd`, `price_monthly_ngn`, `price_yearly_ngn` — Dual-currency pricing
- `features` (JSON) — Array of feature strings displayed on the pricing page
- `limitations` (JSON) — Array of limitation strings for the Free plan
- `is_active`, `is_popular`, `sort_order` — Display control

The Free and Pro plans are seeded directly inside the migration (`2026_03_22_000001_create_subscription_plans_table.php`), so they are inserted automatically when `php artisan migrate` runs. This is a one-time operation.

**`subscriptions`** — Tracks each user's subscription.
- `user_id`, `subscription_plan_id` — Links user to plan
- `billing_period` — `monthly` or `yearly`
- `currency` — `NGN` or `USD`
- `amount` — Amount paid
- `status` — `pending`, `active`, `cancelled`, `expired`
- `starts_at`, `ends_at` — Subscription period
- `cancelled_at` — When the user cancelled (still active until `ends_at`)
- `payment_provider` — `flutterwave` (or `stablecoin` in future)
- `provider_subscription_id` — External reference from payment provider
- `auto_renew` — Boolean flag

**`transactions`** — Payment history.
- `user_id`, `subscription_id` — Links to user and subscription
- `reference` — Internal unique reference (e.g., `EDATSU-ABCDEF123456-1711100000`)
- `provider_reference` — Flutterwave transaction ID
- `payment_provider`, `payment_method` — e.g., `flutterwave`, `card`
- `amount`, `currency`, `status` — Payment details
- `type` — `subscription`, `renewal`, `upgrade`, `refund`
- `description` — Human-readable description
- `provider_response` (JSON, hidden) — Full response from Flutterwave
- `paid_at` — When payment was confirmed

### Payment Flow

```
User selects Pro plan on /upgrade-plan
    |
    v
Clicks "Upgrade Now" --> Payment Offcanvas opens
    |
    v
Selects billing period (monthly/yearly), currency (NGN/USD), payment method (Flutterwave)
    |
    v
Frontend POSTs to /subscription/initiate
    |
    v
SubscriptionController::initiatePayment()
    - Validates plan exists and is active
    - Creates a pending Transaction record
    - Creates a pending Subscription record
    - Calls FlutterwaveService::initializePayment()
    - Returns Flutterwave hosted payment URL
    |
    v
User is redirected to Flutterwave checkout page
    |
    v
User completes payment (card / bank transfer / USSD)
    |
    v
Flutterwave redirects to /subscription/callback
    |
    v
SubscriptionController::handleCallback()
    - Verifies transaction with Flutterwave API
    - Validates amount, currency, and status match
    - Activates subscription (sets starts_at, ends_at, status=active)
    - Updates transaction (status=successful, payment_method, paid_at)
    - Redirects to /billing with success message
```

### Webhook (Backup Verification)

Flutterwave also sends a webhook POST to `/webhook/flutterwave` for every completed charge. This acts as a backup in case the redirect callback fails (e.g., user closes browser).

- The endpoint is excluded from CSRF protection in `bootstrap/app.php`
- Webhook signature is validated using `FLUTTERWAVE_WEBHOOK_HASH`
- Same verification and activation logic as the callback

### Key Backend Files

| File | Purpose |
|------|---------|
| `app/Http/Controllers/SubscriptionController.php` | All subscription endpoints |
| `app/Services/FlutterwaveService.php` | Flutterwave API integration |
| `app/Models/SubscriptionPlan.php` | Plan model with `getPrice()` helper |
| `app/Models/Subscription.php` | Subscription model with `isActive()`, `daysRemaining()` |
| `app/Models/Transaction.php` | Transaction model |
| `app/Models/User.php` | `isPro()`, `activeSubscription()`, `currentPlanName()` |
| `config/services.php` | Flutterwave credentials config |

### Key Frontend Files

| File | Purpose |
|------|---------|
| `resources/js/Pages/Upgrade.jsx` | Pricing page with plan cards and payment Offcanvas |
| `resources/js/Pages/Subscriber/Billing.jsx` | Billing page with current plan, transaction history, cancel flow |
| `resources/js/Pages/Profile/Edit.jsx` | Profile page with plan indicator card |
| `resources/js/Pages/Subscriber/Dashboard.jsx` | Dashboard with plan status card |
| `resources/js/Pages/Subscriber/Components/SideNav.jsx` | Sidebar with Billing link |

### Subscription Status in the UI

Subscription data is available globally via Inertia shared props (`HandleInertiaRequests.php`):

```php
'auth' => [
    'user' => $request->user(),
    'currentPlan' => 'Free' or 'Pro',
    'isPro' => true/false,
]
```

Access from any React component:

```jsx
const { auth } = usePage().props;
// auth.currentPlan, auth.isPro
```

Plan indicators appear on:
- **Profile Settings** (`/profile`) — Card showing plan name, status, renewal date, and Upgrade/Billing link
- **Subscriber Dashboard** (`/subscriber-dashboard`) — Compact plan card above stats
- **Billing Page** (`/billing`) — Full plan card with cancel option and transaction history
- **Upgrade Page** (`/upgrade-plan`) — Active subscription banner for Pro users

### Routes

| Method | URL | Controller Method | Auth | Purpose |
|--------|-----|-------------------|------|---------|
| GET | `/upgrade-plan` | `showUpgrade` | No | Pricing page |
| POST | `/subscription/initiate` | `initiatePayment` | Yes | Start Flutterwave payment |
| GET | `/subscription/callback` | `handleCallback` | No | Flutterwave redirect |
| POST | `/webhook/flutterwave` | `handleWebhook` | No* | Flutterwave webhook |
| GET | `/billing` | `billing` | Yes | Billing & history page |
| POST | `/subscription/cancel` | `cancelSubscription` | Yes | Cancel subscription |

*No CSRF, validated by webhook hash signature.

### Cancellation

When a user cancels:
- `status` is set to `cancelled`, `cancelled_at` is set to now
- `auto_renew` is set to false
- The user retains access until `ends_at`
- After `ends_at`, the `HandleExpiredSubscriptions` command marks it as `expired`

---

## 2. Web Push Notifications

### Overview

Web push notifications use the **Web Push Protocol (RFC 8030)** via the `minishlink/web-push` PHP library. Notifications are delivered through the browser's native push service and work even when:
- The user is on a different tab
- The browser is minimized
- The user is logged out (as long as the browser is open)

### How It Works

```
1. User enables push notifications in /notification-settings
       |
       v
2. Browser requests permission --> User clicks "Allow"
       |
       v
3. Browser subscribes to push service (FCM for Chrome, Mozilla for Firefox)
       |
       v
4. Frontend sends subscription keys to /api/push/subscribe
       |
       v
5. Server stores endpoint + encryption keys in push_subscriptions table
       |
       v
6. When a reminder is due, ProcessBookmarkReminders command:
   - Creates in-app notification (DB)
   - Calls WebPushService::sendToUser()
       |
       v
7. WebPushService encrypts payload with user's p256dh key
   and sends to browser's push endpoint
       |
       v
8. Browser push service delivers to service worker (sw.js)
       |
       v
9. Service worker shows native OS notification
       |
       v
10. User clicks notification --> navigates to the relevant page
```

### VAPID Keys

VAPID (Voluntary Application Server Identification) keys authenticate the server with push services.

**Generate keys:**
```bash
npx web-push generate-vapid-keys
```

**Add to `.env`:**
```
VAPID_PUBLIC_KEY=BHAJXuL1kMi...
VAPID_PRIVATE_KEY=_eu5kPzkaD3...
```

The public key is shared to the frontend via Inertia (`HandleInertiaRequests.php` shares `vapidPublicKey`).

### Service Worker (`public/sw.js`)

The service worker handles three concerns:

1. **Offline caching** — Precaches critical assets, serves offline fallback page for navigation failures, cache-first for static assets.

2. **Push event** — Listens for incoming push messages, parses the JSON payload, and shows a native notification with title, body, icon, badge, and a click URL.

3. **Notification click** — When the user clicks a notification, it navigates to the URL from the payload. It reuses an existing browser window if available, otherwise opens a new one.

The service worker is registered in `resources/js/app.jsx` on page load.

### Key Files

| File | Purpose |
|------|---------|
| `public/sw.js` | Service worker — push handler, offline cache |
| `resources/js/hooks/usePushNotifications.js` | React hook for subscribe/unsubscribe |
| `resources/js/Pages/Subscriber/NotificationSettings.jsx` | Push toggle UI |
| `app/Services/WebPushService.php` | Server-side push sending via minishlink/web-push |
| `app/Models/PushSubscription.php` | Stores browser push endpoints + encryption keys |
| `app/Models/Notification.php` | In-app notification model |
| `config/webpush.php` | VAPID key configuration |

### Push Subscription API

| Method | URL | Purpose |
|--------|-----|---------|
| POST | `/api/push/subscribe` | Store push subscription (endpoint + keys) |
| POST | `/api/push/unsubscribe` | Remove push subscription |

Both endpoints require authentication. The subscription is tied to `user_id`, so when the server sends a push, it looks up all subscriptions for that user (they may have multiple browsers/devices).

### Expired Subscriptions

When a push endpoint expires (browser revokes permission, user clears data), the push service returns a `410 Gone` response. `WebPushService` detects this via `$report->isSubscriptionExpired()` and automatically deletes the stale subscription from the database.

---

## 3. Scheduler & Queue Worker

### Why Both Are Needed

- **Scheduler** — Runs `bookmarks:process-reminders` every minute to check for due reminders and dispatch notifications.
- **Queue worker** — Processes queued jobs (emails sent via `ReminderNotification` which implements `ShouldQueue`). Without the worker, queued email notifications sit in the `jobs` table forever.

### Scheduled Commands

Defined in `routes/console.php`:

```php
Schedule::command('bookmarks:process-reminders')->everyMinute();
Schedule::command('subscriptions:handle-expired')->daily();
```

**`bookmarks:process-reminders`** (`app/Console/Commands/ProcessBookmarkReminders.php`):
- Queries bookmarks where `reminder_date <= now()` and `reminder_sent = false`
- For each due reminder:
  1. Determines item type (opportunity, tool, or event)
  2. Creates an in-app `Notification` record
  3. Sends web push via `WebPushService::sendToUser()`
  4. Marks the bookmark's `reminder_sent = true`
- Handles errors per-bookmark so one failure doesn't block others

**`subscriptions:handle-expired`** (`app/Console/Commands/HandleExpiredSubscriptions.php`):
- Marks `active` subscriptions past `ends_at` as `expired`
- Marks `cancelled` subscriptions past `ends_at` as `expired`
- Deletes `pending` subscriptions older than 24 hours (abandoned payments)

### Notification Channels

`ReminderNotification` sends via two channels:
- **`mail`** — Sends an email with reminder details and a link to the opportunity
- **`CustomDatabaseChannel`** — Stores the notification in the `notifications` table for in-app display

Web push is **not** a Laravel notification channel — it's sent directly by the `ProcessBookmarkReminders` command via `WebPushService`. This is because push needs to work independently of Laravel's notification system (the scheduler sends it, not the queue).

### How It Runs in Production (Docker / DigitalOcean)

The `docker/entrypoint.sh` starts three processes:

1. **Apache** — The main web server (foreground process via `exec`)
2. **Queue worker** — Background process that continuously processes jobs:
   ```bash
   php artisan queue:work database --sleep=3 --tries=3 --max-time=3600
   ```
   Wrapped in a `while true` loop so it auto-restarts after `--max-time` (1 hour).

3. **Scheduler loop** — Background process that runs `schedule:run` every 60 seconds:
   ```bash
   while true; do
       php artisan schedule:run
       sleep 60
   done
   ```

This approach is used because DigitalOcean App Platform doesn't support native cron jobs inside containers.

### Queue Configuration

- **Driver:** `database` (set via `QUEUE_CONNECTION=database` in `.env`)
- **Tables:** `jobs`, `job_batches`, `failed_jobs` (from migration `0001_01_01_000002_create_jobs_table.php`)
- **Retries:** 3 attempts per job
- **Sleep:** 3 seconds between polling when no jobs are available

---

## 4. Environment Variables

### Flutterwave (Payment)

```env
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxx
FLUTTERWAVE_ENCRYPTION_KEY=xxxxx
FLUTTERWAVE_WEBHOOK_HASH=xxxxx
```

Get these from your [Flutterwave Dashboard](https://dashboard.flutterwave.com/) under Settings > API Keys.

The webhook hash is set under Settings > Webhooks. Set your webhook URL to:
```
https://yourdomain.com/webhook/flutterwave
```

### VAPID (Push Notifications)

```env
VAPID_PUBLIC_KEY=BHAJXuL1kMi...
VAPID_PRIVATE_KEY=_eu5kPzkaD3...
```

Generate with:
```bash
npx web-push generate-vapid-keys
```

### Queue

```env
QUEUE_CONNECTION=database
```

### DigitalOcean App Platform

All secret env vars are defined in `.do/app.yaml` and should be set in the DigitalOcean dashboard under your app's Settings > Environment Variables.

---

## 5. Deployment

### What Happens on Deploy

1. `docker/entrypoint.sh` runs automatically when the container starts
2. Migrations run (`php artisan migrate --force`) — creates tables, seeds plans
3. Caches are rebuilt (config, routes, views)
4. Queue worker starts in background
5. Scheduler loop starts in background
6. Apache starts as the main process

### First Deploy Checklist

- [ ] Set all Flutterwave env vars in DigitalOcean dashboard
- [ ] Set VAPID keys in DigitalOcean dashboard
- [ ] Ensure `QUEUE_CONNECTION=database` is set
- [ ] Ensure `APP_URL` is set to your production domain (used for VAPID subject)
- [ ] Configure Flutterwave webhook URL to `https://yourdomain.com/webhook/flutterwave`

### Manual Deploy (non-Docker)

Run `deploy.sh` after `git pull`:
```bash
bash deploy.sh
```

Then ensure these are running:
```bash
php artisan queue:work database --sleep=3 --tries=3 --daemon &
```

And add this cron entry:
```
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

---

## 6. Troubleshooting

### Push notifications not arriving

1. **Check VAPID keys** — Ensure both `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` are set in `.env`
2. **Check browser permission** — User must have clicked "Allow" on the notification prompt
3. **Check push subscription exists** — Query `push_subscriptions` table for the user
4. **Check scheduler is running** — Look at `storage/logs/scheduler.log` for recent entries
5. **Test manually** — Run `php artisan bookmarks:process-reminders` to process due reminders immediately

### Reminders not firing

1. **Check scheduler** — `storage/logs/scheduler.log` should have entries every minute
2. **Check bookmark data** — The bookmark must have `reminder_date` set and `reminder_sent = false`
3. **Check reminder_date** — Must be in the past (or now) for the scope to pick it up
4. **Run manually** — `php artisan bookmarks:process-reminders` and check output

### Emails not sending

1. **Check queue worker** — Look at `storage/logs/queue.log` for activity
2. **Check jobs table** — `SELECT * FROM jobs` to see pending jobs
3. **Check failed_jobs** — `SELECT * FROM failed_jobs` for errors
4. **Check mail config** — Ensure `MAIL_MAILER`, `MAIL_HOST`, etc. are set correctly

### Payments not working

1. **Check Flutterwave keys** — All 4 env vars must be set
2. **Check logs** — `storage/logs/laravel.log` for Flutterwave API errors
3. **Test mode** — Use Flutterwave test keys for development (test cards available in their docs)
4. **Webhook** — Check Flutterwave dashboard > Webhooks for delivery logs

### Subscriptions not expiring

1. **Check scheduler** — `subscriptions:handle-expired` runs daily
2. **Run manually** — `php artisan subscriptions:handle-expired`
