# Migration — Toolshed Query Optimization

Run these via phpMyAdmin on production. All are plain non-unique indexes; key lengths are sized to stay under MyISAM's 1000-byte limit. Prefix lengths are applied to `_type` columns because they are TEXT on prod (MyISAM requires a prefix length on TEXT/BLOB keys — this is the fix for Error 1170).

```sql
ALTER TABLE ratings
    ADD INDEX idx_ratings_rateable (rateable_type(191), rateable_id(32));

ALTER TABLE comments
    ADD INDEX idx_comments_commentable (commentable_type(191), commentable_id(32));

ALTER TABLE bookmarks
    ADD INDEX idx_bookmarks_post (post_id(32), post_type(151), user_id(32), removed(1));

ALTER TABLE category_selections
    ADD INDEX idx_cs_post (post_id(32), post_type(151));

ALTER TABLE brand_labels_selections
    ADD INDEX idx_bls_post (post_id(32), post_type(151));

ALTER TABLE tags_selections
    ADD INDEX idx_ts_post (post_id(32), post_type(151));
```

## If an ALTER errors

- **Error 1170 (BLOB/TEXT without key length)** → the named column is TEXT/BLOB. Add a prefix length: `(191)` for type columns, `(32)` for id columns. The block above already does this for every column we know about; if 1170 still fires on a column not listed, wrap that one too.
- **Error 1089 (incorrect prefix key)** → the column is actually an integer (bigint/int) on that table, so the prefix is invalid. Re-run that one statement **without** the prefix for that column. Example: if `tags_selections.post_type` is int, drop its prefix: `ADD INDEX idx_ts_post (post_id(32), post_type)`. Same for any `_id` column that turns out to be a real bigint.
- **Error 1061 (duplicate key name)** → the index already exists. Skip it.

## What each index speeds up

- `idx_ratings_rateable` — `average_rating` and `total_ratings` subqueries on `/toolshed`, plus any polymorphic rating lookup.
- `idx_comments_commentable` — `total_comments` subquery and comment list by parent.
- `idx_bookmarks_post` — `is_bookmarked` check per product per user.
- `idx_cs_post` / `idx_bls_post` / `idx_ts_post` — `category_name` / `brand_labels` / `tags` GROUP_CONCAT subqueries, plus the category/brand/tag filter `whereExists` lookups.

## Rollback

```sql
ALTER TABLE ratings                 DROP INDEX idx_ratings_rateable;
ALTER TABLE comments                DROP INDEX idx_comments_commentable;
ALTER TABLE bookmarks               DROP INDEX idx_bookmarks_post;
ALTER TABLE category_selections     DROP INDEX idx_cs_post;
ALTER TABLE brand_labels_selections DROP INDEX idx_bls_post;
ALTER TABLE tags_selections         DROP INDEX idx_ts_post;
```
