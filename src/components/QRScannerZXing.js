// src/components/QRScannerZXing.js
// ✅ نسخة بديلة قوية باستخدام ZXing
import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { recordAttendance } from '../api/attendance.api';

const QRScannerZXing = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [scanMessage, setScanMessage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  // تحميل الكاميرات المتاحة
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error loading devices:', error);
        showMessage('error', 'لا يمكن الوصول للكاميرا');
      }
    };

    loadDevices();
  }, []);

  // بدء/إيقاف المسح
  useEffect(() => {
    if (scanning && selectedDevice && videoRef.current) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => stopScanning();
  }, [scanning, selectedDevice]);

  const startScanning = async () => {
    try {
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      await codeReaderRef.current.decodeFromVideoDevice(
        selectedDevice,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScanSuccess(result.getText());
          }
          // تجاهل الأخطاء العادية
        }
      );
    } catch (error) {
      console.error('Scan error:', error);
      showMessage('error', 'خطأ في بدء المسح');
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
  };

  const handleScanSuccess = async (decodedText) => {
    try {
      // منع المسح المتكرر
      if (lastScan && Date.now() - lastScan < 3000) {
        return;
      }

      // محاولة تحليل البيانات
      const data = JSON.parse(decodedText);
      
      // التحقق من نوع الكود
      if (data.type !== 'tkd-attendance') {
        showMessage('error', 'QR Code غير صالح');
        return;
      }

      setLastScan(Date.now());

      // تسجيل الحضور
      await recordAttendance({
        studentId: data.id,
        studentName: data.name,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ar-MA', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: 'حاضر',
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
      console.error('QR processing error:', error);
      showMessage('error', 'خطأ في معالجة الكود');
      
      if (onScanError) {
        onScanError(error);
      }
    }
  };

  const playSuccessSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dy');
    audio.play().catch(err => console.log('Sound error:', err));
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
      {/* الرأس */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            مسح QR Code (ZXing)
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

      {/* اختيار الكاميرا */}
      {devices.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اختر الكاميرا:
          </label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            disabled={scanning}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `كاميرا ${device.deviceId.substring(0, 5)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* منطقة الفيديو */}
      <div className="relative">
        <video
          ref={videoRef}
          className={`w-full rounded-lg border-2 ${
            scanning ? 'border-blue-500' : 'border-gray-300'
          }`}
          style={{ 
            maxHeight: '400px',
            display: scanning ? 'block' : 'none'
          }}
        />
        
        {!scanning && (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>اضغط "بدء المسح" لتشغيل الكاميرا</p>
            </div>
          </div>
        )}
      </div>

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

      {/* معلومات */}
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

export default QRScannerZXing;