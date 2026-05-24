# Release Notes — 2026-05-24

A coordinated drop of reader-engagement features, public sharing, AI/SEO
discovery surfaces, a weekly retention email, an admin observability page,
and two bug fixes on the existing bookmark flow.

## TL;DR

23 user-visible changes across `/feeds`, `/saved-articles`, `/admin-*`, new
public surfaces under `/u/...` and `/rss/...`, the landing page, and the
footer. All shipped behind 6 idempotent migrations and an opt-in email
preference. Pro-gating is **off by default** — flip the toggle at
`/admin-pro-gating` to enable quotas for new public reading lists.

---

## 1. Reader engagement (`/feeds`)

The feeds page is now a full-featured reader. Every change below lives in
`resources/js/Pages/Feeds.jsx` plus the supporting components called out.

### 1.1 Default to Trending tab on cold load

New visitors land on Trending instead of Your Feeds, so they see content
immediately without having to add a feed first.

- **Where:** `Feeds.jsx`, `useState('trending')`
- **Why:** Cold-account first-impression was a blank "no feeds yet" panel.

### 1.2 Drop broken region feeds

When a region feed fails to fetch or returns zero articles, the card is
filtered out instead of showing an empty loading state. If a whole region
drains to zero, the tab auto-jumps to the next region with content.

- **Where:** `Feeds.jsx` — the `fetchFeedArticles` effect filters by `feed_url`

### 1.3 Estimated read time badges

`X min read` chips on every article row (Your Feeds, Trending, Hot) and at
the top of the article reader.

- **Where:** `resources/js/utils/readTime.js` (200 WPM, strips HTML, hides
  for stubs under 20 words), rendered via `<ReadTimeBadge />`

### 1.4 Article reactions

Three reactions per article — like / insightful / fire — with optimistic
update, bulk-fetch endpoint for counts, and an auth prompt for guests.

- **Frontend:** `resources/js/Components/ReactionBar.jsx`
- **Backend:** `POST /api/news-feeds/react` (auth), `POST /api/news-feeds/reactions/bulk`
- **Schema:** `article_reactions` (unique on `user_id + article_link_hash + reaction_type`)
- **Verify:** Tap a reaction on a feed card. Refresh the page — the count
  persists and the user's own reactions are still highlighted.

### 1.5 Search across feeds

Pill-shaped search input above the tab strip; filters titles + descriptions
client-side across Your Feeds, Hot, and Trending. Persists across tab
switches. `/` focuses, `Esc` clears.

- **Where:** `Feeds.jsx` — `normalizedQuery` flows into `FeedCard` and
  the Hot tab's filter pipeline.

### 1.6 Mark-as-read controls

The orange "X new" pill on each feed card is now clickable. A
`Mark all read` pill on the tab-strip row stamps every loaded feed's
`last-seen` timestamp at once.

- **Where:** uses the existing `markFeedSeen()` localStorage helper +
  a `markAllVersion` bump that propagates to every `FeedCard`.

### 1.7 Hot tab filter & sort

New sort options (Hot / Recent / Most read / Most saved) and a multi-select
source filter dropdown. Switching time windows clears the source filter
since the source list differs per window.

- **Where:** `Feeds.jsx` Hot-tab IIFE
- **Verify:** On `/feeds → Hot`, change sort to `Most saved` — order
  reshuffles based on `engagement.saves` field returned by the existing
  `/api/news-feeds/hot` endpoint.

### 1.8 Keyboard shortcuts

| Key | Action |
|---|---|
| `j` / `k` | Next / previous article |
| `o` or `Enter` | Open focused article in reader |
| `s` | Save / unsave focused article |
| `/` | Focus search |
| `Esc` | Clear search / unfocus / close help |
| `?` | Toggle the shortcuts overlay |

- **Where:** single `keydown` listener in `Feeds.jsx`, scoped via
  `[data-article-link]` attributes on every rendered article row.
- A "Shortcuts" pill is fixed bottom-left on desktop.

### 1.9 Reading streaks

Page-header chip showing consecutive days the user opened an article.
Orange-filled flame when today is active, gray-outlined when the streak is
alive but the user hasn't read today.

- **Backend:** `GET /api/reading-streak` (auth) — derived from existing
  `article_engagements.event_type='read'` rows. No new tracking schema.
