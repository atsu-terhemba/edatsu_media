#!/bin/bash
# Quick deploy script - run this on your server after git pull
set -e

echo "==> Installing PHP dependencies..."
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

echo "==> Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Rebuilding caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Ensuring storage link..."
php artisan storage:link 2>/dev/null || true

echo "==> Restarting queue worker..."
php artisan queue:restart

echo "==> Done! Deployment complete."
echo "==> REMINDER: Ensure queue worker and scheduler are running:"
echo "    php artisan queue:work database --sleep=3 --tries=3 --daemon &"
echo "    * * * * * php artisan schedule:run >> /dev/null 2>&1"
