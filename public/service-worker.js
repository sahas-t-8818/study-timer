const CACHE_NAME = 'study-timer-v1';
const APP_SHELL = [
  '/study-timer/',
  '/study-timer/index.html',
  '/study-timer/vite.svg',
  '/study-timer/src/assets/react.svg',
  '/study-timer/src/data/quotes.js',
  '/study-timer/src/index.css',
  '/study-timer/src/App.module.css',
  '/study-timer/src/App.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only handle GET requests
  if (request.method !== 'GET') return;

  // App shell: cache-first
  if (APP_SHELL.some((url) => request.url.includes(url))) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // Navigation: network-first, fallback to cache, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) =>
            cached || caches.match('/study-timer/offline.html')
          )
        )
    );
    return;
  }

  // Fallback: try cache, then network
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
}); 