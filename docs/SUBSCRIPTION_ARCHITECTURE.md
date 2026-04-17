# Subscription Architecture — Edatsu Media

How Free/Pro subscriptions work in this Laravel + Inertia app, and how Flutterwave is wired in.

This is a **Laravel-native** design derived from `frontend_payment.md` / `backend_payment.md`. We deliberately **do not** adopt the wallet-first model from those docs — this app charges cards directly and activates the subscription on successful payment. Wallet-style top-ups can be added later if we expand to ads / boosts / other paid features.

---

## 1. Plans

Two plans, seeded in `subscription_plans`:

| Slug    | Name | Monthly (NGN) | Yearly (NGN)   | Monthly (USD) | Yearly (USD)  |
|---------|------|---------------|----------------|----------------|---------------|
| `free`  | Free | 0             | 0              | 0              | 0             |
| `pro`   | Pro  | ₦5,000        | ₦54,000 (10% off) | $5           | $54 (10% off) |

Yearly = monthly × 12 × 0.9 (10% discount). Store the final yearly price in the column — don't compute at runtime.

**A user is "Pro"** when there exists a `subscriptions` row with `status = 'active'` AND `ends_at >= now()`. This is the **single source of truth**. Do not denormalize a `subscription_status` column onto `users`.

`User::isPro()` should delegate to the subscription table, e.g.:

```php
public function isPro(): bool
{
    return $this->subscriptions()
        ->where('status', 'active')
        ->where('ends_at', '>=', now())
        ->exists();
}
```

---

## 2. Data model

Three tables. These already exist in the DB but were built outside migrations — see memory note `feedback_migrations.md`. Going forward, **any new column or table goes through a migration.**

### `subscription_plans` (already present)

Key columns: `name`, `slug`, `description`, `price_monthly_ngn`, `price_yearly_ngn`, `price_monthly_usd`, `price_yearly_usd`, `features` (json), `limitations` (json), `is_active`, `is_popular`, `sort_order`.

To support **tier-based feature gating** without hardcoding slug checks, add boolean/int columns as you need them (example pattern; add only when a feature actually needs gating):

```
max_bookmarks         int      default 25       -- free default
priority_support      boolean  default false
ad_free_browsing      boolean  default false
early_access          boolean  default false
```

Don't add flags speculatively. Add them when a feature ships.

### `subscriptions` (already present)

Key columns: `user_id`, `subscription_plan_id`, `billing_period` (`monthly`|`yearly`), `currency`, `amount`, `status` (`pending`|`active`|`cancelled`|`expired`), `starts_at`, `ends_at`, `cancelled_at`, `payment_provider`, `provider_subscription_id`, `auto_renew`.

**Indexes to ensure:**
- `(user_id, status, ends_at)` — hot path for `isPro()` and `getActiveSubscription()`.
- `(status, ends_at)` — used by the daily expiry job.

Remember the memory note: tables are MyISAM, indexed string columns must stay under the 1000-byte key limit. `status`, `billing_period` etc. are short enough. Watch this when adding new string indexes.

### `transactions` (already present)

Key columns: `user_id`, `subscription_id`, `reference` (our tx_ref), `provider_reference` (Flutterwave `flw_ref`), `payment_provider`, `payment_method`, `amount`, `currency`, `status` (`pending`|`successful`|`failed`), `type` (`subscription`|`renewal`), `description`, `provider_response` (json), `paid_at`.

**Required index additions:**
- `UNIQUE(provider_reference)` — idempotency key for webhooks. A single Flutterwave charge has one `flw_ref`; a duplicate webhook delivery must not double-activate. Allow NULL so pending rows (before Flutterwave assigns `flw_ref`) don't collide.
- `UNIQUE(reference)` — our own tx_ref must be unique.

---

## 3. tx_ref format

```
EDATSU-{RANDOM12}-{UNIX_TS}
```

