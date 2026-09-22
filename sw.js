const CACHE = "nongtrai-web-v1";
const MATCH = /WebGL\.(data|wasm|framework\.js|loader\.js)|unityweb/;

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  const url = event.request.url;
  if (event.request.method !== "GET" || !MATCH.test(url)) return;
  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(event.request).then(function (hit) {
        if (hit) return hit;
        return fetch(event.request).then(function (res) {
          if (res && res.ok) cache.put(event.request, res.clone());
          return res;
        });
      });
    })
  );
});
