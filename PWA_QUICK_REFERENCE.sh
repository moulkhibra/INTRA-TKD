#!/bin/bash

# 🎯 Quick Reference - دليل سريع لـ PWA Testing
# استخدام: source pwa-quick-ref.sh أو bash pwa-quick-ref.sh

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                   🚀 TKD Manager PWA - Quick Reference 🚀                   ║
║                                                                              ║
║                          دليل سريع للتطبيق PWA                              ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝


📋 الملفات المهمة
════════════════════════════════════════════════════════════════════════════════

🔧 ملفات PWA الإنتاج:
   • public/service-worker.js
   • src/utils/serviceWorkerRegistration.js
   • src/components/PWAInstallBanner.js
   • src/components/NetworkStatus.js

📚 ملفات التوثيق:
   • README_PWA.md                 (الملخص السريع)
   • PWA_GUIDE.md                  (دليل المستخدم)
   • PWA_TEST_GUIDE.md             (دليل الاختبار)
   • PWA_TESTING_REPORT.md         (التقرير المفصل)
   • PWA_TEST_SUMMARY.md           (الملخص الشامل)

🧪 أدوات الاختبار:
   • pwa-test.sh                   (اختبار تلقائي)
   • PWA_TEST_SCRIPT.js            (أوامر في Console)
   • public/pwa-testing-dashboard.html (لوحة البيانات)


🎯 الأوامر الأساسية
════════════════════════════════════════════════════════════════════════════════

1️⃣  تشغيل التطبيق:
    cd /home/moulkhibra/SMT/tkd-manager
    npm start

2️⃣  الاختبار التلقائي الشامل:
    bash pwa-test.sh

3️⃣  فتح لوحة البيانات:
    http://localhost:3000/pwa-testing-dashboard.html

4️⃣  فتح التطبيق الرئيسي:
    http://localhost:3000


🌐 روابط سريعة
════════════════════════════════════════════════════════════════════════════════

   • التطبيق الرئيسي:
     http://localhost:3000

   • لوحة البيانات:
     http://localhost:3000/pwa-testing-dashboard.html

   • Manifest:
     http://localhost:3000/manifest.json

   • Service Worker:
     http://localhost:3000/service-worker.js


🔍 أوامر DevTools Console
════════════════════════════════════════════════════════════════════════════════

التحقق من Service Worker:
   navigator.serviceWorker.getRegistrations()

عرض الـ Cache المتاحة:
   await caches.keys()

عرض محتويات Cache معين:
   window.showCache('tkd-manager-v1')

تحديث Service Worker:
   window.updateServiceWorker()

مسح جميع الـ Caches:
   window.clearAllCaches()

اختبار الإشعارات:
   testNotification()

حجم التخزين المستخدم:
   navigator.storage.estimate()

الاتصال الحالي:
   navigator.onLine

معلومات الـ Manifest:
   fetch('/manifest.json').then(r=>r.json()).then(d=>console.log(d))


⚙️ الإعدادات والتخصيص
════════════════════════════════════════════════════════════════════════════════

تغيير لون الموضوع:
   • حرّر: public/manifest.json
   • غيّر: "theme_color": "#3b82f6"

تغيير اسم التطبيق:
   • حرّر: public/manifest.json
   • غيّر: "name": "اسمك"

تغيير الأيقونات:
   • استبدل: public/icons/
   • أضف الملفات الجديدة بنفس الأسماء

تعديل استراتيجية التخزين:
   • حرّر: public/service-worker.js
   • غيّر استراتيجيات في PRECACHE_URLS


🧪 سيناريوهات الاختبار
════════════════════════════════════════════════════════════════════════════════

اختبار Offline (بدون انترنت):
   1. افتح DevTools (F12)
   2. اذهب إلى Network Tab
   3. انقر على قائمة Throttling
   4. اختر Offline
   5. حاول التنقل بين الصفحات

اختبار الإشعارات:
   1. افتح DevTools Console
   2. اكتب: Notification.requestPermission()
   3. وافق على الإذن
   4. اكتب: testNotification()

اختبار Service Worker:
   1. افتح DevTools
   2. اذهب إلى Application → Service Workers
   3. تحقق من: Status, Scope, Update
   4. جرّب Unregister و Reload

اختبار الأداء:
   1. افتح DevTools
   2. اذهب إلى Performance Tab
   3. ابدأ التسجيل
   4. تنقل بين الصفحات
   5. توقف وحلل النتائج


🎯 المؤشرات والعلامات
════════════════════════════════════════════════════════════════════════════════

✅ كل شيء يعمل:
   • Service Worker: "activated and running"
   • Cache: الملفات موجودة ومخزنة
   • Network: الإشعارات تظهر بشكل صحيح
   • Manifest: JSON صحيح

⚠️  تحذيرات شائعة (آمنة):
   • Failed to parse source map: تحذير فقط
   • onAfterSetupMiddleware deprecated: تحذير npm
   • CORS: قد يظهر على localhost

