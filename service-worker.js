const CACHE_NAME = 'workpay-fb-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Беттің өзі (HTML) әрдайым интернеттен ЖАҢА нұсқасын алады — жаңартулар
// бірден көрінеді. Интернет болмаса ғана кэштен көрсетеді.
// Деректердің өзі endi Firestore-де (бұлтта) сақталады, бұл кэш тек
// сайттың файлдарына (HTML/CSS/JS/иконка) қатысты — жазбаларыңызға әсер етпейді.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Firebase/Google/CDN сұрауларына кэшті араластырмаймыз — тікелей желіге жібереміз
  if(url.origin !== self.location.origin){
    return;
  }

  const isNavigation = event.request.mode === 'navigate' || event.request.destination === 'document';

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