- **Live bump:** when a user opens an article and the read event posts,
  the streak refetches if `today_active` was false, so the chip ticks up
  in real time.

### 1.10 Continue reading

`localStorage`-backed scroll-progress tracker keyed by article link.
Auto-restores on next open with a sticky "Resumed at X%" banner and a
"Start over" button.

- **Where:** `resources/js/utils/resumeReading.js` (capped at 200 entries,
  only stores 5–95% positions), wired into `ArticleReaderModal`.
- **Verify:** Open a long article, scroll halfway, close. Open the same
  article again — the orange banner appears and the page jumps to ~50%.

---

## 2. Saved articles knowledge base (`/saved-articles`)

### 2.1 Collections

Group saved articles into named lists with optional colour. Filter strip
above the article list (`All / Uncategorized / <each collection>`).
Per-article folder dropdown for add/remove. Right-clicking a collection
chip opens a richer settings dialog with rename / public toggle / delete.

- **Schema:** `article_collections` + `article_collection_items` pivot.
  Cascade-delete on the saved-article side cleans up pivot rows.
- **Backend:** `ArticleCollectionController` — full CRUD + bulk add/remove items.

### 2.2 Notes per saved article

A note text field on `saved_feed_articles`, edited via a debounced
textarea (800ms after last keystroke) below the reader content. Card view
shows a 📝 chip when a note exists.

### 2.3 Highlights

Select text in the article reader → floating black `Highlight` pill
appears anchored to the selection → click saves it. Highlights list with
delete renders below the note. Card view shows 🖍 + count.

- **Schema:** `article_highlights` (text, color, saved_article_id,
  timestamps). Cascade-deletes when the parent article is removed.

---

## 3. Sharing & public profiles

### 3.1 Public reading lists

Toggle `Public` in the collection settings dialog → a share URL appears.
Anyone can view the list at `/u/{profile_slug}/{collection_slug}`.

- **Privacy guarantee:** Notes and highlights are **never** included in
  public payloads. Verified end-to-end via tinker — a saved note on a
  public-collection article does not leak.

### 3.2 Public profile page

`/u/{profile_slug}` shows the reader's name, avatar, and a grid of their
public reading lists.

- **Slugs:** Generated lazily on first publish via `User::ensureProfileSlug()`
  and `ArticleCollection::ensureSlug()`. Collision-safe with numeric
  suffixes; falls back to random hex after 50 attempts.

### 3.3 "Made with Edatsu" attribution

Public collection pages end with an orange-tinted panel pitching
new visitors with a `Start free` CTA. Every shared list is an acquisition
surface.

---

## 4. Admin observability (`/admin-engagement`)

New page on the admin sidenav, between Dashboard and Users.

- **5 stat cards** — Reads, Clicks, Saves, Total Events, Active Users —
  each with a `% change` chip vs. the previous equivalent period.
- **SVG multi-line chart** over selectable windows (24h / 7d / 30d / 90d).
  24h uses hourly buckets, everything else daily.
- **Top sources + top articles** leaderboards with the same engagement
  weighting as the Hot tab (read=1, click=2, save=5).

- **Where:** `app/Http/Controllers/Admin/EngagementAnalyticsController.php`
  + `resources/js/Pages/Admin/Engagement.jsx`. Sidenav entry added in
  `resources/js/Pages/Admin/Components/SideNav.jsx`.

This is the instrumentation surface for answering "are we shipping
faster than the platform is growing?" with data instead of guessing.

---

## 5. Weekly personalized reading digest

### 5.1 The email

Sunday 08:00 Africa/Lagos. Three sections per recipient:

1. **Your week** — reads + saves + current streak
2. **From your feeds** — top 4 articles in the last 7 days from sources
   the user follows, ranked by platform-wide read=1/click=2/save=5 weight
3. **Trending on Edatsu** — up to 2 platform-Hot articles from feeds the
   user does NOT follow (time-decayed score, for cross-pollination)

### 5.2 The infrastructure

- **Mailable:** `app/Mail/WeeklyReadingDigest.php`
- **Template:** `resources/views/emails/weekly-reading-digest.blade.php`
  (extends the existing `emails.layouts.base`)
- **Command:** `php artisan newsletters:send-reading-digest [--dry-run] [--user=ID]`
- **Schedule:** Sunday 08:00 with a 10-minute dry-run at 07:50 that logs
  to `storage/logs/reading-digest-dryrun.log`
