// src/components/QRCodeGenerator.js
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, User } from 'lucide-react';

const QRCodeGenerator = ({ student }) => {
  const qrRef = useRef(null);

  // بيانات الطالب في QR Code
  const qrData = JSON.stringify({
    id: student.id,
    name: student.name,
    belt: student.currentBelt,
    type: 'tkd-attendance'
  });

  // تحميل QR Code كصورة
  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_${student.name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          QR Code - {student.name}
        </h3>
      </div>

      <div ref={qrRef} className="flex flex-col items-center">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg border-4 border-gray-200">
          <QRCodeSVG
            value={qrData}
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/logo.png", // شعار النادي (اختياري)
              height: 30,
              width: 30,
              excavate: true
            }}
          />
        </div>

        {/* معلومات الطالب */}
        <div className="mt-4 text-center">
          <p className="font-semibold text-gray-800">{student.name}</p>
          <p className="text-sm text-gray-600">
            الحزام: <span className="font-medium">{student.currentBelt}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">ID: {student.id}</p>
        </div>

        {/* زر التحميل */}
        <button
          onClick={downloadQR}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Download className="w-4 h-4" />
          تحميل QR Code
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800 text-center">
          💡 استخدم هذا الكود لتسجيل الحضور السريع
        </p>
      </div>
    </div>
  );
};

export default QRCodeGenerator;