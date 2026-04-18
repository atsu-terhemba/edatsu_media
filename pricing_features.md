# Pricing Features — Free vs Pro

A working list of features across the app that are candidates for paywalling. Each entry notes what exists today, how it could be limited, and the rationale. Nothing here is final — this is a menu to pick from when deciding what goes behind the Pro wall.

Current plans live in `database/seeders/SubscriptionPlanSeeder.php`. Enforcement should happen in a single `FeatureGate` / policy layer so limits are checked consistently from controllers, jobs, and the frontend.

---

## Rollout scope

**Phase 1 — applying now**
1. Bookmarks & Saves
2. Bookmark Reminders
3. Feeds / Reader
4. Forum
6. Toolshed *(excluding affiliate-aware deal alerts)*
9. Notifications & Messaging

**Later**
5. Opportunities
6. Toolshed: affiliate-aware deal alerts
7. AI Assistant
8. Personalization & Preferences
10. Ads
11. Advertise / Sponsorship (B2B)
12. Developer / Power Features

---

## Legend

- **Free** — available on the free plan (optionally with a quota)
- **Pro** — paid-only
- **Quota-gated** — both tiers have access; Pro is unlimited, Free is capped
- 🟢 **Phase 1** — in scope for the current implementation
- ⏸️ **Later** — deferred

---

## 1. Bookmarks & Saves 🟢 Phase 1

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| Save opportunities | Unlimited for all users | Quota-gated (e.g. 10) | Unlimited | Already in seeder copy; enforce in `SubscriberController::bookmark`. |
| Save tools (toolshed) | Unlimited | Quota-gated (e.g. 10) | Unlimited | Same pattern. |
| Save articles from feeds | Unlimited | Quota-gated (e.g. 20) | Unlimited | `SavedFeedArticle` currently has no cap. |
| Bulk-export bookmarks (PDF / CSV) | Route exists (`export-bookmarked-opportunities`) | — | Pro | Already listed as Pro. Gate the route in middleware. |
| Bulk delete / bulk move | Route exists | Free | Free | Utility, keep free. |

## 2. Bookmark Reminders 🟢 Phase 1

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| Set deadline reminder on bookmark | Exists via `setBookmarkReminder` | Limited (e.g. 3 active reminders) | Unlimited | Reminder emails cost money to send. |
| Push notification reminders | Exists via web-push | — | Pro | Push infrastructure cost; good differentiator. |
| Google Calendar sync for reminders | Not built | — | Pro | Already advertised in pricing UI; needs `laravel/socialite` + Calendar scopes. |
| Custom reminder cadence (1d / 3d / 7d before) | Basic only | Single default offset | Multiple offsets | Small-but-nice Pro perk. |

## 3. Feeds / Reader 🟢 Phase 1

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| Browse default regional feeds | Public | Free | Free | Core value, keep open. |
| Add custom RSS feeds (`UserNewsFeed`) | Unlimited | Quota-gated (e.g. 5) | Unlimited | Each feed adds polling cost. |
| Reader mode (`/api/news-feeds/extract-article`) | Just built, uncapped | Quota-gated (e.g. 20/day) | Unlimited | Extraction is server-side + cached 1h; CPU + outbound bandwidth. |
| Full-text search across feeds | Not built | — | Pro | Requires indexing — natural Pro tier. |
| Keyword alerts from feeds ("notify me when X appears") | Not built | — | Pro | High-value power-user feature. |
| Offline / email digest of saved articles | Not built | Weekly digest | Daily + custom digest | Matches "Weekly newsletter" on Free. |

## 4. Forum 🟢 Phase 1

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| Read threads & replies | Public | Free | Free | Keep SEO / community open. |
| Create thread | Auth-only | Quota-gated (e.g. 2/day) | Unlimited | Combats spam + gives upgrade path. |
| Reply to thread | Auth-only | Quota-gated (e.g. 10/day) | Unlimited | Same rationale. |
| Mute / unmute thread | Exists | Free | Free | Utility. |
| Start thread from article (Discuss button) | Exists | Free | Free | Drives engagement — leave open. |
| Thread analytics (views, reach) | Not built | — | Pro | For creators / publishers. |
| Priority badge on posts | Not built | — | Pro | Cosmetic, cheap to build, signal of support. |

## 5. Opportunities ⏸️ Later

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| Browse all opportunities | Public | Free | Free | Core traffic driver. |
| Filter/search | Basic filters | Basic | Advanced (saved searches, multi-tag) | "Basic search filters" is already the Free line. |
| Early access to new opportunities | Not built | Delayed (e.g. 24–48h after indexing) | Immediate | Matches "Priority access" copy. |
| Personalized recommendations | Basic (by preferences) | Basic | AI-powered | Natural tie-in with AI Assistant below. |
| Deadline countdown widget on dashboard | Exists | Up to N items | Unlimited | Visual Pro flex. |

