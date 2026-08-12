const CACHE = 'acc-v2';
const FILES = ['./', './index.html', './manifest.json', './icon.png'];

// تثبيت — احفظ الملفات الجديدة
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting(); // فعّل فوراً بدون انتظار
});

// تفعيل — امسح الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim(); // تحكم بكل التبويبات فوراً
});

// طلبات — الشبكة أولاً، ثم الكاش
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
