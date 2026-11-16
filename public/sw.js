/* Portfolio service worker: offline shell + fast repeat visits. Bump VERSION to invalidate caches. */
const VERSION = "v1";
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const PRECACHE = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/brand/logo.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  // Pages: always try the network first so stats and content stay fresh; fall back to the cached shell offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put("/", copy));
          return res;
        })
        .catch(() => caches.match("/").then((r) => r || Response.error())),
    );
    return;
  }

  // Hashed build files, images and icons: serve from cache, refresh in the background.
  const cacheable =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/projects/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/brand/");
  if (!cacheable) return;

  event.respondWith(
    caches.open(ASSETS).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
