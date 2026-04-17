# Subscription & Payment Backend — Implementation Guide

This doc describes how subscriptions work in `direct_service_api` (NestJS + Prisma + Flutterwave) so the same flow can be reproduced elsewhere.

---

## 1. High-level flow

```
Fund wallet (Flutterwave card / virtual account)
        │
        ▼
Wallet balance credited (via webhook or logTransaction)
        │
        ▼
User calls POST /users/subscription/activate
        │
        ▼
Backend: verify regional price → debit wallet → create Subscription row → log Transaction
        │
        ▼
Active subscription used to unlock features
        │
        ▼
Daily cron expires subscriptions past endDate
```

Subscriptions are **paid from the user's wallet balance**, not directly from a card. The wallet is funded via Flutterwave (card charge or permanent virtual account). A single "Subscription" row in the DB is the source of truth — there is no `user.subscriptionStatus` column.

---

## 2. Data model (Prisma)

Defined in `prisma/schema.prisma`.

### SubscriptionTier
Defines available plans (Free, Pro, …).

```prisma
model SubscriptionTier {
  id            String   @id @default(cuid())
  name          String   @unique
  slug          String   @unique              // "free", "pro"
  description   String?
  price         Float                          // monthly price
  currency      String   @default("NGN")
  billingPeriod BillingPeriod @default(MONTHLY)

  // Feature flags / limits
  maxBusinesses          Int     @default(1)
  maxImagesPerBusiness   Int     @default(5)
  prioritySupport        Boolean @default(false)
  featuredListing        Boolean @default(false)
  analyticsAccess        Boolean @default(false)
  verifiedBadge          Boolean @default(false)
  customization          Boolean @default(false)
  removeBranding         Boolean @default(false)
  earlyAccess            Boolean @default(false)
  thirdPartyIntegrations Boolean @default(false)

  isActive      Boolean  @default(true)
  subscriptions Subscription[]
}
```

### Subscription (per-user active record)

```prisma
model Subscription {
  id              String   @id @default(cuid())
  userId          String
  tierId          String

  status          SubscriptionStatus @default(ACTIVE)
  startDate       DateTime @default(now())
  endDate         DateTime                   // when it expires
  cancelledAt     DateTime?

  paymentProvider String?                    // "wallet" | "flutterwave" | ...
  paymentId       String?                    // external/internal reference

  isTrialPeriod   Boolean  @default(false)
  trialEndDate    DateTime?
  autoRenew       Boolean  @default(true)

  user User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  tier SubscriptionTier  @relation(fields: [tierId], references: [id])
}

enum SubscriptionStatus { FREE  ACTIVE  PAST_DUE  CANCELLED  EXPIRED }
enum BillingPeriod      { MONTHLY  QUARTERLY  YEARLY }
```

### RegionalPricing
Country-based monthly price lookup (the price the user must pay in their local currency).

```prisma
model RegionalPricing {
  id          String  @id @default(cuid())
  countryCode String  @unique                // "NG", "US", "GH"
  countryName String
  currency    String                         // "NGN", "USD", "GHS"
  price       Decimal @db.Decimal(10,2)      // monthly
}
```

### UserWallet + Transaction + BillingLog
The wallet is the money bucket that funds subscriptions *and* ad spend. See `schema.prisma` lines ~780–900 for `UserWallet`, `Transaction`, `BillingLog`, `VirtualAccountStatus`, `BillingType`, `BillingStatus`. Key points:

- `UserWallet.balance` — Decimal, the spendable balance.
- `UserWallet.virtualAccount*` fields — cached Flutterwave permanent virtual account info.
- `Transaction` — every credit/debit (CREDIT, DEBIT, REFUND, CHARGEBACK). Idempotency is enforced by `providerRef` uniqueness.
- `BillingLog` — invoice-style record (SUBSCRIPTION, SUBSCRIPTION_RENEWAL, AD_CAMPAIGN, WALLET_TOPUP, …).

---

## 3. Funding the wallet

