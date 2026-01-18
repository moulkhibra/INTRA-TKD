// PWA Testing Script
// اختبار كامل الميزات
// Run this in Browser DevTools Console

// ============================================
// 1. اختبار Service Worker
// ============================================
console.log('=== PWA Testing Suite ===\n');

// 1.1 التحقق من دعم Service Worker
if ('serviceWorker' in navigator) {
  console.log('✅ متصفح يدعم Service Worker');
} else {
  console.log('❌ المتصفح لا يدعم Service Worker');
}

// 1.2 التحقق من تسجيل Service Worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log(`✅ عدد Service Workers المسجلة: ${registrations.length}`);
  
  registrations.forEach((reg, index) => {
    console.log(`\n📍 Service Worker #${index + 1}`);
    console.log(`  📄 Script: ${reg.scope}`);
    console.log(`  ✓ Active:`, reg.active ? '✅' : '❌');
    console.log(`  ✓ Installing:`, reg.installing ? '🔄' : '❌');
    console.log(`  ✓ Waiting:`, reg.waiting ? '⏳' : '❌');
  });
});

// ============================================
// 2. اختبار الاتصال الشبكي
// ============================================
console.log('\n=== Network Status ===');
console.log('الحالة الحالية:', navigator.onLine ? '✅ Online' : '❌ Offline');

// الاستماع لتغيرات الاتصال
window.addEventListener('online', () => console.log('🟢 تم الاتصال بالإنترنت'));
window.addEventListener('offline', () => console.log('🔴 تم قطع الاتصال'));

// ============================================
// 3. اختبار الإشعارات
// ============================================
console.log('\n=== Notification Status ===');
console.log('دعم الإشعارات:', 'Notification' in window ? '✅' : '❌');
console.log('حالة الإذن:', Notification?.permission || 'لم يتم تحديده');

// طلب إذن الإشعارات
async function testNotification() {
  if (!('Notification' in window)) {
    console.log('❌ الإشعارات غير مدعومة');
    return;
  }

  if (Notification.permission === 'denied') {
    console.log('❌ تم رفض الإشعارات من قبل المستخدم');
    return;
  }

  if (Notification.permission === 'granted') {
    showTestNotification();
    return;
  }

  // طلب الإذن
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    showTestNotification();
  }
}

function showTestNotification() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title: 'اختبار الإشعارات',
      options: {
        body: '✅ إشعار اختبار من TKD Manager',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification'
      }
    });
  } else {
    new Notification('اختبار الإشعارات', {
      body: '✅ إشعار اختبار من TKD Manager',
      icon: '/favicon.ico'
    });
  }
}

console.log('\n📢 لاختبار الإشعارات، اكتب: testNotification()');

// ============================================
// 4. اختبار Web App Manifest
// ============================================
console.log('\n=== Web App Manifest ===');
const manifest = document.querySelector('link[rel="manifest"]');
if (manifest) {
  console.log('✅ Manifest موجود:', manifest.href);
  
  fetch(manifest.href)
    .then(r => r.json())
    .then(data => {
      console.log('📋 معلومات التطبيق:');
      console.log('  📝 الاسم:', data.name);
      console.log('  📝 الاسم المختصر:', data.short_name);
      console.log('  🎨 الألوان:', data.theme_color, data.background_color);
      console.log('  📱 العرض:', data.display);
      console.log('  🎯 الاتجاه:', data.orientation);
      console.log('  🔗 Start URL:', data.start_url);
    });
} else {
  console.log('❌ Manifest غير موجود');
}

// ============================================
// 5. اختبار Cache API
// ============================================
console.log('\n=== Cache Status ===');
async function testCache() {
  const caches_list = await caches.keys();
  console.log(`✅ عدد الـ Caches: ${caches_list.length}`);
  
  caches_list.forEach(cacheName => {
    console.log(`\n📦 Cache: ${cacheName}`);
    caches.open(cacheName).then(cache => {
      cache.keys().then(requests => {
        console.log(`  عدد الملفات: ${requests.length}`);
        requests.slice(0, 5).forEach(req => {
          console.log(`  📄 ${req.url.split('/').pop() || 'root'}`);
        });
        if (requests.length > 5) {
          console.log(`  ... و ${requests.length - 5} ملفات أخرى`);
        }
      });
    });
  });
}

testCache();

// ============================================
// 6. اختبار IndexedDB
// ============================================
console.log('\n=== IndexedDB Status ===');
console.log('دعم IndexedDB:', 'indexedDB' in window ? '✅' : '❌');

// ============================================
// 7. اختبار Install Prompt
// ============================================
console.log('\n=== Install Prompt ===');
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ beforeinstallprompt fired - يمكن تثبيت التطبيق');
});

// ============================================
// 8. اختبار Storage
// ============================================
console.log('\n=== Storage Status ===');
if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(({usage, quota}) => {
    const percentage = (usage / quota * 100).toFixed(2);
    console.log(`💾 استخدام التخزين: ${usage} bytes`);
    console.log(`📊 السعة الكلية: ${quota} bytes`);
    console.log(`📈 النسبة: ${percentage}%`);
  });
}

// ============================================
// 9. اختبار PWA Install Status
// ============================================
console.log('\n=== PWA Install Status ===');
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✅ التطبيق مثبت ويعمل في وضع Standalone');
} else {
  console.log('ℹ️  التطبيق يعمل في المتصفح (غير مثبت)');
}

// ============================================
// 10. أدوات اختبار مفيدة
// ============================================
console.log('\n=== أدوات اختبار ===\n');

// أداة لمسح الـ Cache
window.clearAllCaches = async () => {
  const cacheNames = await caches.keys();
  const promises = cacheNames.map(name => caches.delete(name));
  await Promise.all(promises);
  console.log(`✅ تم مسح ${cacheNames.length} cache(s)`);
  location.reload();
};

// أداة لعرض الـ Cache
window.showCache = async (cacheName) => {
  if (!cacheName) {
    const names = await caches.keys();
    console.log('Caches:', names);
    return;
  }
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  requests.forEach(req => console.log(req.url));
};

// أداة لتحديث Service Worker
window.updateServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(reg => reg.update());
      console.log('✅ تم إرسال طلب تحديث Service Worker');
    });
  }
};

// أداة للعمل بدون انترنت
window.testOffline = () => {
  // افتح DevTools > Network > Offline لمحاكاة الاتصال المقطوع
  console.log('💡 لمحاكاة حالة Offline:');
  console.log('1. افتح DevTools (F12)');
  console.log('2. اذهب إلى تبويب Network');
  console.log('3. علّم خانة "Offline"');
  console.log('4. جرّب التنقل بين الصفحات');
};

console.log('📞 الأدوات المتاحة:');
console.log('  🧹 clearAllCaches() - مسح جميع الـ Caches');
console.log('  📦 showCache(name) - عرض محتويات Cache');
console.log('  🔄 updateServiceWorker() - تحديث Service Worker');
console.log('  📡 testOffline() - اختبار الوضع بدون انترنت');
console.log('  📢 testNotification() - اختبار الإشعارات');

console.log('\n=== الاختبارات جاهزة! ===\n');
