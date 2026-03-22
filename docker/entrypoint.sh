#!/bin/bash

echo "==> Running deployment tasks..."

# Configure Apache to listen on the correct port (App Platform uses PORT env)
APP_PORT="${PORT:-8080}"
echo "Listen ${APP_PORT}" > /etc/apache2/ports.conf
sed -ri "s/VirtualHost \*:[0-9]+/VirtualHost *:${APP_PORT}/" /etc/apache2/sites-available/*.conf
echo "==> Apache configured on port ${APP_PORT}"

# Clear all caches
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

# Run migrations (non-fatal — DB may not be ready)
php artisan migrate --force 2>&1 || echo "WARNING: Migration failed — check DB connection"

# Rebuild caches for production
php artisan config:cache 2>/dev/null || true
php artisan route:cache 2>/dev/null || true
php artisan view:cache 2>/dev/null || true

# Ensure storage link exists
php artisan storage:link 2>/dev/null || true

# Fix permissions after cache rebuild
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

# Start the queue worker in the background (processes push notifications, emails, etc.)
# Restarts automatically if it exits (e.g. after --max-time or memory limit)
echo "==> Starting queue worker..."
(while true; do
    php artisan queue:work database --sleep=3 --tries=3 --max-time=3600 --quiet 2>&1
    echo "[$(date)] Queue worker restarted" >> /var/www/html/storage/logs/queue.log
    sleep 1
done) &

# Start the scheduler in the background (runs bookmarks:process-reminders every minute)
echo "==> Starting scheduler..."
while true; do
    php artisan schedule:run --no-interaction >> /var/www/html/storage/logs/scheduler.log 2>&1
    sleep 60
done &

echo "==> Deployment tasks complete. Starting server..."

exec "$@"
