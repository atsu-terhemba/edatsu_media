# Frontend Subscription Implementation

How the subscription flow works in this app, so it can be replicated elsewhere.

## Overview

Subscriptions are managed through two pages:

- **`/upgrade-plan`** — the main upgrade flow. Fetches the user's current subscription, shows plan selection, activates the subscription.
- **`/billing`** — wallet top-up page (Flutterwave card payments + virtual bank accounts). Used both standalone and as a "fund your account" path before upgrading.

Payment processing is handled by **Flutterwave** (inline checkout for cards, virtual accounts for bank transfers). Stablecoins (USDT/USDC) are listed as "Coming Soon".

The API base is configured via `NEXT_PUBLIC_API_URL` and calls go through `lib/api.ts` (Axios instance, httpOnly cookies + in-memory access token).

---

## 1. Subscription state model

The app models a user's subscription with this shape:

```ts
interface SubscriptionInfo {
  status: string;           // e.g. 'FREE', 'ACTIVE'
  tierSlug: string | null;  // 'pro' | 'business' | null
  tierName: string | null;  // Display name, e.g. 'Pro'
  daysLeft: number | null;  // Remaining days until endDate
  endDate: string | null;   // ISO date
}
```

A user is "Pro" if `tierSlug === 'pro' || tierSlug === 'business'`.

---

## 2. Fetching current subscription

Two endpoints are called in parallel on mount:

```ts
const [userRes, subRes] = await Promise.all([
  api.get('/api/v1/users/me'),
  api.get('/api/v1/users/subscription').catch(() => null),
]);
```

### `/api/v1/users/me`
Returns the authenticated user. The subscription tier comes from
`data.data.subscription.tier.slug` and `data.data.subscription.tier.name`.
`data.data.subscription.status` is the activation status.

### `/api/v1/users/subscription`
Returns active subscription details. The response is **double-nested**:
```
{ success, data: { success, data: { activeSubscription, daysLeft, endDate } } }
```
So to read it:
```ts
const outerData = subRes.data.data;
const subData = outerData?.data || outerData;
const activeSub = subData?.activeSubscription;
const endDate = activeSub?.endDate || subData?.endDate;
```

`daysLeft` falls back in this order: `subData.daysLeft` → `activeSub.daysLeft` → computed from `endDate` vs. now.

If the call fails (`.catch(() => null)`), the UI falls back to a FREE state — a missing subscription endpoint should not block the page.

---

## 3. Activating a subscription

Triggered by the "Activate Subscription" button on `/upgrade-plan`:

```ts
const response = await api.post('/api/v1/users/subscription/activate', {
  countryCode: 'NG',
  amount: currentAmount,            // string, e.g. '5000'
  currency: 'NGN',
  billingPeriod: selectedPlan.toUpperCase(), // 'MONTHLY' | 'YEARLY'
});

const data = response.data?.data || response.data;

if (data?.paymentUrl) {
  window.location.href = data.paymentUrl;   // Hosted payment page
} else {
  // Activated directly (e.g. paid from wallet balance) — no redirect
  // Show success modal, route to /profile
}
```

Key behavior:

- **`paymentUrl` present** → redirect to the provider-hosted checkout. After payment, the backend handles the webhook and the user returns to the app already upgraded.
- **No `paymentUrl`** → the backend activated the subscription directly (typically the wallet had enough balance). Show a success modal.

### Default prices

```ts
const DEFAULT_MONTHLY_PRICE  = '₦5,000';   // display string
const DEFAULT_YEARLY_PRICE   = '₦54,000';
const DEFAULT_MONTHLY_AMOUNT = '5000';     // numeric string for API
const DEFAULT_YEARLY_AMOUNT  = '54000';
```

Regional pricing is currently disabled — everything is hardcoded to NGN. There is a `useRegionalPricing` hook (`lib/useRegionalPricing.ts`) commented out for later re-enablement.

### Error handling

The activate endpoint returns errors shaped as:
```
{ error: { message, details: { validationErrors: string[] } } }
```
The frontend unwraps in this order:
1. `errorData.error.details.validationErrors` (joined with `, `)
2. `errorData.error.message`
3. `errorData.message`
4. Generic fallback

All errors are surfaced via SweetAlert2 modals with the same styling config (see `upgrade-plan/page.tsx`).

---

## 4. Pro user view

When `isProUser === true`, `/upgrade-plan` renders a different page — it shows the active tier, a "X days remaining" badge (color-coded: red ≤ 7d, amber ≤ 30d, gray otherwise), the expiry date, feature list, and links to `/profile` and `/billing`.