- **Preference:** New `reading_digest_optin` column on `user_preferences`
  (**default false** — explicit opt-in for the existing user base to
  protect deliverability)
- **Resend guard:** 5-day cooldown via `reading_digest_last_sent_at`
- **Unsubscribe:** signed URL at `/newsletter/reading-digest/unsubscribe/{user}`
- **Skip rule:** If both the personal and hot lists are empty, the user is
  skipped — we never queue an empty digest

### ⚠ Action required

Until users opt in, the command sends to nobody. You can:

1. Test with one user via `php artisan newsletters:send-reading-digest --user={id} --dry-run`
2. Either add a UI toggle on the preferences page (a deferred follow-up)
   or sweep-prompt existing users to enable it
3. Or flip a small batch to `reading_digest_optin = true` via DB for an
   initial cohort

---

## 6. SEO & AI discoverability

### 6.1 RSS feeds

| URL | Content |
|---|---|
| `/rss` | HTML index page listing the feeds |
| `/rss/opportunities.xml` | 50 most-recent published opportunities |
| `/rss/toolshed.xml` | 50 most-recent products |
| `/rss/forum.xml` | 50 most-recent non-hidden forum threads |

All RSS 2.0, valid against simplexml round-trip, cached 30 minutes,
include `atom:self-link`.

- **Where:** `app/Http/Controllers/PublicRssController.php`

### 6.2 Autodiscovery

`<link rel="alternate" type="application/rss+xml" ...>` tags emitted on
every page from `Components/Metadata.jsx` so readers and AI crawlers find
the feeds from any URL.

### 6.3 `llms.txt`

New `/llms.txt` route returning the emerging AI-discoverability manifest
format. Points AI systems at the primary content sections, RSS feeds, and
reference pages.

### 6.4 `robots.txt` overhaul

Explicit `Allow` for **17 AI crawlers** in addition to the existing search
engines and social-preview bots:

GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai,
PerplexityBot, Perplexity-User, Google-Extended, Bytespider, CCBot, Diffbot,
Cohere-ai, Meta-ExternalAgent, Meta-ExternalFetcher, Amazonbot, Mistral-AI.

Disallow list tightened to cover `/admin-*`, `/subscriber-*`,
`/saved-articles`, `/bookmarked-*`, `/preferences`, `/webhook/*` — surfaces
that shouldn't be indexed.

### 6.5 Sitemap expansion (`/sitemap.xml`)

Now cached 30 minutes and emitting ~1,800 URLs:

- All static pages + the new `/feeds`, `/forum`, `/rss`
- Opportunities and products (streamed via `chunkById` to handle growth)
- The most recent 2,000 non-hidden forum threads
- Every public reader profile (`/u/{slug}`)
- Every public reading list (`/u/{slug}/{collection_slug}`)

So newly-published reading lists feed straight into the next sitemap refresh.

### 6.6 Footer reorganisation

- **Discover** column: Opportunities, Toolshed, News & Feeds, Forum, Events, Advertise
- **Company** column: About, Subscription, Sponsorship, Terms, Privacy
- **Resources** column: Help Center, Contact, RSS Feeds, Sitemap, AI Manifest, Feedback
- Social row now ends with an orange RSS pill `))` linking to `/rss`

---

## 7. Landing-page marketing

New `<ReaderPlatformSection />` between FeedsSection and the bottom of
`Home.jsx`. Three Apple-styled cards marketing:

1. **Build your own news feed** — paste any URL, we find the RSS
2. **Curate public reading lists** — viral acquisition surface
3. **Reading streaks & resume reading** — daily-habit framing

Tail strip pitches RSS subscription with a link to `/rss`.

- **Where:** `resources/js/Components/ReaderPlatformSection.jsx`

---

## 8. Pro gating

### 8.1 Public reading lists quota

New `public_lists_max` setting on `pro_gating_settings` (default 1).
Free users can publish 1 public list; Pro users unlimited. Activation is
gated only when flipping `is_public=false → true` — unpublishing and
toggling other fields stay free.

- **Backend:** `ArticleCollectionController::update` calls
  `FeatureGate::withinQuota($user, 'public_lists', $count)`. Returns
  the standard 402 quota_exceeded envelope so the existing axios
  interceptor pops the Pro upgrade modal automatically.
- **Admin UI:** New `NumberField` on `/admin-pro-gating`
- **Upgrade modal copy:** "Upgrade to Pro to publish more reading lists"

