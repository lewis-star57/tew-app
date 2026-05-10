const CACHE_NAME = 'tew-cache-v39';
const scopePath = new URL(self.registration.scope).pathname;
const basePath = scopePath.endsWith('/') ? scopePath.slice(0, -1) : scopePath;
const withBasePath = (path) => `${basePath}${path}`;
const APP_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/favicon.svg',
  '/assets/icon-192.svg',
  '/assets/icon-512.svg'
].map(withBasePath);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return networkResponse;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return caches.match(withBasePath('/index.html'));
        })
      )
  );
});
