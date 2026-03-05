#!/bin/bash
set -e

echo "==> Running deployment tasks..."

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Run migrations
php artisan migrate --force

# Rebuild caches for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ensure storage link exists
php artisan storage:link 2>/dev/null || true

# Fix permissions after cache rebuild
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "==> Deployment tasks complete. Starting server..."

exec "$@"
