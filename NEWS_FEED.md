# News Feed — Product Documentation

## Overview

The News Feed feature lets users build a **personalized RSS feed aggregator** directly on the `/news` page. Users paste any website URL, we auto-discover and fetch its RSS feed, and display the latest articles instantly. Authenticated users can save their feeds for persistent tracking across sessions.

**Core value prop:** A zero-friction way to track updates from any source — no signup required to preview, but account needed to save.

---

## User Flow

### Unauthenticated User
1. Lands on `/news`
2. Sees a clean input field with an "Add" button
3. Pastes a URL (e.g., `https://techcrunch.com`) → hits Add
4. Backend discovers the RSS feed, returns parsed articles
5. Feed card appears below the input showing source name + latest articles
6. User can add multiple URLs — each renders as a separate feed card
7. When user clicks "Save Feeds" → prompted to sign up / log in

### Authenticated User
1. Lands on `/news` → saved feeds load automatically with fresh articles
2. Can add new feeds via the same input
3. New feeds are saved to their account immediately on add
4. Can remove feeds with a delete button on each feed card

---

## Technical Design

### Frontend (React + Inertia)

**Page:** `resources/js/Pages/News.jsx`

**UI Components:**
- **FeedInput** — URL input field + "Add" button (pill style, matches design system)
- **FeedCard** — Displays a single feed: source name, favicon, list of latest articles (title, date, link)
- **FeedCardSkeleton** — Loading state while fetching RSS

**State Management:**
- `feeds[]` — Array of active feed objects `{ url, title, favicon, articles[], isLoading, error }`
- `savedFeedIds[]` — IDs of feeds saved to the user's account (loaded from backend on mount for auth users)

**Layout:**
- Left sidebar: Subscribe UI (already built)
- Right main area: FeedInput at top → FeedCards stacked below

### Backend (Laravel)

**Controller:** `NewsFeedController.php` (extend existing)

**New API Endpoints:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/news-feeds/preview` | No | Takes a URL, discovers RSS, returns parsed articles |
| `GET` | `/api/news-feeds` | Yes | Returns user's saved feeds with latest articles |
| `POST` | `/api/news-feeds` | Yes | Saves a feed URL to user's account |
| `DELETE` | `/api/news-feeds/{id}` | Yes | Removes a saved feed |

**RSS Discovery Logic** (in a service class `RssFeedService.php`):
1. Fetch the URL with Guzzle (reuse existing pattern from `FeedsController`)
2. Check if the URL itself is a valid RSS/Atom feed (try parsing as XML)
3. If not, parse the HTML and look for `<link rel="alternate" type="application/rss+xml">`
4. Fall back to common paths: `/feed`, `/rss`, `/atom.xml`, `/feed.xml`, `/rss.xml`
5. Parse discovered feed with `simplexml_load_string()`
6. Return structured data: `{ title, favicon, url, articles[{ title, link, published_at, description }] }`

**Model:** `UserNewsFeed`

**Migration:** `user_news_feeds` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigIncrements | PK |
| `user_id` | foreignId | FK → users, cascade delete |
| `feed_url` | string | The discovered RSS feed URL |
| `site_url` | string | The original URL the user entered |
| `feed_title` | string, nullable | Auto-populated from feed metadata |
| `feed_favicon` | string, nullable | Favicon URL |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Unique constraint:** `(user_id, feed_url)` — prevent duplicate feeds per user.

### Rate Limiting

- `/api/news-feeds/preview` — 15 requests per minute per IP (unauthenticated), 30 per minute (authenticated)
- Guzzle requests: 5-second timeout, disable SSL verify (matches existing pattern), follow redirects

### Caching

- RSS feed responses cached for 15 minutes per feed URL (`cache key: rss_feed_{md5(url)}`)
- Prevents hammering external sites on repeated loads

---

## Design Specs

Follows the existing Edatsu UI design system:

**Feed Input:**
- Full-width input with 16px border-radius, 1px solid #f0f0f0 border
- Placeholder: "Paste a website or RSS feed URL..."
- "Add" button: pill shape (9999px radius), black bg, white text, 13px font-medium
- Input and button sit in a flex row with 12px gap

**Feed Card:**
- White background, 16px border-radius, 1px solid #f0f0f0 border
- 24px padding
- Header: favicon (20px) + feed title (14px semibold) + delete button (icon, right-aligned)
- Articles: list with title (14px medium, #000), date (12px, #86868b), subtle separator between items
- Max 5 articles shown per card, with "View more" link to source
- Hover: subtle shadow transition

**Empty State:**
- Centered text: "Add a URL above to start building your news feed"
- Color: #86868b, 14px

**Error State:**
- Inline below input: "No RSS feed found for this URL. Try a different link."
- Color: #ff3b30, 13px

---

## Implementation Tasks

- [x] **1. Create migration** — `user_news_feeds` table with unique constraint
- [x] **2. Create model** — `UserNewsFeed` with fillable, relationship to User
- [x] **3. Create RssFeedService** — RSS discovery + parsing logic (extracted as reusable service)
- [x] **4. Add preview endpoint** — `POST /api/news-feeds/preview` (no auth, rate-limited)
- [x] **5. Add CRUD endpoints** — GET/POST/DELETE `/api/news-feeds` (auth required)
- [x] **6. Update NewsFeedController** — Pass saved feeds to News page for auth users
- [x] **7. Build FeedInput component** — URL input + Add button
- [x] **8. Build FeedCard component** — Feed display with articles list
- [x] **9. Build FeedCardSkeleton component** — Loading state
- [x] **10. Integrate News page** — Wire up components, state management, API calls
- [x] **11. Add save prompt for guests** — "Sign up to save your feeds" UX
- [x] **12. Add rate limiting** — Throttle the preview endpoint (`throttle:15,1`)
- [x] **13. Default feeds** — Load 8 default RSS feeds for all users (from FeedsController)
- [x] **14. Save article for later** — Bookmark icon per article, save/unsave endpoints, login required for guests
- [x] **15. Show more articles** — Expand/collapse within feed card instead of external link
- [x] **16. Route rename** — `/news` → `/feeds`, nav label "Feeds"
- [ ] **17. Test end-to-end** — Manual testing of full flow (guest + auth)

---

## Edge Cases

- **No RSS feed found** — Show friendly error, suggest trying a different URL
- **Invalid URL** — Frontend validation before hitting backend
- **Feed goes offline** — Gracefully skip with "Unable to load" state on the card
- **Duplicate feed** — Prevent adding same feed twice (check against existing feeds in state + DB unique constraint)
- **Very large feeds** — Limit to 10 most recent articles per feed
- **Slow external sites** — 5-second timeout, show skeleton while loading