### 8.2 Reminder of existing gates (unchanged)

bookmarks, saved_articles, reminders, custom_feeds, bulk_export, web_push,
compare_tools. None modified in this release.

---

## 9. Bug fixes

### 9.1 Bookmark quota inconsistency on `/opportunities`

Two related bugs combined to make the bookmark icon behave erratically:

1. **JSON body parsing** — the controller read `$request->post('id')`,
   which only reads form-encoded data. Axios sends JSON by default, so
   `$opp_id` was always null. The "row exists?" check missed real rows
   and every click fell into the fresh-insert path. Fixed by switching to
   `$request->input('id')`.

2. **Quota only gated fresh inserts** — the restore-from-removed=1 path
   bypassed the quota check entirely. Extracted the check into a closure
   called from both activation paths.

- **Frontend:** on a 402 the bookmark button now shakes briefly before
  reverting, so users connect the click to the Pro upgrade modal.

---

## 10. Database migrations

All six migrations are `IF NOT EXISTS`-guarded so re-runs are safe.

| Migration | What it does |
|---|---|
| `2026_05_24_000001_create_article_reactions_table` | new `article_reactions` |
| `2026_05_24_000002_create_article_collections_table` | new `article_collections` + `article_collection_items` pivot |
| `2026_05_24_000003_add_notes_and_highlights_to_saved_articles` | `note` column on `saved_feed_articles` + new `article_highlights` |
| `2026_05_24_000004_add_public_profiles_and_collections` | `profile_slug` on `users`; `is_public` + `slug` on `article_collections` |
| `2026_05_24_000005_add_reading_digest_preferences` | `reading_digest_optin` + `reading_digest_last_sent_at` on `user_preferences` |
| `2026_05_24_000006_add_public_lists_max_to_pro_gating` | `public_lists_max` on `pro_gating_settings` |

---

## 11. Deploy checklist

```bash
# 1. Pull the new code
git pull origin main

# 2. Install deps (none of these added new packages; safe to skip if no
#    composer.lock / package-lock.json changes show)
composer install --no-dev --optimize-autoloader
npm ci && npm run build

# 3. Run migrations
php artisan migrate

# 4. Clear caches
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Confirm the queue worker is running — the digest mailable is queued
#    (the existing weekly-opportunity-digest already requires this, so
#    you're likely set, but worth a check)
```

**No env-var changes** required.

---

## 12. Smoke-test checklist

Run these manually after deploy to verify the user-facing pieces.
None of this was tested in a real browser during the build, only at the
lint / build / DB / controller level.

### 12.1 Reader (`/feeds`)
- [ ] Page opens on the Trending tab
- [ ] React on an article → refresh → reaction persists
- [ ] Type `/` outside an input — focus jumps to search
- [ ] Press `j` and `k` — focus indicator moves between articles
- [ ] Press `?` — shortcuts overlay opens
- [ ] Open an article in the reader, scroll halfway, close, reopen —
      orange "Resumed at X%" banner appears
- [ ] Streak chip in the header shows your current streak (orange if you
      already read today)

### 12.2 Saved articles (`/saved-articles`)
- [ ] Filter strip shows All / Uncategorized / your collections
- [ ] Per-article folder button opens collection toggle dropdown
- [ ] Open an article in the reader → type in the note → reload after
      ~1 second → note persists
- [ ] Select text in the reader → orange "Highlight" pill appears →
      click saves the passage to the list below the note

### 12.3 Public profile (`/u/{slug}`)
- [ ] Right-click a collection chip on `/saved-articles` → toggle Public
      → share URL appears
- [ ] Open the share URL in an incognito window — the list renders, no
      auth required
- [ ] Confirm `view-source:` of the public page does NOT contain your
      notes or highlights

### 12.4 Admin engagement (`/admin-engagement`)
- [ ] All 5 stat cards render with values
- [ ] Switching window (24h / 7d / 30d / 90d) reloads the page with new
      data
- [ ] Top sources + top articles render

### 12.5 RSS & SEO
- [ ] `curl https://www.edatsu.com/rss/opportunities.xml` returns valid
      RSS 2.0
- [ ] `https://www.edatsu.com/llms.txt` resolves and is plain text
- [ ] `view-source` of `/` contains three
      `<link rel="alternate" type="application/rss+xml">` tags
