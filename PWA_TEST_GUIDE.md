# 🧪 دليل اختبار PWA - خطوة بخطوة

## 📋 متطلبات الاختبار

- ✅ متصفح حديث (Chrome 67+, Edge 79+, Firefox 55+)
- ✅ الاتصال بالإنترنت
- ✅ DevTools مفتوح
- ✅ التطبيق يعمل على http://localhost:3000

---

## 🚀 الخطوة 1: فتح التطبيق

### 1.1 من المتصفح
```bash
# اترك npm start يعمل في Terminal
# افتح المتصفح على:
http://localhost:3000
```

### 1.2 فتح DevTools
```
Windows/Linux: F12 أو Ctrl+Shift+I
Mac: Cmd+Option+I
```

---

## 🔍 الخطوة 2: اختبار Service Worker

### 2.1 في DevTools
1. اذهب إلى تبويب **Application**
2. اختر **Service Workers** من القائمة اليسرى
3. **يجب أن تحصل على:**
   - ✅ Service Worker بحالة "activated and running"
   - ✅ Scope: http://localhost:3000/
   - ✅ رقم الإصدار: v1.0

### 2.2 التحقق من الحالة
```javascript
// اكتب هذا في Console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
  regs.forEach(reg => {
    console.log('Status:', reg.active ? 'Active ✅' : 'Waiting ⏳');
  });
});
```

**النتيجة المتوقعة:**
```
Service Workers: [ServiceWorkerRegistration]
Status: Active ✅
```

---

## 💾 الخطوة 3: اختبار Cache

### 3.1 في DevTools
1. اذهب إلى تبويب **Application**
2. اختر **Cache Storage** من القائمة
3. **يجب أن تحصل على:**
   - ✅ `tkd-manager-v1` (الـ Cache الرئيسي)
   - ✅ `tkd-manager-runtime` (البيانات الديناميكية)
   - ✅ `tkd-manager-assets` (الأصول الثابتة)

### 3.2 عرض محتويات Cache
```javascript
// في Console
window.showCache('tkd-manager-v1');

// النتيجة:
http://localhost:3000/
http://localhost:3000/favicon.ico
http://localhost:3000/manifest.json
... وملفات أخرى
```

### 3.3 حجم Cache
```javascript
// في Console
navigator.storage.estimate().then(({usage, quota}) => {
  const percent = (usage / quota * 100).toFixed(2);
  console.log(`التخزين: ${usage} bytes (${percent}%)`);
  console.log(`السعة: ${quota} bytes`);
});
```

---

## 📱 الخطوة 4: اختبار البنر

### 4.1 فحص العناصر
1. افتح DevTools
2. اضغط على **Elements** أو **Inspector**
3. ابحث عن `PWAInstallBanner`
4. **يجب أن تحصل على:**
   - ✅ عنصر div بـ ID `pwa-install-banner`
   - ✅ زر بنص "تحميل التطبيق"
   - ✅ أيقونة التطبيق

### 4.2 الاختبار اليدوي (اختياري)
```javascript
// اختبار شرط beforeinstallprompt
// في Console
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ beforeinstallprompt event fired');
  e.preventDefault(); // لمنع العرض الافتراضي
});
```

---

## 🌐 الخطوة 5: اختبار الاتصال الشبكي

### 5.1 اختبار الحالة الحالية
```javascript
// في Console
console.log('حالة الاتصال:', navigator.onLine ? '✅ Online' : '❌ Offline');
```

### 5.2 محاكاة قطع الاتصال
1. في DevTools
2. اذهب إلى تبويب **Network**
3. افتح القائمة المنسدلة (حيث مكتوب "No throttling")
4. اختر **Offline**
5. **يجب أن تحصل على:**
   - ✅ ظهور إشعار "❌ بدون اتصال بالإنترنت"
   - ✅ الصفحات المخزنة تعمل
   - ✅ لا تظهر رسائل خطأ شديدة

### 5.3 العودة للاتصال
1. في DevTools
2. اختر **Online**
3. **يجب أن تحصل على:**
   - ✅ الإشعار يختفي تلقائياً
   - ✅ البيانات تتحدث
   - ✅ العودة للعمل الطبيعي

---

## 🔔 الخطوة 6: اختبار الإشعارات

### 6.1 طلب الإذن
```javascript
// في Console
Notification.requestPermission().then(permission => {
  console.log('الإذن:', permission);
  if (permission === 'granted') {
    console.log('✅ تم منح إذن الإشعارات');
  }
});
```

### 6.2 إرسال إشعار اختبار
```javascript
// في Console
testNotification();

// أو يدوياً:
new Notification('اختبار', {
  body: '✅ هذا إشعار اختبار',
  icon: '/favicon.ico'
});
```

**النتيجة المتوقعة:**
- ✅ ظهور إشعار على الشاشة
- ✅ الإشعار يحتوي على الأيقونة
- ✅ الرسالة واضحة

---

