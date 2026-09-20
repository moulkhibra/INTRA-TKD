# 🥋 TKD-Manager - نظام إدارة نادي التايكوندو

نظام متكامل لإدارة نادي التايكوندو يتيح إدارة الطلاب والدفعات والحضور والترقيات والبطولات والرسائل.

> ⚠️ **Security status**: a prototype backdoor (`accessCode === '0000'`) in the parent-portal login was removed.
> The PIN check is still client-side and must move to a secure backend (e.g., a Firebase Cloud Function) before production use.
> Demo credentials (`admin@tkd.local / demo123`) are for local testing only — change or disable them everywhere except dev.

## ✨ الميزات الرئيسية

### 📚 إدارة الطلاب
- إضافة وتعديل وحذف الطلاب
- تتبع معلومات الطالب (الاسم، العمر، الجنس، البريد الإلكتروني)
- تتبع الحزام الحالي والترقيات السابقة
- حساب العمر والفئة العمرية (Kids, Cadets, Juniors, Seniors)

### 💰 إدارة الدفعات
- تسجيل الدفعات الشهرية
- تتبع الطلاب غير المدفوعين
- تقارير الإيرادات الشهرية والسنوية
- حساب إجمالي الإيرادات
- حذف وتحديث الدفعات

### 📅 تتبع الحضور
- تسجيل الحضور اليومي
- إحصائيات الحضور (آخر 30 يوم)
- نسب الحضور بالنسبة المئوية
- تنبيهات الحضور المنخفض

### 🏅 إدارة الترقيات (الأحزمة)
- 7 مستويات من الأحزمة (أبيض → أسود)
- تتبع تواريخ الترقيات
- نسب متطلبات الترقية
- شهادات الترقية

### 🏆 البطولات
- تسجيل المشاركة في البطولات
- تسجيل الميداليات (ذهب، فضة، برونز)
- تصنيف الطلاب الأفضل
- إحصائيات الأداء

### 💬 التواصل مع أولياء الأمور
- إرسال رسائل جماعية
- قوالب رسائل مسبقة (دفع، ترقيات، غياب)
- سجل الرسائل المرسلة
- معلومات الاتصال

### 📊 التقارير
- تقارير الإيرادات المالية
- تقارير الحضور
- تقارير الترقيات
- تصدير التقارير

### 🔐 الأمان
- نظام تسجيل دخول آمن
- حماية المسارات
- إدارة الجلسات
- تسجيل خروج آمن

---

## 🛠️ المتطلبات

- **Node.js** v14 أو أحدث
- **npm** v6 أو أحدث
- **Firebase** (Cloud Firestore)

---

## 🚀 التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone https://github.com/moulkhibra/INTRA-TKD.git
cd tkd-manager
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. إعداد Firebase

تأكد من ملف `src/firebase.js` يحتوي على إعدادات Firebase الصحيحة:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. تشغيل المشروع

```bash
npm start
```

سيفتح المتصفح تلقائياً على `http://localhost:3000`

### 5. بيانات تسجيل الدخول التجريبية

```
البريد الإلكتروني: admin@tkd.local
كلمة المرور: demo123
```

---

## 📁 هيكل المشروع

