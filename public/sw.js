const CACHE = 'task-tool-v2'

// ページ本体と、そこから参照されるJS/CSS・manifest・アイコンを先に保存する
async function precache() {
  const cache = await caches.open(CACHE)
  const res = await fetch('./', { cache: 'reload' })
  if (!res.ok) throw new Error('precache failed')
  const html = await res.clone().text()
  await cache.put('./', res)
  const urls = [...html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)].map((m) => m[1])
  await cache.addAll([...new Set([...urls, './icon-192.png', './icon-512.png'])])
}

self.addEventListener('install', (e) => {
  e.waitUntil(precache().then(() => self.skipWaiting()))
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
          // 404など失敗応答は採用しない（公開を閉じたあともキャッシュ版で開くため）
          if (!res.ok) return caches.match('./').then((hit) => hit || res)
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