## 🎯 الخطوة 7: اختبار Manifest

### 7.1 التحقق من Manifest
```javascript
// في Console
const manifest = document.querySelector('link[rel="manifest"]');
console.log('Manifest:', manifest.href);

// جلب البيانات
fetch(manifest.href)
  .then(r => r.json())
  .then(data => console.log(data));
```

**يجب أن تحصل على:**
```json
{
  "name": "TKD Manager",
  "short_name": "TKD",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "start_url": "/",
  "scope": "/",
  ...
}
```

### 7.2 في DevTools
1. اذهب إلى **Application**
2. اختر **Manifest**
3. **يجب أن تحصل على:**
   - ✅ اسم التطبيق
   - ✅ الأيقونات
   - ✅ الألوان
   - ✅ الاختصارات (Shortcuts)

---

## 📊 الخطوة 8: اختبار القالب الكامل

### 8.1 تشغيل سيناريو الاختبار
```javascript
// في Console، اكتب:
// ثم اضغط Enter

// ستحصل على ملخص كامل بـ:
// ✅ Service Worker Status
// ✅ Network Status
// ✅ Notification Status
// ✅ Cache Status
// ✅ Storage Status
// ✅ Install Status
```

---

## ✅ قائمة التحقق (Checklist)

اطبع هذه القائمة واملأها أثناء الاختبار:

```
[ ] Service Worker تم تسجيله بنجاح
[ ] الـ Cache يحتوي على الملفات
[ ] بنر التثبيت يظهر (على الويب)
[ ] الإشعارات تعمل
[ ] حالة الاتصال تعرض الرسائل
[ ] النمط بدون إنترنت يعمل
[ ] Manifest صحيح
[ ] التخزين يعمل بكفاءة
[ ] التطبيق يحمل بسرعة
[ ] لا توجد أخطاء في Console
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: Service Worker لا يظهر
**الحل:**
```javascript
// في Console
navigator.serviceWorker.register('/service-worker.js')
  .then(reg => console.log('✅ Registered', reg))
  .catch(err => console.error('❌ Error:', err));
```

### المشكلة: الـ Cache فارغ
**الحل:**
```javascript
// امسح الـ Cache وأعد التحميل
await caches.keys().then(names => 
  Promise.all(names.map(name => caches.delete(name)))
);
location.reload();
```

### المشكلة: الإشعارات لا تعمل
**الحل:**
```javascript
// تحقق من الإذن
console.log('الإذن:', Notification.permission);

// إذا كان "denied"، امسح إعدادات الموقع وأعد التحميل
```

### المشكلة: لا يظهر بنر التثبيت
**ملاحظات:**
- على الويب: قد لا يظهر على localhost
- على الهاتف: قد لا يظهر في المرات الأولى
- تحقق من manifest.json

---

## 📱 اختبار على الهاتف

### خطوات على Android
1. افتح Chrome
2. اذهب إلى `http://<your-pc-ip>:3000`
3. انتظر ظهور البنر
4. اضغط "تثبيت"
5. جرّب الاستخدام بدون إنترنت

### خطوات على iPhone
1. افتح Safari
2. اذهب إلى الموقع
3. اضغط مشاركة (↗️)
4. "أضف إلى الشاشة الرئيسية"
5. استخدم التطبيق

---

## 📈 قياس الأداء

### 1. Lighthouse
1. في DevTools
2. اختر **Lighthouse**
3. اضغط **Generate Report**
4. **النتيجة المتوقعة:**
   - 🟢 PWA: 80+
   - 🟢 Performance: 75+

### 2. Network
1. افتح **Network Tab**
2. أعد تحميل الصفحة
3. **يجب أن تحصل على:**
   - ⚡ وقت التحميل < 3 ثواني
   - 📦 حجم أقل من 2MB
   - ✅ معظم الملفات من Cache

---

## 🎉 النتائج المتوقعة

بعد الانتهاء من جميع الاختبارات:

| الاختبار | النتيجة | الحالة |
|---------|--------|--------|
| Service Worker | مسجل وفعال | ✅ |
| Cache | 300+ ملف مخزن | ✅ |
| Offline | يعمل بدون انترنت | ✅ |
| Notifications | تظهر بشكل صحيح | ✅ |
| Install | يمكن التثبيت | ✅ |
| Performance | سريع وفعال | ✅ |

---

## 📞 الدعم

إذا حدثت مشاكل:
1. افتح DevTools
2. اذهب إلى Console
3. ابحث عن الأخطاء الحمراء
4. تحقق من Service Worker في Application

**تذكر:** إعادة التحميل بـ `Ctrl+Shift+R` (بدون تخزين) قد تساعد!

---

## ✨ مبروك! 🎊

لقد أكملت اختبار PWA الشامل! التطبيق الآن:
- 📱 قابل للتثبيت
- 📡 يعمل بدون انترنت
- 🔔 يدعم الإشعارات
- ⚡ سريع وفعال
- 💾 يحتفظ بالبيانات