```
tkd-manager/
├── src/
│   ├── App.js                      # المكون الرئيسي للتطبيق
│   ├── index.js                    # نقطة البداية
│   ├── firebase.js                 # إعدادات Firebase
│   │
│   ├── views/                      # الصفحات الرئيسية
│   │   ├── DashboardView.js        # لوحة التحكم
│   │   ├── StudentsView.js         # إدارة الطلاب
│   │   ├── AttendanceView.js       # تتبع الحضور
│   │   ├── PaymentsView.js         # إدارة الدفعات
│   │   ├── ExamsView.js            # إدارة الترقيات
│   │   ├── TournamentsView.js      # إدارة البطولات
│   │   ├── MessagesView.js         # التواصل
│   │   ├── ReportsView.js          # التقارير
│   │   └── LoginPage.js            # صفحة تسجيل الدخول
│   │
│   ├── components/                 # المكونات القابلة لإعادة الاستخدام
│   │   ├── StudentForm.js          # نموذج الطالب
│   │   ├── MessageModal.js         # نافذة الرسائل
│   │   ├── MessageTemplate.js      # قوالب الرسائل
│   │   ├── PaymentForm.js          # نموذج الدفع
│   │   ├── TournamentModal.js      # نافذة البطولات
│   │   ├── ProtectedRoute.js       # حماية المسارات
│   │   └── WhatsAppNotifications.js # إشعارات واتس
│   │
│   ├── api/                        # APIs والدوال
│   │   ├── students.js             # API الطلاب
│   │   ├── attendance.api.js       # API الحضور
│   │   ├── payments.api.js         # API الدفعات
│   │   ├── graduations.api.js      # API الترقيات
│   │   ├── tournaments.api.js      # API البطولات
│   │   └── messages.api.js         # API الرسائل
│   │
│   ├── context/                    # State Management
│   │   └── AuthContext.js          # إدارة المصادقة
│   │
│   ├── App.css                     # أنماط عامة
│   └── index.css                   # أنماط Tailwind
│
├── public/                         # الملفات الثابتة
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── firestore.rules                 # قوانين Firestore
├── firestore.indexes.json          # فهارس Firestore
├── firebase.json                   # إعدادات Firebase
├── package.json                    # المكتبات والمعلومات
├── tailwind.config.js              # إعدادات Tailwind CSS
├── postcss.config.js               # إعدادات PostCSS
└── README.md                       # هذا الملف
```

---

## 🔐 الأمان والمصادقة

### نظام تسجيل الدخول
- يتم حفظ بيانات المستخدم في `localStorage`
- عند إعادة فتح التطبيق، يتم استعادة الجلسة تلقائياً
- عند تسجيل الخروج، يتم حذف البيانات تماماً

### حماية المسارات
- جميع المسارات محمية بـ `ProtectedRoute`
- عند محاولة الوصول بدون تسجيل، يتم إعادة التوجيه إلى صفحة تسجيل الدخول
- دعم الأدوار (Admin, User)

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{id} {
      allow read, write: if true;
    }
    match /attendance/{id} {
      allow read, write: if true;
    }
    match /payments/{id} {
      allow read, write: if true;
    }
    match /graduations/{id} {
      allow read, write: if true;
    }
    match /tournaments/{id} {
      allow read, write: if true;
    }
    match /messages/{id} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **ملاحظة:** هذه القوانين للتطوير فقط. يجب تحديثها للإنتاج.

---

## 📝 الأوامر المتاحة

### التطوير
```bash
npm start          # تشغيل المشروع بوضع التطوير
npm test           # تشغيل الاختبارات
npm run build      # بناء نسخة الإنتاج
```

### Firebase
```bash
firebase deploy    # نشر على Firebase
firebase emulate   # تشغيل محاكاة محلية
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة: "Port 3000 is already in use"
```bash
npm start -- --port 3001
```

### المشكلة: "Firebase is not configured"
تأكد من ملف `src/firebase.js` يحتوي على البيانات الصحيحة

### المشكلة: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### المشكلة: "Firestore permission denied"
تأكد من قوانين Firestore تسمح بالقراءة والكتابة

---

## 📱 التوافق

- ✅ Chrome (آخر إصدار)
- ✅ Firefox (آخر إصدار)
- ✅ Safari (آخر إصدار)
- ✅ Edge (آخر إصدار)
- ✅ Mobile browsers

---

## 🚀 النشر (Deployment)

### نشر على Firebase Hosting

```bash
# 1. تسجيل الدخول
firebase login

# 2. بناء المشروع
npm run build

# 3. نشر
firebase deploy
```

### نشر على Vercel

```bash
npm install -g vercel
vercel
```

### نشر على Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

---

## 📧 التواصل والدعم

- **البريد الإلكتروني:** support@tkd-manager.local
- **GitHub Issues:** https://github.com/moulkhibra/INTRA-TKD/issues

---

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT

---

## 👨‍💻 المطور

- **المطور الرئيسي:** مولكيبرا

---

## 🙏 شكر وتقدير

شكراً لاستخدام TKD-Manager! إذا أعجبك المشروع، يرجى إعطاؤه ⭐ على GitHub.

---

## 📚 موارد إضافية

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Router](https://reactrouter.com)

---

**آخر تحديث:** 8 يناير 2026

حظاً موفقاً! 🥋💪

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# INTRA-TKD