- [ ] Footer "Discover" / "Company" / "Resources" columns render with
      the new links, RSS pill visible next to social icons

### 12.6 Reading digest (offline)
- [ ] `php artisan newsletters:send-reading-digest --dry-run --user={your-id}`
      logs `personal=N hot=N streak=N` for a test account that has
      `reading_digest_optin = true` and at least one feed they follow

### 12.7 Bookmark fix (`/opportunities`)
- [ ] As a free user with 5+ active bookmarks, click bookmark on an
      opportunity → Pro upgrade modal appears, icon shakes, reverts to gray
- [ ] As a free user under quota, click bookmark → icon stays orange
      across a hard refresh

---

## 13. Known follow-ups (deferred)

Things flagged during the session and intentionally left for later:

- **In-content highlight rendering** — the reader saves highlights and
  lists them, but doesn't yet wrap the matching text in the article body
  with a `<mark>` element. Tricky with text-node walking and edge cases.
- **`/feeds` reader notes/highlights** — the reader modal on `/saved-articles`
  has the notes/highlights panel; the modal on `/feeds` does not. Would
  need the save endpoint to return the saved row's id.
- **Reading digest opt-in UI** — preference page needs a toggle.
- **Retroactive public-list cap** — when you flip pro-gating ON, existing
  users with multiple public lists keep them. A one-shot
  `php artisan` command could unpublish all but the most-recent N per
  free user. Not built.
- **Tier 3 & 4 playlist items** — follow users, activity feed, referrals,
  AI daily brief, topic feeds, onboarding wizard, PWA + push notifications.
  All scoped, none built.

---

## 14. Files added / modified

**New controllers:**
- `app/Http/Controllers/Admin/EngagementAnalyticsController.php`
- `app/Http/Controllers/ArticleCollectionController.php`
- `app/Http/Controllers/PublicProfileController.php`
- `app/Http/Controllers/PublicRssController.php`

**New models:**
- `app/Models/ArticleCollection.php`
- `app/Models/ArticleCollectionItem.php`
- `app/Models/ArticleHighlight.php`
- `app/Models/ArticleReaction.php`

**New commands & mail:**
- `app/Console/Commands/SendWeeklyReadingDigest.php`
- `app/Mail/WeeklyReadingDigest.php`

**New views:**
- `resources/views/emails/weekly-reading-digest.blade.php`
- `resources/views/public/rss-index.blade.php`

**New React pages & components:**
- `resources/js/Pages/Admin/Engagement.jsx`
- `resources/js/Pages/PublicCollection.jsx`
- `resources/js/Pages/PublicProfile.jsx`
- `resources/js/Components/ReactionBar.jsx`
- `resources/js/Components/ReaderPlatformSection.jsx`

**New utilities:**
- `resources/js/utils/readTime.js`
- `resources/js/utils/resumeReading.js`

**Modified (substantive):**
- `app/Http/Controllers/App.php` — bookmark fix
- `app/Http/Controllers/NewsFeedController.php` — reactions, highlights, note, streak endpoints
- `app/Http/Controllers/SitemapController.php` — expanded coverage
- `app/Http/Controllers/SubscriberController.php` — savedArticles with collections + highlights
- `app/Http/Controllers/Admin/ProGatingController.php` — public_lists_max field
- `app/Models/ProGatingSetting.php`, `User.php`, `SavedFeedArticle.php`, `UserPreference.php`
- `app/Services/FeatureGate.php` — public_lists quota
- `public/robots.txt` — AI crawler allow + tightened disallow
- `resources/js/Pages/Feeds.jsx` — most of section 1
- `resources/js/Pages/Subscriber/SavedArticles.jsx` — collections, notes, highlights UI
- `resources/js/Pages/Admin/ProGating.jsx` — new field
- `resources/js/Components/ArticleReaderModal.jsx` — notes, highlights, resume reading
- `resources/js/Components/DisplayOpportunities.jsx` — bookmark shake on quota
- `resources/js/Components/Metadata.jsx` — RSS autodiscovery
- `resources/js/Layouts/Footer.jsx` — Discover / Resources columns, RSS pill
- `resources/js/Pages/Home.jsx` — ReaderPlatformSection
- `resources/js/utils/proUpgrade.js` — public_lists copy
- `routes/web.php` — new endpoints
- `routes/console.php` — digest schedule
