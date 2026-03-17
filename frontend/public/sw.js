const CACHE = "halleyx-v1";
const ASSETS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("/api/")) return; // never cache API calls

  e.respondWith(
    caches.match(e.request).then((cached) => {

      const networkFetch = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => {
          // return cached if network fails
          if (cached) return cached;

          // fallback response to prevent error
          return new Response("Offline", {
            status: 503,
            statusText: "Offline"
          });
        });

      return cached || networkFetch;
    })
  );
});