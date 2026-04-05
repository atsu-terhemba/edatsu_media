# MySQL Migration — Forum Feature

Run this SQL in MySQL Workbench (or any MySQL client) to set up the forum tables.

## Notes
- Uses `ENGINE=InnoDB` (MyISAM is disabled on target env)
- No foreign-key constraints (cascades are handled in application code, keeps it portable)
- `reportable_type` is `varchar(20)` (values are only `'thread'` or `'post'`) to stay well under key-length limits

## SQL

```sql
-- Clean up any partial tables from a failed previous attempt
DROP TABLE IF EXISTS `forum_thread_mutes`;
DROP TABLE IF EXISTS `forum_reports`;
DROP TABLE IF EXISTS `forum_thread_category`;
DROP TABLE IF EXISTS `forum_posts`;
DROP TABLE IF EXISTS `forum_threads`;

-- 1. forum_threads
CREATE TABLE `forum_threads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NULL,
  `article_link` varchar(500) NULL,
  `article_link_hash` varchar(64) NULL,
  `article_title` varchar(255) NULL,
  `article_source` varchar(255) NULL,
  `posts_count` int unsigned NOT NULL DEFAULT 0,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  `last_activity_at` timestamp NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  INDEX `forum_threads_last_activity_at_index` (`last_activity_at`),
  INDEX `forum_threads_created_at_index` (`created_at`),
  INDEX `forum_threads_article_link_hash_index` (`article_link_hash`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. forum_posts
CREATE TABLE `forum_posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `thread_id` bigint unsigned NOT NULL,
  `parent_id` bigint unsigned NULL,
  `user_id` bigint unsigned NOT NULL,
  `body` text NOT NULL,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  INDEX `forum_posts_thread_id_created_at_index` (`thread_id`, `created_at`),
  INDEX `forum_posts_parent_id_index` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. forum_thread_category (pivot)
CREATE TABLE `forum_thread_category` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `thread_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  UNIQUE KEY `forum_thread_category_thread_id_category_id_unique` (`thread_id`, `category_id`),
  INDEX `forum_thread_category_category_id_index` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. forum_reports
CREATE TABLE `forum_reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `reportable_type` varchar(20) NOT NULL,
  `reportable_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `reason` varchar(500) NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  INDEX `forum_reports_reportable_type_reportable_id_index` (`reportable_type`, `reportable_id`),
  INDEX `forum_reports_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. forum_thread_mutes
CREATE TABLE `forum_thread_mutes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` bigint unsigned NOT NULL,
  `thread_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  UNIQUE KEY `forum_thread_mutes_user_id_thread_id_unique` (`user_id`, `thread_id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. user_preferences.forum_notifications
ALTER TABLE `user_preferences`
  ADD COLUMN `forum_notifications` tinyint(1) NOT NULL DEFAULT 1 AFTER `product_notifications`;
```

## Patch: add nested replies (if forum tables already exist)

```sql
ALTER TABLE `forum_posts`
  ADD COLUMN `parent_id` bigint unsigned NULL AFTER `thread_id`,
  ADD INDEX `forum_posts_parent_id_index` (`parent_id`);
```

## Rollback

If you need to remove everything:

```sql
DROP TABLE IF EXISTS `forum_thread_mutes`;
DROP TABLE IF EXISTS `forum_reports`;
DROP TABLE IF EXISTS `forum_thread_category`;
DROP TABLE IF EXISTS `forum_posts`;
DROP TABLE IF EXISTS `forum_threads`;
ALTER TABLE `user_preferences` DROP COLUMN `forum_notifications`;
```