Two funding paths, both Flutterwave:

### 3a. Card payment (client-initiated)
1. Frontend calls Flutterwave Inline / Standard with `tx_ref = "DS-{userId}-{timestamp}"`. The `DS-` prefix and userId position are **contractual** — `handleChargeCompleted` extracts `userId` from this format.
2. On success, frontend calls `POST /payments/transactions` with `{ txRef, id (Flutterwave txn id), flwRef, amount, ... }`.
3. `PaymentsService.logTransaction`:
   - Calls `GET {FLW_BASE_URL}/transactions/{id}/verify` — **verified data is the source of truth**, never the body the client sent.
   - Validates `verifiedData.tx_ref === dto.txRef`.
   - Inside `prisma.$transaction`: checks idempotency by `providerRef = flwRef`, creates `Transaction`, increments `userWallet.balance` when status is `SUCCESS`.
   - `P2002` (unique-constraint race) is caught and treated as duplicate-ok.

### 3b. Virtual account (bank transfer)
1. `POST /payments/virtual-account` → `createFlutterwaveVirtualAccount(userId)`:
   - Requires `profile.firstName/lastName/phoneNumber` and `kyc.bvn`.
   - Rejects if another user already owns that BVN.
   - Calls `POST {FLW_BASE_URL}/virtual-account-numbers` with `is_permanent: true`.
   - Persists account number/bank/ref into `UserWallet.virtualAccount*`.
2. When a user transfers funds to that account, Flutterwave POSTs the webhook `POST /payments/webhooks/flutterwave`.
3. `handleFlutterwaveWebhook`:
   - Verifies `verif-hash` header against `FLUTTERWAVE_WEBHOOK_SECRET`.
   - Only handles `charge.completed` and `transfer.completed`.
   - `handleChargeCompleted` re-verifies via `/transactions/{id}/verify`, then asserts amount, currency, tx_ref all match before crediting.
   - Idempotency key is `providerRef = flwRef` (NOT `txRef`, because virtual-account deposits share the same txRef across deposits).
   - Wallet lookup order: userId from `DS-...` txRef → `virtualAccountRef` → customer email.

### 3c. Withdrawals
`handleTransferCompleted` handles `transfer.completed`. On `SUCCESSFUL`, debits the wallet inside a transaction; on `FAILED`, records a FAILED DEBIT transaction without moving funds.

---

## 4. Subscription lifecycle

### 4a. Check / read
`UsersService.hasActiveSubscription(userId)` and `getActiveSubscriptionWithTier(userId)` are the helpers used everywhere gating depends on subscription state:

```ts
this.prisma.subscription.findFirst({
  where: { userId, status: 'ACTIVE', endDate: { gte: new Date() } },
  include: { tier: true },
});
```

Endpoint: `GET /users/subscription` returns `{ status, tier, activeSubscription, isPro, isFree, daysLeft }`.

### 4b. Activate
Endpoint: `POST /users/subscription/activate` (JWT-guarded).

Body (`ActivateSubscriptionDto`):
```ts
{
  countryCode: string;        // "NG"
  amount: string;             // "5000"
  currency: string;           // "NGN"
  billingPeriod?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';  // default MONTHLY
  tierId?: string;            // optional — defaults to cheapest paid tier
  paymentReference?: string;
  paymentProvider?: string;   // default "wallet"
}
```

`UsersService.activateSubscription` (`src/users/users.service.ts`):
1. **Look up** `RegionalPricing` by `countryCode`.
2. **Currency check** — must match regional currency.
3. **Compute `expectedPrice`** from monthly price:
   - MONTHLY → ×1
   - QUARTERLY → ×3
   - YEARLY → ×12 × 0.9 (10% discount)
