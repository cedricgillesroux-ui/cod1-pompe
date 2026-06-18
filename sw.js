/* Service worker — usage hors-ligne.
   IMPORTANT : incrémenter CACHE à CHAQUE modification d'index.html ou d'un asset,
   pour que la nouvelle version (notamment le moteur de calcul) soit déployée. */
const CACHE = 'cod1-pompe-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Document HTML (navigation) -> NETWORK-FIRST : on récupère la dernière version
  // dès qu'il y a du réseau, et on retombe sur le cache hors-ligne.
  // Le moteur de calcul étant dans index.html, une correction se déploie ainsi
  // sans dépendre du seul nom de cache.
  const isDoc = req.mode === 'navigate' ||
                (req.destination === 'document') ||
                req.url.endsWith('/') || req.url.endsWith('/index.html');

  if (isDoc) {
    e.respondWith(
      fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => { c.put('./index.html', copy.clone()); c.put('./', copy); }).catch(() => {});
        return resp;
      }).catch(() => caches.match('./index.html').then((h) => h || caches.match('./')))
    );
    return;
  }

  // Assets statiques (icônes, manifest) -> CACHE-FIRST
  e.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => undefined)
    )
  );
});
