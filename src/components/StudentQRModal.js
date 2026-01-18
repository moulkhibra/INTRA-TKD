// src/components/StudentQRModal.js
import React, { useRef } from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import { X, QrCode as QrCodeIcon, Download, Printer } from 'lucide-react';

const StudentQRModal = ({ student, isOpen, onClose }) => {
  const qrRef = useRef();

  if (!isOpen) return null;

  // تحميل QR Code
  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${student.fullName}_${new Date().getTime()}.png`;
      link.click();
    }
  };

  // طباعة بطاقة العضوية
  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=400,height=600');
    const canvas = qrRef.current?.querySelector('canvas');
    const qrImage = canvas?.toDataURL('image/png') || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <title>بطاقة العضوية - ${student.fullName}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              background: #f0f0f0;
            }
            .card {
              background: white;
              width: 300px;
              height: 400px;
              margin: 0 auto;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              text-align: center;
              border: 3px solid #3b82f6;
            }
            .header {
              background: #3b82f6;
              color: white;
              padding: 10px;
              border-radius: 5px;
              margin-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              font-size: 16px;
            }
            .student-name {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
              margin: 10px 0;
            }
            .student-info {
              font-size: 12px;
              color: #666;
              margin: 5px 0;
            }
            .qr-code {
              margin: 15px auto;
              padding: 10px;
              background: #f9fafb;
              border-radius: 5px;
            }
            .qr-code img {
              max-width: 150px;
              height: auto;
            }
            .footer {
              font-size: 10px;
              color: #999;
              margin-top: 10px;
              border-top: 1px solid #e5e7eb;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>🥋 بطاقة عضوية</h1>
              <p style="margin: 5px 0; font-size: 12px;">نادي التايكواندو</p>
            </div>
            
            <div class="student-name">${student.fullName}</div>
            
            <div class="student-info">
              <strong>رقم العضو:</strong> ${student.id}
            </div>
            
            <div class="qr-code">
              <img src="${qrImage}" alt="QR Code" />
            </div>
            
            <div class="footer">
              صالح من: ${new Date().toLocaleDateString('ar-EG')}
            </div>
          </div>
        </body>
      </html>
    `);

    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* الرأس */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              QR Code الطالب
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* المحتوى */}
        <div className="p-6">
          <div ref={qrRef}>
            <QRCodeGenerator student={student} />
          </div>
          
          {/* معلومات إضافية */}
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                معلومات الطالب:
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• الاسم: <span className="font-medium">{student.name}</span></p>
                <p>• الحزام: <span className="font-medium">{student.currentBelt}</span></p>
                <p>• المستوى: <span className="font-medium">{student.level}</span></p>
                {student.phone && (
                  <p>• الهاتف: <span className="font-medium">{student.phone}</span></p>
                )}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <span className="font-semibold">✅ جاهز للاستخدام!</span>
                <br />
                يمكن للطالب حفظ هذا الكود على هاتفه أو طباعته
              </p>
            </div>
          </div>
        </div>

        {/* الأزرار */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Download size={18} />
            <span>تحميل</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium"
          >
            <Printer size={18} />
            <span>طباعة</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentQRModal;