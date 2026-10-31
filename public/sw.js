const CACHE = 'task-tool-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./'])).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// ページ本体は通信優先（更新を拾う）、機内モードならキャッシュ。
// それ以外はキャッシュ優先で、なければ取りに行き、成功したらキャッシュに足す
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('./', copy))
          return res
        })
        .catch(() => caches.match('./'))
    )
    return
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit
      return fetch(e.request).then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(e.request, copy))
        }
        return res
      }).catch(() => caches.match('./'))
    })
  )
})
