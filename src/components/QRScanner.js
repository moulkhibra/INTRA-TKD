// src/components/QRScanner.js
import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CheckCircle, XCircle, Clock } from 'lucide-react';
import { addAttendance } from '../api/attendance.api';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [scanMessage, setScanMessage] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeScannerRef = useRef(null);

  useEffect(() => {
    if (scanning && !html5QrCodeScannerRef.current) {
      // تهيئة الماسح
      html5QrCodeScannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          rememberLastUsedCamera: true
        },
        false
      );

      html5QrCodeScannerRef.current.render(onScanSuccessHandler, onScanFailureHandler);
    }

    return () => {
      if (html5QrCodeScannerRef.current) {
        html5QrCodeScannerRef.current.clear().catch(err => {
          console.error('Error clearing scanner:', err);
        });
        html5QrCodeScannerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  const onScanSuccessHandler = async (decodedText) => {
    try {
      // محاولة تحليل البيانات
      const data = JSON.parse(decodedText);
      
      // التحقق من أن الكود من نظامنا
      if (data.type !== 'tkd-attendance') {
        showMessage('error', 'QR Code غير صالح');
        return;
      }

      // منع المسح المتكرر خلال 3 ثواني
      if (lastScan && Date.now() - lastScan < 3000) {
        return;
      }

      setLastScan(Date.now());

      // تسجيل الحضور
      await addAttendance({
        studentId: data.id,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
        status: 'present',
        method: 'QR Code'
      });

      // صوت النجاح
      playSuccessSound();
      
      // رسالة النجاح
      showMessage('success', `✅ تم تسجيل حضور ${data.name}`);
      
      if (onScanSuccess) {
        onScanSuccess(data);
      }

    } catch (error) {
      console.error('QR Scan Error:', error);
      showMessage('error', 'خطأ في قراءة الكود');
      
      if (onScanError) {
        onScanError(error);
      }
    }
  };

  const onScanFailureHandler = (error) => {
    // تجاهل أخطاء المسح العادية (لا يوجد كود في الصورة)
    // فقط اعرض الأخطاء الحقيقية
    if (!error.includes('NotFoundException')) {
      console.warn('Scan error:', error);
    }
  };

  const playSuccessSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dy');
    audio.play().catch(err => console.log('Sound play failed:', err));
  };

  const showMessage = (type, text) => {
    setScanMessage({ type, text });
    setTimeout(() => setScanMessage(null), 3000);
  };

  const toggleScanning = () => {
    setScanning(!scanning);
    setScanMessage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            مسح QR Code
          </h3>
        </div>
        
        <button
          onClick={toggleScanning}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            scanning
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {scanning ? 'إيقاف' : 'بدء المسح'}
        </button>
      </div>

      {/* منطقة المسح */}
      {scanning && (
        <div className="relative">
          <div 
            id="qr-reader" 
            ref={scannerRef}
            className="rounded-lg overflow-hidden"
          />
        </div>
      )}

      {/* رسائل الحالة */}
      {scanMessage && (
        <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
          scanMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {scanMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="font-medium">{scanMessage.text}</p>
        </div>
      )}

      {/* تعليمات */}
      {!scanning && !scanMessage && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900 mb-2">
                كيفية الاستخدام:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• اضغط على "بدء المسح" لتشغيل الكاميرا</li>
                <li>• وجّه الكاميرا نحو QR Code الطالب</li>
                <li>• سيتم تسجيل الحضور تلقائياً</li>
                <li>• يمكنك مسح عدة أكواد بشكل متتالي</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* آخر عملية مسح */}
      {lastScan && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-600">
            آخر مسح: {new Date(lastScan).toLocaleTimeString('ar-MA')}
          </p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;