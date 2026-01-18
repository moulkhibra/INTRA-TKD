import React, { useState, useRef, useEffect } from 'react';
import { QrCode, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRKioskMode = ({ onAttendanceRecorded, students = [] }) => {
  const [scannedStudent, setScannedStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error'
  const scannerRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    // تهيئة الماسح الضوئي
    const scanner = new Html5QrcodeScanner(
      'qr-scanner-kiosk',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    return () => {
      scanner.clear();
    };
  }, []);

  const onScanSuccess = (decodedText) => {
    try {
      const qrData = JSON.parse(decodedText);
      const student = students.find(s => s.id === qrData.id);

      if (student) {
        // عرض رسالة النجاح
        setScannedStudent(student);
        setMessage(`مرحباً ${student.fullName}! ✅ تم تسجيل الحضور`);
        setMessageType('success');

        // تشغيل صوت النجاح
        playSuccessSound();

        // إرسال البيانات
        if (onAttendanceRecorded) {
          onAttendanceRecorded({
            studentId: student.id,
            timestamp: new Date(),
            method: 'QR_CODE'
          });
        }

        // مسح الرسالة بعد 3 ثوانٍ
        if (messageTimeoutRef.current) {
          clearTimeout(messageTimeoutRef.current);
        }
        messageTimeoutRef.current = setTimeout(() => {
          setScannedStudent(null);
          setMessage('');
          setMessageType('');
        }, 3000);
      } else {
        // طالب غير معروف
        setMessage('❌ كود غير صحيح أو طالب غير مسجل');
        setMessageType('error');
        playErrorSound();

        if (messageTimeoutRef.current) {
          clearTimeout(messageTimeoutRef.current);
        }
        messageTimeoutRef.current = setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('خطأ في قراءة QR Code:', error);
      setMessage('⚠️ خطأ في قراءة الكود');
      setMessageType('error');
    }
  };

  const onScanFailure = (error) => {
    // لا نعرض رسائل خطأ للمحاولات الفاشلة الطبيعية
    console.log('فشل الفحص:', error);
  };

  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const playErrorSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 400;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleReset = () => {
    setScannedStudent(null);
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center p-4">
      {/* الرأس */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <QrCode size={48} className="text-white" />
          <h1 className="text-4xl font-bold text-white">كشك التسجيل الذاتي</h1>
        </div>
        <p className="text-blue-100 text-lg">🥋 مسح QR Code للدخول إلى النادي</p>
      </div>

      {/* منطقة الماسح */}
      <div className="w-full max-w-md">
        {/* الرسالة */}
        {message && (
          <div
            className={`mb-6 p-6 rounded-lg flex items-center gap-3 ${
              messageType === 'success'
                ? 'bg-green-100 border-2 border-green-500'
                : 'bg-red-100 border-2 border-red-500'
            }`}
          >
            {messageType === 'success' ? (
              <CheckCircle size={32} className="text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle size={32} className="text-red-600 flex-shrink-0" />
            )}
            <div>
              <p
                className={`text-xl font-bold ${
                  messageType === 'success'
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                {message}
              </p>
              {scannedStudent && (
                <p className="text-sm text-gray-700 mt-1">
                  وقت الحضور: {new Date().toLocaleTimeString('ar-EG')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ماسح QR */}
        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
          <div id="qr-scanner-kiosk" className="w-full"></div>
        </div>

        {/* تعليمات */}
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-white">
          <h3 className="font-bold text-lg mb-3">📋 الخطوات:</h3>
          <ol className="space-y-2 text-sm">
            <li>1️⃣ قف أمام الكاميرا</li>
            <li>2️⃣ اعرض QR Code من هاتفك أو البطاقة</li>
            <li>3️⃣ سيتم تسجيل حضورك تلقائياً ✅</li>
          </ol>
        </div>
      </div>

      {/* زر إعادة التعيين (للطوارئ) */}
      {(message || scannedStudent) && (
        <button
          onClick={handleReset}
          className="mt-6 flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium"
        >
          <RotateCcw size={20} />
          إعادة تعيين
        </button>
      )}

      {/* معلومات النظام */}
      <div className="mt-8 text-white text-center text-sm">
        <p>نظام تسجيل الحضور الذاتي</p>
        <p className="text-blue-200">للمزيد من المعلومات، تواصل مع الاستقبال</p>
      </div>
    </div>
  );
};

export default QRKioskMode;
