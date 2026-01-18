#!/bin/bash

# PWA Testing Script - سكريبت اختبار شامل
# استخدام: bash pwa-test.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🧪 TKD Manager PWA Testing Suite 🧪              ║"
echo "╚════════════════════════════════════════════════════════════╝"

PROJECT_DIR="/home/moulkhibra/SMT/tkd-manager"
cd "$PROJECT_DIR" || exit

# الألوان
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# إحصائيات
TESTS_PASSED=0
TESTS_FAILED=0

# ============================================
# 1. اختبار البناء
# ============================================
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}1️⃣  اختبار البناء (Build Test)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

echo "📦 بناء التطبيق..."
if npm run build 2>&1 | grep -q "Successfully"; then
    echo -e "${GREEN}✅ البناء نجح بنجاح${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ فشل البناء${NC}"
    ((TESTS_FAILED++))
fi

# ============================================
# 2. اختبار Package.json
# ============================================
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}2️⃣  اختبار package.json${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# التحقق من المكتبات المهمة
echo "📋 التحقق من المكتبات..."

REQUIRED_PACKAGES=("react" "react-dom" "react-router-dom" "tailwindcss")

for package in "${REQUIRED_PACKAGES[@]}"; do
    if grep -q "\"$package\"" package.json; then
        echo -e "${GREEN}✅ $package موجودة${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $package غير موجودة${NC}"
        ((TESTS_FAILED++))
    fi
done

# ============================================
# 3. اختبار الملفات المهمة
# ============================================
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}3️⃣  اختبار الملفات المهمة${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

IMPORTANT_FILES=(
    "public/service-worker.js"
    "public/manifest.json"
    "src/utils/serviceWorkerRegistration.js"
    "src/components/PWAInstallBanner.js"
    "src/components/NetworkStatus.js"
)

echo "📁 التحقق من ملفات PWA..."
for file in "${IMPORTANT_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" | cut -f1)
        echo -e "${GREEN}✅ $file ($SIZE)${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $file غير موجود${NC}"
        ((TESTS_FAILED++))
    fi
done

# ============================================
# 4. اختبار محتوى الملفات
# ============================================
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}4️⃣  اختبار محتوى الملفات${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

echo "🔍 التحقق من محتوى Service Worker..."
if grep -q "self.addEventListener('install'" public/service-worker.js; then
    echo -e "${GREEN}✅ Service Worker يحتوي على install event${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ install event غير موجود${NC}"
    ((TESTS_FAILED++))
fi

if grep -q "self.addEventListener('fetch'" public/service-worker.js; then
    echo -e "${GREEN}✅ Service Worker يحتوي على fetch event${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ fetch event غير موجود${NC}"
    ((TESTS_FAILED++))
fi

if grep -q "self.addEventListener('activate'" public/service-worker.js; then
    echo -e "${GREEN}✅ Service Worker يحتوي على activate event${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ activate event غير موجود${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "🔍 التحقق من محتوى Manifest..."
if grep -q '"name"' public/manifest.json; then
    echo -e "${GREEN}✅ Manifest يحتوي على اسم التطبيق${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ اسم التطبيق غير موجود${NC}"
    ((TESTS_FAILED++))
fi

if grep -q '"icons"' public/manifest.json; then
    echo -e "${GREEN}✅ Manifest يحتوي على الأيقونات${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ الأيقونات غير موجودة${NC}"
    ((TESTS_FAILED++))
fi

if grep -q '"display"' public/manifest.json; then
    echo -e "${GREEN}✅ Manifest يحتوي على display mode${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ display mode غير موجود${NC}"
    ((TESTS_FAILED++))
fi

# ============================================
# 5. اختبار الأخطاء والتحذيرات
# ============================================
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}5️⃣  اختبار الأخطاء والتحذيرات${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

echo "🔍 التحقق من الأخطاء في الكود..."

# اختبار Service Worker
if node -c public/service-worker.js 2>/dev/null; then
    echo -e "${GREEN}✅ Service Worker بدون أخطاء Syntax${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ Service Worker يحتوي على أخطاء Syntax${NC}"
    ((TESTS_FAILED++))
fi

# اختبار JSON
if python3 -m json.tool public/manifest.json > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Manifest JSON صحيح${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ Manifest JSON غير صحيح${NC}"
    ((TESTS_FAILED++))
fi

# ============================================
# 6. إحصائيات الملفات
# ============================================
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}6️⃣  إحصائيات الملفات${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

echo -e "${YELLOW}📊 أحجام الملفات الرئيسية:${NC}"
du -sh public/service-worker.js src/utils/serviceWorkerRegistration.js public/manifest.json | \
    awk '{print "   " $2 ": " $1}'

echo -e "\n${YELLOW}📋 عدد الملفات في src:${NC}"
find src -type f -name "*.js" | wc -l | awk '{print "   عدد ملفات JS: " $1}'

echo -e "\n${YELLOW}📦 عدد الملفات في public:${NC}"
find public -type f | wc -l | awk '{print "   إجمالي الملفات: " $1}'

# ============================================
# 7. اختبار التطبيق على localhost
# ============================================
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}7️⃣  اختبار الاتصال بـ localhost${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

echo "🌐 التحقق من حالة الخادم..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ الخادم يعمل بنجاح${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  الخادم قد لا يكون متاحاً${NC}"
    echo "   💡 تأكد من تشغيل: npm start"
fi

# ============================================
# 8. اختبار Lighthouse
# ============================================
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}8️⃣  اختبار Lighthouse (اختياري)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

if command -v lighthouse &> /dev/null; then
    echo "⚡ تشغيل Lighthouse..."
    # lighthouse http://localhost:3000 --output-path=./lighthouse-report.json 2>/dev/null
    echo -e "${YELLOW}ℹ️  يمكن تشغيل: lighthouse http://localhost:3000${NC}"
else
    echo -e "${YELLOW}ℹ️  Lighthouse غير مثبت. التثبيت:${NC}"
    echo "   npm install -g lighthouse"
fi

# ============================================
# النتائج النهائية
# ============================================
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 النتائج النهائية${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

TOTAL=$((TESTS_PASSED + TESTS_FAILED))
PERCENTAGE=$((TESTS_PASSED * 100 / TOTAL))

echo ""
echo -e "${GREEN}✅ الاختبارات الناجحة: $TESTS_PASSED${NC}"
echo -e "${RED}❌ الاختبارات الفاشلة: $TESTS_FAILED${NC}"
echo -e "${YELLOW}📊 النسبة المئوية: $PERCENTAGE%${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║               🎉 جميع الاختبارات نجحت! 🎉               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║        ⚠️  توجد اختبارات فاشلة - تحقق من الأخطاء ⚠️        ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
fi

# ============================================
# التوصيات
# ============================================
echo -e "\n${BLUE}💡 التوصيات القادمة:${NC}"
echo "   1. فتح المتصفح على http://localhost:3000"
echo "   2. فتح DevTools (F12)"
echo "   3. اذهب إلى Application → Service Workers"
echo "   4. التحقق من أن Service Worker مسجل وفعال"
echo "   5. اختبار الوضع بدون إنترنت"
echo "   6. اختبار الإشعارات"
echo ""

echo -e "📚 المزيد من المعلومات في:"
echo "   - PWA_GUIDE.md"
echo "   - PWA_TEST_GUIDE.md"
echo ""

exit 0