4. **Reject** if `paidAmount < expectedPrice`.
5. **Reject** if user already has an `ACTIVE` subscription with `endDate >= now`.
6. **Pick tier** — explicit `tierId`, else cheapest paid tier (`price > 0`, ordered asc).
7. **Compute `endDate`** by advancing `startDate` by 1/3/12 months.
8. **Inside `prisma.$transaction`**:
   - Load wallet, reject if balance < expectedPrice.
   - `userWallet.update` — decrement balance.
   - Create `Transaction` with `type: 'DEBIT'`, `paymentMethod: 'WALLET'`, `referenceType: 'subscription'`, `txRef = SUB-{ts}-{userIdSuffix}`.
   - Create `Subscription` row with `status: ACTIVE`, `autoRenew: true`.
9. Return `{ subscriptionId, tier, status, startDate, endDate, billingPeriod, paymentDetails }`.

### 4c. Expiry (cron)
`src/common/services/subscription-scheduler.service.ts` runs `@Cron(EVERY_DAY_AT_MIDNIGHT)`:
- Flips `ACTIVE → EXPIRED` when `endDate < now`.
- Flips trials `ACTIVE → EXPIRED` when `trialEndDate < now` (and unsets `isTrialPeriod`).

Registered via `ScheduleModule.forRoot()` in `AppModule`.

### 4d. Renewal / cancel
Not implemented yet in this repo — `autoRenew` is stored but not acted on. To add: another cron that walks `endDate` in the next 24h with `autoRenew: true`, debits the wallet for the same `billingPeriod`, and extends `endDate`. Handle insufficient balance by transitioning to `PAST_DUE`.

---

## 5. Feature gating

Gate features by loading the active tier:

```ts
const sub = await usersService.getActiveSubscriptionWithTier(userId);
if (!sub?.tier.analyticsAccess) throw new ForbiddenException();
// numeric limits:
const max = sub?.tier.maxBusinesses ?? 1;  // free default
```

Tiers are seeded with `scripts/seed-subscription-tiers.ts` (Free + Pro).

---

## 6. Required environment variables

```
FLUTTERWAVE_BASE_URL=https://api.flutterwave.com/v3
FLUTTERWAVE_SECRET_KEY=FLWSECK-...
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-...
FLUTTERWAVE_ENCRYPTION_KEY=...
FLUTTERWAVE_WEBHOOK_SECRET=...        # must match the "secret hash" in Flutterwave dashboard
```

Missing `BASE_URL` or `SECRET_KEY` throws on any payment call (`getFlutterwaveEnvSettings`).

---

## 7. Endpoints at a glance

| Method | Path | Purpose |
|---|---|---|
| POST | `/payments/virtual-account` | Create permanent VA for user |
| GET  | `/payments/virtual-account` | Fetch current VA details |
| GET  | `/payments/transactions` | Paginated wallet transactions |
| POST | `/payments/transactions` | Log a card-payment result (verified server-side) |
| POST | `/payments/webhooks/flutterwave` | Flutterwave webhook receiver |
| GET  | `/payments/regional-pricing` | All country prices |
| GET  | `/payments/regional-pricing/:countryCode` | One country price |
| GET  | `/users/subscription` | Current subscription + tier + days left |
| POST | `/users/subscription/activate` | Buy subscription from wallet balance |

---

## 8. Invariants to preserve when porting

1. **Always re-verify with the provider** before crediting/debiting — never trust the client body or raw webhook payload. Compare amount, currency, tx_ref.
2. **Use `providerRef` (flwRef) for idempotency**, not `txRef` — virtual accounts reuse tx_ref across deposits.
3. **Wrap wallet mutations in `prisma.$transaction`** and catch `P2002` as a duplicate-ok path.
4. **`tx_ref` format is `DS-{userId}-{timestamp}`** for card flows; the `userId` is parsed back out. Keep the format stable or change both producers and consumers together.
5. **Subscription table is the single source of truth** — do not denormalize status onto the user. `hasActiveSubscription` = row with `status=ACTIVE` AND `endDate >= now`.
6. **Currency & amount must match regional pricing** at activation time, including the monthly/quarterly/yearly multipliers (`×1`, `×3`, `×12 × 0.9`).
7. **Daily cron is required** for expiry — without it, `status` drifts from reality.
