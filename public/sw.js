var CACHE_NAME = 'edatsu-v1';
var OFFLINE_URL = '/offline.html';

// Assets to precache for offline support
var PRECACHE_URLS = [
    OFFLINE_URL,
    '/img/logo/default_logo.jpg',
    '/img/icons/android-icon-192x192.png',
];

// Install: precache critical assets
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE_URLS);
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

// Activate: clean old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function (name) { return name !== CACHE_NAME; })
                    .map(function (name) { return caches.delete(name); })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

// Fetch: network-first with offline fallback
self.addEventListener('fetch', function (event) {
    var request = event.request;

    // Skip non-GET requests and browser extensions
    if (request.method !== 'GET') return;
    if (!request.url.startsWith(self.location.origin)) return;

    // Skip API calls and auth routes
    if (request.url.includes('/api/') || request.url.includes('/login') || request.url.includes('/logout')) return;

    // For navigation requests: network-first, fallback to offline page
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(function () {
                return caches.match(OFFLINE_URL);
            })
        );
        return;
    }

    // For static assets (images, fonts, css, js): cache-first
    if (
        request.destination === 'image' ||
        request.destination === 'font' ||
        request.destination === 'style' ||
        request.destination === 'script'
    ) {
        event.respondWith(
            caches.match(request).then(function (cached) {
                if (cached) return cached;
                return fetch(request).then(function (response) {
                    if (response.ok) {
                        var responseClone = response.clone();
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                }).catch(function () {
                    return new Response('', { status: 408 });
                });
            })
        );
        return;
    }
});

// Push notification handler
self.addEventListener('push', function (event) {
    if (!event.data) return;

    var data = event.data.json();

    var options = {
        body: data.body || '',
        icon: data.icon || '/img/icons/android-icon-192x192.png',
        badge: data.badge || '/img/icons/favicon-96x96.png',
        tag: data.tag || 'edatsu-notification',
        data: { url: data.url || '/' },
        vibrate: [200, 100, 200],
        requireInteraction: true,
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Edatsu Media', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    var url = event.notification.data && event.notification.data.url
        ? event.notification.data.url
        : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});
