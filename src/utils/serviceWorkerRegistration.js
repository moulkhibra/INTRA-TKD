// serviceWorkerRegistration.js - تسجيل Service Worker

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);

          // التحقق من التحديثات كل ساعة
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // الاستماع للتحديثات
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker === null) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Service Worker جديد متاح
                console.log('📦 New service worker available');
                
                // إشعار المستخدم بوجود تحديث
                if (window.updateServiceWorker) {
                  window.updateServiceWorker();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // الاستماع للرسائل من Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('📨 Message from Service Worker:', event.data);
      });
    });
  } else {
    console.warn('⚠️ Service Workers not supported');
  }
};

// دالة لطلب إذن الإشعارات
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('⚠️ Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// دالة لإرسال إشعار
export const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const defaultOptions = {
      icon: '/SMT.png',
      badge: '/SMT.png',
      vibrate: [200, 100, 200],
      ...options
    };

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options: defaultOptions
      });
    } else {
      new Notification(title, defaultOptions);
    }
  }
};

// دالة للتحقق من اتصال الإنترنت
export const checkNetworkStatus = () => {
  return navigator.onLine;
};

// الاستماع لتغيرات حالة الاتصال
export const onNetworkStatusChange = (callback) => {
  window.addEventListener('online', () => {
    console.log('📡 Online');
    callback(true);
  });

  window.addEventListener('offline', () => {
    console.log('📡 Offline');
    callback(false);
  });
};

// دالة للتحديث الفوري للـ Service Worker
export const updateServiceWorkerNow = () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SKIP_WAITING'
    });
  }
};

// دالة لمسح الـ Cache
export const clearAppCache = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      console.log('✅ Cache cleared');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      return false;
    }
  }
  return false;
};

// دالة للحصول على حجم الـ Cache
export const getCacheSize = async () => {
  if ('caches' in window && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        percentage: Math.round((estimate.usage / estimate.quota) * 100)
      };
    } catch (error) {
      console.error('❌ Failed to get cache size:', error);
      return null;
    }
  }
  return null;
};
