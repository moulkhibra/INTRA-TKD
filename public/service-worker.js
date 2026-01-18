// service-worker.js - PWA Service Worker
const CACHE_NAME = 'tkd-manager-v1';
const RUNTIME_CACHE = 'tkd-manager-runtime';
const ASSETS_CACHE = 'tkd-manager-assets';

// الملفات الأساسية المراد تخزينها مسبقاً
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.ico',
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Precaching assets');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// تنشيط Service Worker
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== ASSETS_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// معالجة الطلبات
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تخطي الطلبات غير الـ GET
  if (request.method !== 'GET') {
    return;
  }

  // تخطي طلبات Firebase و APIs الخارجية
  if (
    url.origin.includes('firebase') ||
    url.origin.includes('googleapis') ||
    url.origin.includes('twiliosms')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // تخزين الاستجابات الناجحة
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // محاولة الحصول على نسخة مخزنة مسبقاً
          return caches.match(request);
        })
    );
    return;
  }

  // استراتيجية Cache First للأصول الثابتة
  if (
    url.pathname.includes('.js') ||
    url.pathname.includes('.css') ||
    url.pathname.includes('.png') ||
    url.pathname.includes('.jpg') ||
    url.pathname.includes('.svg')
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(ASSETS_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      })
    );
    return;
  }

  // استراتيجية Network First للـ HTML والـ API
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // صفحة fallback عند عدم الاتصال
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/');
          }
        });
      })
  );
});

// معالجة الرسائل من العميل
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// معالجة الإشعارات
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/SMT.png',
    badge: '/SMT.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// معالجة النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // البحث عن نافذة مفتوحة بالفعل
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // فتح نافذة جديدة
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// تحديث الخدمة عند توفر إصدار جديد
self.addEventListener('controllerchange', () => {
  console.log('[ServiceWorker] New service worker is active');
});

// تنظيف الـ Cache القديم
setInterval(() => {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      caches.open(cacheName).then((cache) => {
        cache.keys().then((requests) => {
          requests.forEach((request) => {
            cache.match(request).then((response) => {
              // حذف الملفات المخزنة لأكثر من 30 يوم
              if (response && response.headers.get('date')) {
                const date = new Date(response.headers.get('date'));
                if (Date.now() - date.getTime() > 30 * 24 * 60 * 60 * 1000) {
                  cache.delete(request);
                }
              }
            });
          });
        });
      });
    });
  });
}, 24 * 60 * 60 * 1000); // كل 24 ساعة
