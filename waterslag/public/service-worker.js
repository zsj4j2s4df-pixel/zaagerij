// ══════════════════════════════════════════════════════════════════
//  SERVICEWORKER — maakt de app installeerbaar (PWA) en laat 'm ook
//  werken bij een matige verbinding. Bewust simpel gehouden.
// ══════════════════════════════════════════════════════════════════

const CACHE = "waterslag-v1";

// Bij installeren: meteen actief worden.
self.addEventListener("install", (e) => self.skipWaiting());

// Bij activeren: oude caches opruimen.
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Bij ophalen: eerst het netwerk proberen, anders uit de cache.
// Gelukte antwoorden bewaren we, zodat het de volgende keer ook offline kan.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const kopie = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, kopie));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
