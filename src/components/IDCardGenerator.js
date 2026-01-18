import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Share2 } from 'lucide-react';
import JsBarcode from 'jsbarcode';

const IDCardGenerator = ({ student, clubName = 'INSTITUTE NAME', clubLogo = null }) => {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate unique student ID if not exists
  const generateStudentID = (studentId) => {
    return `STD${String(studentId).padStart(6, '0')}`;
  };

  const studentID = generateStudentID(student.id);

  // Calculate validity date (1 year from now)
  const getValidityDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const validityDate = getValidityDate();

  // Generate Barcode using JsBarcode
  useEffect(() => {
    try {
      const barcodeElement = document.getElementById('barcode');
      if (barcodeElement) {
        JsBarcode(barcodeElement, studentID, {
          format: 'CODE128',
          width: 2,
          height: 40,
          displayValue: true,
          fontSize: 10
        });
      }
    } catch (error) {
      console.error('Error generating barcode:', error);
    }
  }, [studentID]);

  // QR Code data
  const qrData = JSON.stringify({
    id: student.id,
    studentID: generateStudentID(student.id),
    name: student.fullName,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    weight: student.weight,
    belt: student.beltId,
    registrationDate: student.registrationDate,
    validityDate: getValidityDate(),
    club: clubName,
    type: 'tkd-student-id'
  });

  // Download ID Card as Image
  const downloadIDCard = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match the card
      canvas.width = 1000;
      canvas.height = 630;
      
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw blue border
      ctx.strokeStyle = '#0099ff';
      ctx.lineWidth = 20;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Convert HTML element to image
      const html2canvas = (await import('html2canvas')).default;
      const cardElement = cardRef.current;
      const canvasFromHTML = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });
      
      // Download
      const link = document.createElement('a');
      link.download = `ID_Card_${student.fullName.replace(/\s+/g, '_')}.png`;
      link.href = canvasFromHTML.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading ID Card:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Print ID Card
  const printIDCard = () => {
    const printWindow = window.open('', '', 'width=1000,height=630');
    printWindow.document.write(cardRef.current.innerHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="space-y-4">
      {/* ID Card */}
      <div 
        ref={cardRef}
        className="bg-white rounded-lg shadow-2xl p-8"
        style={{
          width: '1000px',
          height: '630px',
          margin: '0 auto',
          direction: 'rtl',
          fontFamily: 'Arial, sans-serif',
          borderLeft: '8px solid #0099ff',
          borderRight: '8px solid #0099ff'
        }}
      >
        {/* Main Container */}
        <div className="flex justify-between items-start h-full">
          {/* Left Section - Student Photo & Info */}
          <div className="flex flex-col items-center w-1/2 pr-6">
            {/* Header */}
            <div className="text-center mb-4 w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                {clubLogo && (
                  <img src={clubLogo} alt="Club Logo" className="h-10" />
                )}
                <h2 className="text-lg font-bold text-blue-600">
                  {clubName}
                </h2>
              </div>
              <p className="text-xs text-gray-600">بطاقة تعريف طالب</p>
            </div>

            {/* Student Photo Placeholder */}
            <div
              className="mb-4 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100"
              style={{ width: '150px', height: '180px' }}
            >
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={student.fullName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <div className="text-3xl text-gray-400">📷</div>
                  <p className="text-xs text-gray-500">الصورة</p>
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="text-center w-full border-t pt-4">
              <div className="mb-2">
                <p className="text-xs text-gray-600 mb-1">الاسم</p>
                <p className="font-bold text-sm">{student.fullName}</p>
              </div>

              <div className="mb-2">
                <p className="text-xs text-gray-600 mb-1">الرقم</p>
                <p className="font-bold text-sm text-blue-600">{studentID}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">الجنس</p>
                <p className="text-sm">{student.gender === 'Male' ? 'ذكر' : 'أنثى'}</p>
              </div>
            </div>
          </div>

          {/* Right Section - QR & Barcode */}
          <div className="flex flex-col items-center justify-between w-1/2 pl-6 border-l-2 border-gray-300">
            {/* QR Code */}
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-600 mb-2">رمز QR</p>
              <div className="bg-white p-2 border-2 border-gray-300 rounded">
                <QRCodeSVG
                  value={qrData}
                  size={150}
                  level="H"
                  includeMargin={true}
                  data-testid="qr-code"
                />
              </div>
            </div>

            {/* Validity Date & Club Name */}
            <div className="text-center w-full py-4 border-t border-b border-gray-300">
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">تاريخ الصلاحية</p>
                <p className="font-bold text-sm text-green-600">{validityDate}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">اسم النادي</p>
                <p className="text-xs font-semibold">{clubName}</p>
              </div>
            </div>

            {/* Barcode */}
            <div className="flex flex-col items-center pt-4">
              <p className="text-xs text-gray-600 mb-2">Barcode</p>
              <svg 
                id="barcode"
                style={{
                  transform: 'scale(0.8)',
                  transformOrigin: 'center',
                  marginBottom: '-10px'
                }}
              />
            </div>

            {/* Authorized Signature */}
            <div className="text-center pt-2 text-xs">
              <p className="text-gray-500 mb-1">_____________</p>
              <p className="text-gray-600">التوقيع المعتمد</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center mt-6">
        <button
          onClick={downloadIDCard}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Download size={18} />
          {isGenerating ? 'جاري التحميل...' : 'تحميل البطاقة'}
        </button>

        <button
          onClick={printIDCard}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Printer size={18} />
          طباعة
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Share2 size={18} />
          مشاركة
        </button>
      </div>
    </div>
  );
};

export default IDCardGenerator;