## 6. Toolshed 🟢 Phase 1 *(affiliate-aware deal alerts deferred)*

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| Browse products | Public | Free | Free | Traffic. |
| Rate / review products | Auth-only | Free | Free | Reviews are UGC — want them. |
| Compare tools side-by-side | Not built | 2 at a time | Up to 5 | Pro power feature. |
| Affiliate-aware deal alerts ⏸️ Later | Not built | — | Pro | If/when we add affiliate tracking. |

## 7. AI Assistant ⏸️ Later

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| Ask AI for tailored opportunities | Not built | Trial (e.g. 5 queries/month) | Unlimited (fair-use) | Already pitched; LLM cost makes this the #1 paywall candidate. |
| AI summaries of articles inside reader | Not built | — | Pro | Natural extension of reader mode. |
| AI draft for forum posts / applications | Not built | — | Pro | Upsell path. |

## 8. Personalization & Preferences ⏸️ Later

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| Set categories / countries / regions | Exists (`/preferences`) | Free | Free | Drives relevance of everything else. |
| Number of tracked categories | Unlimited | Quota-gated (e.g. 5) | Unlimited | Only meaningful if we enforce it in the matcher. |
| Preference-matched notifications (email) | Exists for opportunities + forum | Daily batch | Real-time | Email volume cost. |
| Custom notification schedule | Not built | — | Pro | "Send me at 8am only". |

## 9. Notifications & Messaging 🟢 Phase 1

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| In-app notifications | Exists | Free | Free | Baseline. |
| Email notifications | Exists | Digest only | Real-time | Mirrors #8. |
| Web push notifications | Infrastructure in place | — | Pro | Already pitched. |
| Forum invite emails (category match) | Just built | Free | Free | Engagement — leave open. |

## 10. Ads ⏸️ Later

| Feature | Current state | Free | Pro | Notes |
|---|---|---|---|---|
| Display ads on feeds / forum / toolshed | `AdBanner` component in use | Shown | Hidden | Already the headline Pro benefit. Check `auth()->user()?->activeSubscription?` in `AdBanner.jsx`. |
| Sponsored listings (distinct from ads) | Not built | Shown, labelled | Hidden or labelled-only | Revenue split decision. |

## 11. Advertise / Sponsorship (B2B side) ⏸️ Later

Separate surface — businesses buying placement. Not part of consumer Free/Pro, but worth noting as a tier:

- **Advertiser Basic** — self-serve ad placement, standard analytics
- **Advertiser Pro** — sponsored opportunities, featured toolshed listing, advanced analytics, dedicated support

Gate under `role:advertiser` + their own plan table if/when built.

## 12. Developer / Power Features (future) ⏸️ Later

| Feature | Free | Pro | Notes |
|---|---|---|---|
| API access (read) | — | Pro | Rate-limited, keyed. |
| Webhooks for new matches | — | Pro | "Notify my Zapier when a grant matches." |
| Data export of personal graph | — | Pro | GDPR-style full export, as Pro convenience. |

---

## Implementation notes

- **Single source of truth**: add a `FeatureGate` service keyed on feature name (`bookmarks.max`, `feeds.custom.max`, `ai.queries.month`, `ads.hidden`, `calendar.sync`, etc.) that reads from the user's active `SubscriptionPlan`. Extend `SubscriptionPlan` with a `limits` JSON column so seeder + admin UI can tune caps without redeploying.
- **Frontend mirrors**: share a `useFeature()` hook that reads the same payload so disabled buttons + upgrade prompts stay in sync with server enforcement.
- **Graceful upsell**: when a Free user hits a quota, return a structured error `{error: 'quota_exceeded', feature: 'bookmarks.max', upgrade_url: '/subscription'}` so the UI can show a contextual modal rather than a toast.
- **Grandfathering**: anyone who has already exceeded a new cap (e.g. users with 40 saved articles) should be read-only over the cap — don't delete or block existing data.
- **Trials**: consider a 7-day Pro trial flag on the `subscriptions` table so AI / calendar / push can be sampled without payment.

## Candidates to NOT paywall

Some things are tempting to gate but hurt growth more than they help:

- Reading opportunities, tools, articles — core SEO / acquisition surface.
- Creating an account — obvious.
- Saving fewer than ~5 of anything — friction > revenue for a user still evaluating.
- Basic forum participation — community network effects.
- Bookmark reminders' *first* email — the email is what proves the product works.