Generated in `SubscriptionController::initiatePayment` via `'EDATSU-' . strtoupper(Str::random(12)) . '-' . time()`. Keep the format stable — future code may parse it.

We **don't** embed the `user_id` in tx_ref (unlike the source doc's `DS-{userId}-{ts}` pattern). That pattern only matters for virtual-account deposits where the wallet has to be resolved without a pre-existing pending transaction. We resolve the user via the `transactions` row keyed on `reference`, which is simpler.

---

## 4. Payment flow (Pro purchase)

```
Frontend                    Laravel                         Flutterwave
--------                    -------                         -----------
POST /subscription/initiate
                            validate plan + price
                            create transactions row (pending)
                            create subscriptions row (pending)
                            POST /v3/payments ─────────────▶ hosted link
                            return { payment_url }
window.location = url ────────────────────────────────────▶ user pays
                                                            ──┐
                                                              │ callback (browser)
GET /subscription/callback?status=successful&tx_ref=...&transaction_id=...
                            verifyTransaction(id) ─────────▶ /transactions/{id}/verify
                            validate amount+currency+status
                            activate subscription (in DB::transaction)
                            redirect to /billing

                            POST /webhook/flutterwave ◀───── async webhook
                            validate verif-hash header
                            verifyTransaction(id) ─────────▶ /transactions/{id}/verify   (REQUIRED)
                            upsert-by-provider_reference, activate if still pending
                            respond 200
```

