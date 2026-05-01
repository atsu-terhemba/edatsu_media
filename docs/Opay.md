# Opay Bank Transfer Setup

Edatsu offers **two bank-transfer providers** on `/upgrade-plan`:

- **Bank Transfer** — Girostack (default)
- **Bank Transfer (Opay)** — fallback for when Girostack's source bank is unreachable

The Opay path is fully scaffolded (`OpayService`, `/webhook/opay`, controller routing, UI tile) but stays inert until env credentials are populated. Once configured the controller routes `bank_provider=opay` requests to the Opay API; until then it auto-falls-back to Girostack with a logged warning.

This doc walks through everything needed to take the Opay path live.

---

## 1. Create the merchant account

1. Sign up at **https://merchant.opaycheckout.com** (the merchant dashboard, not the consumer app).
2. Complete KYC. For NG businesses you'll need:
   - CAC certificate (or BVN for sole proprietor)
   - Director ID
   - Proof of business address
   - Settlement bank account details
3. Wait for activation. Approval typically takes 1–3 business days.
4. **Request the right product.** Opay offers several payment products; we want **dynamic virtual bank accounts** (sometimes labeled "BankTransfer payment method" under Cashier API, or "Virtual Account" under Direct Pay). Confirm with onboarding which one is enabled on your account — the API surface is product-specific and the scaffold's TODO blocks need to be reconciled accordingly.

## 2. Pull credentials from the dashboard

Inside the merchant portal, look under **Settings → API / Developer**:

| Field in dashboard      | Env var                | Notes                                                          |
| ----------------------- | ---------------------- | -------------------------------------------------------------- |
| Merchant ID             | `OPAY_MERCHANT_ID`     | Numeric, 16 chars                                              |
| Public Key              | `OPAY_PUBLIC_KEY`      | Used for `Authorization: Bearer …` on outgoing requests        |
| Private Key / Secret    | `OPAY_PRIVATE_KEY`     | Used for HMAC signing of webhook bodies                        |
| Live API base URL       | `OPAY_BASE_URL`        | Production: `https://liveapi.opaycheckout.com`. Sandbox URL is shown next to the live one in the dashboard — use that during integration. |
| Display name on transfer| `OPAY_MERCHANT_NAME`   | Shown to the user as the receiving account name. Defaults to "Edatsu Media". |

## 3. Set environment variables

Add to **production** `.env` (DigitalOcean App Platform, etc.) and any local `.env` you want to test against:

```dotenv
OPAY_BASE_URL=https://liveapi.opaycheckout.com
OPAY_MERCHANT_ID=
OPAY_PUBLIC_KEY=
OPAY_PRIVATE_KEY=
OPAY_MERCHANT_NAME="Edatsu Media"
```

Then clear the config cache so the new values take effect:

```bash
php artisan config:clear
```

`OpayService::isConfigured()` checks for the three required values (`merchant_id`, `public_key`, `private_key`) — it returns false until all three are non-empty, and the controller falls back to Girostack with a `Log::warning(...)` until then.

## 4. Register the webhook URL

In the dashboard, under **Settings → Webhooks** (or "Notification URL", terminology varies):

```
https://media.edatsu.com/webhook/opay
```

The endpoint:

- Accepts **POST only** (other verbs return 405).
- Is CSRF-exempt (registered in `bootstrap/app.php`).
- Verifies signature against `OPAY_PRIVATE_KEY` using HMAC-SHA512 over the raw request body. Invalid signatures return **401**, valid ones return **200** with `{"status": "success" | "noop" | "unknown_or_handled"}`.

If Opay supports a webhook IP allow-list, no extra firewall config is needed on our side — the request still has to clear signature verification.

## 5. Reconcile the four `TODO(opay-creds)` blocks

The scaffold is built around the **Cashier API** with `payMethod=BankTransfer`. If your account exposes a different product (e.g. "Direct Pay Virtual Account"), the request shape and webhook envelope differ. Walk these four blocks in `app/Services/OpayService.php` and `app/Http/Controllers/SubscriptionController.php` against the merchant developer reference:

| # | Location                                                | What to confirm                                                          |
| - | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1 | `OpayService::createCollectionAccount()` — `$endpoint`  | Exact path for "create dynamic virtual account"                          |
| 2 | `OpayService::createCollectionAccount()` — `$payload`   | Field names, units (kobo vs NGN), `expireAt` unit (minutes vs seconds)   |
| 3 | `OpayService::createCollectionAccount()` — auth headers | `Authorization: Bearer …` + `MerchantId: …` vs request-signature scheme  |
| 4 | `SubscriptionController::handleOpayWebhook()` — header  | Webhook signature header name (`Authorization`, `Signature`, `x-opay-signature`, …) and signed payload (raw body vs canonical JSON of inner `payload`) |

The **fastest** way to validate #4 is the dashboard's "Test Webhook" tool: fire a sample, watch `storage/logs/laravel.log`. If you see `"Invalid Opay webhook signature"`, the algorithm or signed-payload assumption is wrong; the log line above it will show the body and header we received so you can recompute manually.

## 6. End-to-end test in sandbox

1. Switch `OPAY_BASE_URL` to the sandbox URL.
2. Register the webhook against the sandbox webhook setting.
3. Visit `/upgrade-plan` as an authenticated user, pick a paid plan, choose **"Bank Transfer (Opay)"**.
4. Expect a virtual NUBAN to render. Pay it from Opay's sandbox tools or by initiating a `paymentSuccess` callback in the dashboard.
5. Verify in the DB:
   ```sql
   SELECT id, status, payment_provider, provider_reference, paid_at
     FROM transactions
     WHERE user_id = <you>
     ORDER BY id DESC
     LIMIT 1;
   ```
   `payment_provider='opay'`, `status='successful'`, and `paid_at` populated. The user's subscription should also show `status='active'`.

Once green in sandbox, swap to the production URLs/keys and repeat with a real low-amount payment.

## How the integration fits together

```
                    /upgrade-plan UI
                          │
                          ▼  POST /subscription/initiate-transfer
                          │   { bank_provider: 'opay' | 'girostack' }
                          ▼
       SubscriptionController::initiateBankTransfer
            │                                   │
            │ if 'opay' && opay->isConfigured() │ else
            ▼                                   ▼
   OpayService::createCollectionAccount   GirostackService::createCollectionAccount
            │                                   │
            ▼                                   ▼
    transactions row created with      transactions row created with
    payment_provider='opay'            payment_provider='girostack'
            │                                   │
   user transfers to virtual NUBAN     user transfers to virtual NUBAN
            │                                   │
   Opay callback ───────► /webhook/opay         Girostack callback ─► /webhook/girostack
            │                                   │
   verify HMAC, match                  verify HMAC, match
   provider_reference                  provider_reference
            │                                   │
            ▼                                   ▼
    activateSubscription()             activateSubscription()
```

Both providers share the same `Subscription`/`Transaction` schema — the only thing that changes is which `payment_provider` value is recorded and which webhook handler activates the subscription.

## Removing the Opay tile

If you decide not to ship Opay, the simplest rollback is to delete the second tile from `resources/js/Pages/Upgrade.jsx`:

```jsx
{
    id: 'banktransfer_opay',
    name: 'Bank Transfer (Opay)',
    ...
},
```

The backend stays intact and silently keeps falling back to Girostack — no harm.