---

## 5. Wallet top-up (`/billing`)

The billing page is the payment-funding path. It offers three methods:

### a) Bank Transfer — virtual accounts

1. `GET /api/v1/payments/virtual-account` — check if one already exists.
2. If none: user clicks "Generate Virtual Account". Required profile fields: **firstName, lastName, BVN**. If BVN is missing, an inline form collects it (BVN is 11 digits; NIN is optional, also 11 digits).
3. `PATCH /api/v1/users/me` saves BVN/NIN to the profile.
4. `POST /api/v1/payments/virtual-account` creates the account.
5. Response gives `{ accountNumber, accountName, bankName, flwRef, orderRef, note }` — displayed with copy-to-clipboard buttons.

Transfers to the account auto-credit the wallet (handled server-side via Flutterwave webhook).

### b) Debit Card — Flutterwave inline

The Flutterwave v3 script is loaded via `next/script` with `strategy="lazyOnload"`:

```tsx
<Script
  src="https://checkout.flutterwave.com/v3.js"
  onLoad={() => setFlutterwaveLoaded(true)}
  strategy="lazyOnload"
/>
```

It attaches `window.FlutterwaveCheckout`. Type declaration:

```ts
declare global {
  interface Window {
    FlutterwaveCheckout: (config: any) => void;
  }
}
```

Invocation:

```ts
const txRef = `DS-${userProfile.id}-${Date.now()}`;
window.FlutterwaveCheckout({
  public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
  tx_ref: txRef,
  amount,
  currency: 'NGN',
  payment_options: 'card',
  customer: { email, phone_number, name },
  customizations: { title, description, logo },
  meta: { user_id, source: 'wallet_topup' },
  callback: async (response) => {
    // Log as PROCESSING — webhook confirms final status
    await api.post('/api/v1/payments/transactions', {
      userId, transactionId: response.transaction_id,
      txRef: response.tx_ref, flwRef: response.flw_ref,
      amount, currency, status: 'PROCESSING',
      chargedAmount: response.charged_amount,
      appFee: response.app_fee,
      merchantFee: response.merchant_fee,
      paymentType: response.payment_type,
      createdAt: response.created_at,
      customer: { email, name, phoneNumber },
    });
  },
  onclose: () => { /* reset processing state */ },
});
```

Important: the frontend **never marks the payment as SUCCESS** — it logs `PROCESSING` and lets the Flutterwave webhook update status server-side. The UI tells the user "your wallet will be updated once confirmed."

### c) Cryptocurrency — disabled

UI is rendered with `opacity-60` and a "Coming Soon" badge. No backend calls.

---

## 6. Required environment variables

```
NEXT_PUBLIC_API_URL=<backend base URL>
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=<flw public key>
```

Both are public (exposed to the browser). The Flutterwave secret key lives only on the backend.

---

## 7. API endpoints summary

| Method | Path | Purpose |
|--------|------|---------|
| GET  | `/api/v1/users/me` | Current user + subscription tier |
| GET  | `/api/v1/users/subscription` | Active subscription details (daysLeft, endDate) |
| POST | `/api/v1/users/subscription/activate` | Start a subscription (returns `paymentUrl` or activates directly) |
| GET  | `/api/v1/wallet/balance` | Wallet balance |
| GET  | `/api/v1/payments/virtual-account` | Check for existing virtual account |
| POST | `/api/v1/payments/virtual-account` | Create virtual account (requires BVN on profile) |
| POST | `/api/v1/payments/transactions` | Log a card payment as PROCESSING |
| PATCH | `/api/v1/users/me` | Update profile (used to save BVN/NIN) |

---

## 8. Replicating this elsewhere — checklist

1. Add the Axios client with `withCredentials: true` and an Authorization interceptor.
2. Build a subscription fetch that handles the double-nested response and falls back to FREE on error.
3. Expose plan selection (monthly/yearly) with both a display price and a numeric `amount` string.
4. POST to the activate endpoint; branch on `paymentUrl` — redirect if present, show success if absent.
5. For wallet funding, load the Flutterwave script via `next/script` and call `window.FlutterwaveCheckout` with a unique `tx_ref`.
6. Always log the callback as `PROCESSING` — never `SUCCESS` — and rely on the backend webhook for final state.
7. For bank transfers, gate virtual-account creation behind a profile completeness check (firstName, lastName, BVN).
8. Unwrap error responses in the order: `error.details.validationErrors` → `error.message` → `message`.