❌ أخطاء خطيرة:
   • Service Worker not registered: تحقق من الملف
   • Cache not working: امسح وأعد التحميل
   • Manifest error: تحقق من JSON


📊 قياس الأداء
════════════════════════════════════════════════════════════════════════════════

استخدام Lighthouse:
   1. افتح DevTools
   2. اذهب إلى Lighthouse
   3. اضغط Generate Report
   4. ستحصل على تقرير PWA

النتيجة المتوقعة:
   • PWA Score: 80+
   • Performance: 75+
   • Accessibility: 90+
   • Best Practices: 85+
   • SEO: 90+


🐛 استكشاف الأخطاء الشائعة
════════════════════════════════════════════════════════════════════════════════

المشكلة: Service Worker لا يظهر
الحل:
   1. تحقق من manifest.json موجود
   2. افتح: DevTools > Application > Manifest
   3. جرّب: Ctrl+Shift+R (إعادة تحميل بدون cache)

المشكلة: الـ Cache فارغ
الحل:
   1. في Console، اكتب: window.clearAllCaches()
   2. أعد تحميل الصفحة
   3. اذهب إلى Application > Cache Storage

المشكلة: الإشعارات لا تعمل
الحل:
   1. تحقق من الإذن: Notification.permission
   2. اطلب الإذن: Notification.requestPermission()
   3. جرّب: testNotification()

المشكلة: بنر التثبيت لا يظهر
الحل:
   1. على localhost قد لا يظهر تلقائياً
   2. استخدم Chrome أو Edge
   3. تحقق من manifest.json صحيح

المشكلة: الأداء بطيء
الحل:
   1. امسح الـ Cache: window.clearAllCaches()
   2. أعد التحميل الكامل: Ctrl+Shift+R
   3. تحقق من Network Throttling


📱 الاختبار على الهاتف
════════════════════════════════════════════════════════════════════════════════

تشغيل على Android:
   1. افتح Chrome على الجهاز
   2. اذهب إلى: http://<your-pc-ip>:3000
   3. انتظر ظهور البنر
   4. اضغط "تثبيت"
   5. جرّب بدون انترنت

تشغيل على iPhone:
   1. افتح Safari
   2. اذهب إلى الموقع
   3. اضغط مشاركة (↗️)
   4. "أضف إلى الشاشة الرئيسية"
   5. استخدم التطبيق


💾 حفظ وحماية البيانات
════════════════════════════════════════════════════════════════════════════════

حيث يتم حفظ البيانات:
   • LocalStorage: الإعدادات والتفضيلات
   • IndexedDB: البيانات الكبيرة
   • Cache Storage: الملفات والصفحات
   • SessionStorage: بيانات الجلسة المؤقتة

مسح البيانات:
   في DevTools > Application:
   • LocalStorage > Clear All
   • Cache Storage > Delete All
   • IndexedDB > Delete All

استرجاع البيانات:
   • البيانات تُحتفظ 30 يوم في الـ Cache
   • LocalStorage يُحتفظ بالبيانات دائماً
   • يمكن استرجاع عند الاتصال


🎓 المزيد من المعلومات
════════════════════════════════════════════════════════════════════════════════

الملفات الموثقة:
   📖 README_PWA.md              - الملخص السريع
   📖 PWA_GUIDE.md               - دليل شامل
   📖 PWA_TEST_GUIDE.md          - خطوات الاختبار
   📖 PWA_TESTING_REPORT.md      - التقرير المفصل
   📖 PWA_TEST_SUMMARY.md        - الملخص الشامل

الروابط الخارجية:
   🔗 https://web.dev/progressive-web-apps/
   🔗 https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   🔗 https://developer.mozilla.org/en-US/docs/Web/Manifest


💬 الدعم والمساعدة
════════════════════════════════════════════════════════════════════════════════

للحصول على المساعدة:
   1. اقرأ المستندات في المجلد الجذري
   2. جرّب الأوامر في Console
   3. استخدم أدوات DevTools
   4. تحقق من Browser Compatibility

المتصفحات المدعومة:
   ✅ Chrome 67+
   ✅ Firefox 55+
   ✅ Edge 79+
   ✅ Safari 12+ (محدود)
   ✅ Opera 54+


🎯 الخطوات التالية
════════════════════════════════════════════════════════════════════════════════

الآن بعد الانتهاء من PWA:
   1. ✅ اختبر على أجهزة فعلية
   2. ✅ فعّل Firebase Cloud Messaging
   3. ✅ أضف نظام Queue للعمليات Offline
   4. ✅ نشر على HTTPS
   5. ✅ راقب الأداء والأخطاء


═══════════════════════════════════════════════════════════════════════════════

✨ تم بنجاح! التطبيق الآن PWA احترافي وجاهز للاستخدام! ✨

═══════════════════════════════════════════════════════════════════════════════

EOF