Two activation paths — the **callback** (user's browser redirect) and the **webhook** (server-to-server). Both MUST:

1. **Re-verify with Flutterwave** via `/transactions/{id}/verify` before trusting anything.
2. **Match amount + currency + status** from the verified payload (not the query string / raw webhook body).
3. **Use `DB::transaction`** for the subscription+transaction write.
4. **Be idempotent** — either path may fire first. Check `transaction.status` before re-activating.

### `initiatePayment` (already implemented)
`app/Http/Controllers/SubscriptionController.php:95` — creates pending rows, builds tx_ref, calls `FlutterwaveService::initializePayment`, returns `{ success, payment_url }`. Looks correct.

### `handleCallback` (already implemented, correct)
`app/Http/Controllers/SubscriptionController.php:200` — re-verifies, validates, activates, redirects to `/billing` on success. Also handles `status=cancelled` by marking the transaction failed and deleting the pending subscription.

### `handleWebhook` (⚠️ needs fix)
`app/Http/Controllers/SubscriptionController.php:242` currently:
- validates `verif-hash` header ✅
- looks up `Transaction` by `reference` (tx_ref) ✅
- calls `validatePayment(transaction, data)` with the **raw webhook body** ❌

Problem: `validatePayment` compares amount/currency/status against the webhook body. Flutterwave's own documentation (and the source payment docs §8) require re-verifying via `/transactions/{id}/verify` before trusting any field. Fix:

```php
// inside handleWebhook, after signature check and before activate:
$flwId = $data['id'] ?? null;
if (!$flwId) return response()->json(['status' => 'error'], 400);

$verification = $this->flutterwave->verifyTransaction((string) $flwId);
if (!$verification['success']) {
    Log::warning('Webhook verify failed', ['flw_id' => $flwId]);
    return response()->json(['status' => 'error'], 200); // 200 so FLW stops retrying if unrecoverable
}

$verified = $verification['data'];
if (!$this->validatePayment($transaction, $verified)) return response()->json(['status' => 'ok'], 200);
$this->activateSubscription($transaction, $verified);
```

### `activateSubscription` — race-safe via conditional UPDATE
Callback and webhook can fire simultaneously for the same payment. A naive `$subscription->update([...])` lets both paths win, double-writing `starts_at` / `ends_at`.

**Approach used** (`app/Http/Controllers/SubscriptionController.php:345`): atomic conditional UPDATE with a `WHERE status='pending'` guard. Affected-rows == 0 means another path got there first → bail out.

```php
$affected = Subscription::where('id', $subscription->id)
    ->where('status', 'pending')
    ->update(['status' => 'active', /* ... */]);

if ($affected === 0) return; // another process already activated it
```

**Why not `lockForUpdate`?** The legacy tables in this DB are MyISAM (see memory note), which silently ignores row-level locks. MySQL's per-row UPDATE atomicity works on both MyISAM and InnoDB, so a conditional UPDATE is the portable guarantee here. Once the tables are migrated to InnoDB, wrapping in `DB::transaction` + `lockForUpdate` becomes optional defense-in-depth.

**Casts gotcha:** the query-builder `::where(...)->update(...)` bypasses Eloquent attribute casts, so `provider_response` must be `json_encode`d manually before writing.

---

## 5. Cancellation

`POST /subscription/cancel` (`SubscriptionController::cancelSubscription`).

**Current implementation has a bug.** It sets `status = 'cancelled'` immediately while the success message says "you retain access until X". With `status=cancelled`, `isPro()` returns false immediately — access is cut off at click time, not at `ends_at`.

**Fix:** keep `status = 'active'` on cancel; only set `auto_renew = false` and `cancelled_at = now()`. The daily expiry job flips `active → expired` when `ends_at` passes. This is the standard "cancel but don't refund" pattern.

```php
$subscription->update([
    'auto_renew'   => false,
    'cancelled_at' => now(),
    // status stays 'active' until ends_at passes
]);
```

`isPro()` reads from `status='active' AND ends_at >= now()`, so access continues naturally until expiry.

---

## 6. Expiry (daily cron)

Required — without it, `status` drifts away from reality.

**Already implemented:** `app/Console/Commands/HandleExpiredSubscriptions.php` with signature `subscriptions:handle-expired`, scheduled daily in `routes/console.php:12`. It:

1. Flips `active → expired` when `ends_at < now()`. **This is what handles post-cancel expiry** under the new cancel semantics (see §5).
2. Flips `cancelled → expired` when `ends_at < now()`. Legacy branch for rows cancelled under the *old* behavior (where `status` was set to `cancelled` immediately). Keep it for backwards compatibility; new cancellations never enter this branch.
3. Deletes `pending` subscriptions older than 24h (abandoned payment flows).

**Production requirement:** the host must run `php artisan schedule:run` every minute via system cron, e.g.:

```
* * * * * cd /path-to-app && php artisan schedule:run >> /dev/null 2>&1
```

If that cron isn't running in production, none of this fires. Verify on the deploy target.

**Auto-renewal** is *not* implemented yet. `auto_renew` is stored but no code acts on it. When we build it: another scheduled command walks subs with `auto_renew=true` and `ends_at` within the next 24h, re-charges the saved card (Flutterwave tokenization), and extends `ends_at`. Until then, Pro users re-subscribe manually. **The UI must not claim auto-renewal works.**

---

## 7. Feature gating

Read off the active subscription's plan at the point of use. One helper:

```php
// app/Models/User.php
public function activePlan(): ?SubscriptionPlan
{
    $sub = $this->subscriptions()
        ->where('status', 'active')
        ->where('ends_at', '>=', now())
        ->with('plan')
        ->first();

    return $sub?->plan;
}
```

Then gate a feature like:

```php
if (!Auth::user()->activePlan()?->ad_free_browsing) {
    // show ads
}

$maxBookmarks = Auth::user()->activePlan()->max_bookmarks ?? 25; // free default
```

For route-level gating, a middleware `ensure.pro` keyed on `isPro()` is enough; don't introduce per-feature middleware until a feature actually needs it.

---

## 8. Flutterwave setup

### 8a. Dashboard steps (one-time per environment)

1. **Create an account** at [dashboard.flutterwave.com](https://dashboard.flutterwave.com). Register the business, complete KYC (needed for live keys; test keys work without KYC).
2. **Grab keys** from Settings → API. You need three:
   - Public key → `FLUTTERWAVE_PUBLIC_KEY`
   - Secret key → `FLUTTERWAVE_SECRET_KEY`
   - Encryption key → `FLUTTERWAVE_ENCRYPTION_KEY` *(not currently used by our server code, but store it in case we add inline checkout later)*
3. **Configure the webhook** in Settings → Webhooks:
   - **URL:** `https://<your-domain>/webhook/flutterwave` (matches `routes/web.php:121`)
   - **Secret hash:** generate a random string (e.g. `openssl rand -hex 32`), paste into the dashboard, and set `FLUTTERWAVE_WEBHOOK_HASH` in `.env` to the **same value**. `FlutterwaveService::validateWebhook` (line 94) compares the inbound `verif-hash` header against this.
4. **Whitelist redirect URLs** if the dashboard asks. Our redirect is `https://<your-domain>/subscription/callback` (see `routes/web.php:78`).
5. Switch to **Live keys** only when go-live is approved. Keep test keys in `.env.example` / staging.

### 8b. Environment variables

Already defined in `config/services.php:50`. Ensure `.env` has:

```dotenv
FLUTTERWAVE_BASE_URL=https://api.flutterwave.com/v3
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxx
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TESTxxxxxxxx
FLUTTERWAVE_WEBHOOK_HASH=<same-value-as-dashboard-secret-hash>
```

Production uses live keys (`FLWPUBK-` / `FLWSECK-` without `_TEST`).

### 8c. Flutterwave endpoints we call

| Direction | Endpoint | Purpose |
|---|---|---|
| `POST /v3/payments` | **Laravel → FLW** | Initialize a hosted payment; returns `data.link` as `payment_url`. |
| `GET  /v3/transactions/{id}/verify` | **Laravel → FLW** | Re-verify a transaction. **Source of truth** for amount/currency/status. |
| `POST /webhook/flutterwave` | **FLW → Laravel** | Async payment notification. Signed with `verif-hash` header. |

### 8d. Test-mode sanity check

After keys + webhook are set, end-to-end test in staging:

1. Log in, go to `/upgrade-plan`, click a Pro plan → `POST /subscription/initiate`.
2. Redirect to Flutterwave's hosted page.
3. Use a **test card** ([docs.flutterwave.com test cards](https://developer.flutterwave.com/docs/test-cards)) — e.g. `5531 8866 5214 2950`, any future expiry, CVV `564`.
4. Complete payment → redirect to `/subscription/callback` → should land on `/billing` with `success` flash.
5. Confirm: `subscriptions` row has `status=active`, `ends_at` ~30 days out; `transactions` row has `status=successful`, `provider_reference` filled.
6. Trigger a webhook replay from the dashboard → expect a 200 with no change (idempotency).

---

## 9. Routes & endpoints

| Method | Path | Controller@action | Auth |
|---|---|---|---|
| GET  | `/subscription` | `Inertia::render('Subscription')` | public |
| GET  | `/upgrade-plan` | `SubscriptionController@showUpgrade` | public* |
| POST | `/subscription/initiate` | `SubscriptionController@initiatePayment` | auth |
| GET  | `/subscription/callback` | `SubscriptionController@handleCallback` | public (FLW redirect) |
| POST | `/webhook/flutterwave` | `SubscriptionController@handleWebhook` | public, **CSRF-exempt** |
| GET  | `/billing` | `SubscriptionController@billing` | auth |
| POST | `/subscription/cancel` | `SubscriptionController@cancelSubscription` | auth |

\* `showUpgrade` branches on auth to show upgrade UI vs. login prompt.

**CSRF exemption for webhook:** confirm `/webhook/flutterwave` is listed in `VerifyCsrfToken::$except` in `app/Http/Middleware/VerifyCsrfToken.php`. If not, Flutterwave's POST will 419.

---

## 10. Invariants (do not break when porting / extending)

1. **Re-verify every payment via `/transactions/{id}/verify` before activating.** Both callback and webhook. The verified payload is source of truth; query string and webhook body are not.
2. **Idempotency key = `provider_reference` (Flutterwave `flw_ref`)**, not our `reference`. Unique index on that column.
3. **All wallet/subscription state mutations go through `DB::transaction`** with a `lockForUpdate()` on the subscription row to prevent callback/webhook races.
4. **`subscriptions` table is the single source of truth.** Never denormalize onto `users`. `isPro() = row with status='active' AND ends_at >= now()`.
5. **Amount + currency must match** the plan's regional price at the exact billing period. Reject mismatches rather than accepting under-payment.
6. **Daily expiry cron is required** — without it, `status='active'` rows outlive their `ends_at`.
7. **Cancel ≠ terminate.** Cancel flips `auto_renew` off and sets `cancelled_at`; `status` stays `active` until `ends_at`. Expiry job handles the flip.
8. **Webhook endpoint is CSRF-exempt and responds 200** even for unknown / duplicate events. Never return 5xx for expected duplicates — Flutterwave will retry and pollute logs.
9. **Any new table / column goes through a migration.** The legacy ones were hand-built; do not repeat that.

---

## 11. Gaps to close (work items)

These are the deltas between what's in the repo today and the architecture above. **This list is the persistent progress tracker — update it as items land.**

- [x] `handleWebhook` must call `verifyTransaction` before `validatePayment` (see §4).
- [x] `cancelSubscription` bug: don't set `status='cancelled'` immediately (see §5).
- [x] `subscriptions:handle-expired` command exists and is scheduled daily (see §6).
- [x] `/webhook/flutterwave` is CSRF-exempt — confirmed in `bootstrap/app.php:17`.
- [x] `activateSubscription` is race-safe via conditional UPDATE (see §4).
- [x] `User::isPro()` audited — reads from `subscriptions` table, no denormalization. Note: hardcoded `slug='pro'` — widen to `whereIn` when additional paid tiers land.
- [ ] Run `php artisan migrate` for `2026_04_17_130000_add_indexes_to_subscriptions_and_transactions.php` — adds `UNIQUE(reference)`, `UNIQUE(provider_reference)` on `transactions` and `(user_id, status, ends_at)` on `subscriptions`. If it fails, duplicates already exist — see migration header for the dedup queries. File written ✅, pending actual run.
- [x] "Renews" UI copy replaced with "Expires" in `Profile/Edit.jsx`, `Subscriber/Billing.jsx`, `Subscriber/Dashboard.jsx`. Billing's cancelled-state detection switched from `status === 'cancelled'` to `cancelled_at` (matches the new backend semantics — see §5). "Cancel anytime" copy left intact — the cancel endpoint is real and the phrasing is forward-compatible with auto-renewal once it ships.
- [ ] Confirm production host runs `php artisan schedule:run` every minute (see §6). Server-side, not code.
- [ ] Dashboard: set webhook URL + secret hash, whitelist callback URL (see §8a).

---

## 12. What we intentionally did NOT adopt from the source docs

- **Wallet balance layer.** Direct card → activate is simpler and enough for a single paid product. Add a wallet only when we introduce a second paid surface (ads, tips, boosts).
- **Virtual accounts / BVN collection.** Non-trivial compliance work (KYC UX, storage, uniqueness). Not needed for card-only subscription.
- **Regional pricing table.** NGN + USD columns on `subscription_plans` are enough for now. Introduce per-country rows only when we expand beyond two currencies.
- **`BillingLog` as a separate table.** For a single-product setup, `transactions` already doubles as the invoice log.
- **Double-nested API response shape (`{ data: { data: ... } }`).** That was a bug being papered over in the source system. Don't replicate.
- **`SUB-{ts}-{userIdSuffix}` tx_ref for wallet-funded subs.** Irrelevant without a wallet.
