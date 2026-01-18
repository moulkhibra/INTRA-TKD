import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // التحقق من وجود Prompt للتثبيت
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // التحقق من حالة التثبيت
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setShowBanner(false);
    }

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ PWA installed');
        setShowBanner(false);
      } else {
        console.log('❌ PWA installation declined');
      }
      
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // حفظ في localStorage لعدم إظهار البنر مجدداً لمدة 7 أيام
    localStorage.setItem('pwa-banner-dismissed', new Date().getTime().toString());
  };

  // عدم الإظهار إذا تم التثبيت أو تم الرفض مؤخراً
  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0">
            <img src="/SMT.png" alt="TKD Manager" className="w-12 h-12 rounded-lg" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">📱 تثبيت التطبيق</h3>
            <p className="text-sm text-blue-100">
              ثبّت TKD Manager على جهازك للوصول السريع والعمل بدون انترنت
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            <Download size={20} />
            <span>تثبيت</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-blue-500 rounded-lg transition"
            title="إغلاق"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PWAInstallBanner;
