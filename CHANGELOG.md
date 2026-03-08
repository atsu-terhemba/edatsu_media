# Changelog

## 2026-03-08 — Fix 500 errors on /search-opportunities, /toolshed, /op/{id}/{slug}

**Commit:** Fix 500 errors on search, toolshed, and opportunity detail pages
**Parent commit:** 73c1e86

### Problem
Three routes returning HTTP 500:
- `GET /search-opportunities` — 500 (33 bytes, JSON error)
- `GET /toolshed` — 500 (2485 bytes, HTML error page)
- `GET /op/{id}/{slug}` — 500 (2485 bytes, HTML error page)

### Changes

#### 1. New migration: `2026_03_08_094343_add_fulltext_index_to_opportunities_table.php`
- Adds FULLTEXT index on `opportunities.title, description` (required by `MATCH AGAINST` in search)
- Adds `direct_link` column to `opportunities` table if missing (model references it but migration had `apply_link`)
- **To revert:** `php artisan migrate:rollback --step=1`

#### 2. `app/Http/Controllers/App.php` — searchOpportunities
- Wrapped full-text `MATCH AGAINST` search in try-catch; falls back to LIKE search if FULLTEXT index is absent
- Removed SOUNDEX fallback strategy (was unreachable due to clone/paginate issues)
- Wrapped entire `searchOpportunities()` in try-catch, returns empty paginated JSON on failure instead of 500
- **To revert:** `git checkout 73c1e86 -- app/Http/Controllers/App.php`

#### 3. `app/Http/Controllers/OpportunityController.php` — readOpportunity
- Added `use Schema` import
- Main query: dynamically checks if `direct_link` column exists before selecting/grouping by it
- Main query wrapped in try-catch with fallback to simple `SELECT * WHERE id = ?` query
- Changed `function prepareIdList()` (named function inside method) to closure `$prepareIdList` to prevent re-declaration errors on repeated calls
- Similar posts + comments queries wrapped in try-catch, defaults to empty collection / 0
- Added null-safe access (`?? ''`) for taxonomy ID fields
- **To revert:** `git checkout 73c1e86 -- app/Http/Controllers/OpportunityController.php`

#### 4. `app/Http/Controllers/ToolShedController.php` — initToolShedPage
- Wrapped all `Model::all()` queries in try-catch
- Falls back to empty collections so the page renders with no filter data instead of 500
- **To revert:** `git checkout 73c1e86 -- app/Http/Controllers/ToolShedController.php`

#### 5. `resources/js/Pages/Opp-view.jsx`
- Moved `window.location` access from component body into `useEffect` (prevents crashes in SSR environments)
- `baseUrl` is now a state variable initialized inside `useEffect`
- **To revert:** `git checkout 73c1e86 -- resources/js/Pages/Opp-view.jsx`

### How to revert everything
```bash
git revert <this-commit-hash>
```
Or cherry-pick individual files:
```bash
git checkout 73c1e86 -- app/Http/Controllers/App.php app/Http/Controllers/OpportunityController.php app/Http/Controllers/ToolShedController.php resources/js/Pages/Opp-view.jsx
php artisan migrate:rollback --step=1
git add -A && git commit -m "Revert 500 error fixes"
```

### Debugging
All catch blocks now log to `storage/logs/laravel.log` with descriptive prefixes:
- `searchOpportunities failed:`
- `readOpportunity query failed:`
- `readOpportunity similar/comments query failed:`
- `ToolShed data load failed:`
- `Full-text search failed, falling back to LIKE:`
