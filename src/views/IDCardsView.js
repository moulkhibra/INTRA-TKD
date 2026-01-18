// src/views/IDCardsView.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  CreditCard, 
  Download, 
  Printer, 
  Upload,
  Users,
  Check,
  X
} from 'lucide-react';
import { getStudents } from '../api/students'; // ✅ التصحيح
import IDCard from '../components/IDCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const IDCardsView = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [clubName, setClubName] = useState('أكاديمية التايكواندو');
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents(); // ✅ التصحيح
      setStudents(data);
      if (data.length > 0) {
        setSelectedStudent(data[0]);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    
    setLoading(true);
    try {
      const cards = cardRef.current.querySelectorAll('.id-card-front, .id-card-back');
      
      for (let i = 0; i < cards.length; i++) {
        const canvas = await html2canvas(cards[i], {
          scale: 3,
          backgroundColor: null,
          logging: false
        });
        
        const link = document.createElement('a');
        link.download = `${selectedStudent.name}_${i === 0 ? 'front' : 'back'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (error) {
      console.error('Error downloading:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    
    setLoading(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54] // حجم بطاقة الائتمان القياسي
      });

      const cards = cardRef.current.querySelectorAll('.id-card-front, .id-card-back');
      
      for (let i = 0; i < cards.length; i++) {
        if (i > 0) pdf.addPage();
        
        const canvas = await html2canvas(cards[i], {
          scale: 3,
          backgroundColor: '#ffffff',
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, 85.6, 54);
      }
      
      pdf.save(`${selectedStudent.name}_ID_Card.pdf`);
    } catch (error) {
      console.error('Error creating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* الرأس */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              إصدار بطاقات الهوية
            </h1>
          </div>
          <p className="text-gray-600">
            صمم واطبع بطاقات هوية احترافية للطلاب
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* لوحة التحكم */}
          <div className="lg:col-span-1 space-y-6">
            {/* اختيار الطالب */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  اختر الطالب
                </h3>
              </div>
              
              <select
                value={selectedStudent?.id || ''}
                onChange={(e) => {
                  const student = students.find(s => s.id === e.target.value);
                  setSelectedStudent(student);
                  setPhoto(null); // إعادة تعيين الصورة
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              >
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.currentBelt}
                  </option>
                ))}
              </select>

              {selectedStudent && (
                <div className="bg-purple-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحزام:</span>
                    <span className="font-semibold">{selectedStudent.currentBelt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المستوى:</span>
                    <span className="font-semibold">{selectedStudent.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-semibold">{selectedStudent.phone || '---'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* بيانات البطاقة */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                بيانات البطاقة
              </h3>

              {/* رفع الصورة */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة الطالب
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {photo && (
                  <div className="mt-3 relative">
                    <img 
                      src={photo} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setPhoto(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* اسم النادي */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم النادي
                </label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                الإجراءات
              </h3>

              <button
                onClick={handleDownloadPNG}
                disabled={!selectedStudent || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    تحميل PNG
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={!selectedStudent || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                تحميل PDF
              </button>

              <button
                onClick={handlePrint}
                disabled={!selectedStudent}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer className="w-5 h-5" />
                طباعة
              </button>
            </div>

            {/* نصائح */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Check className="w-4 h-4" />
                نصائح للطباعة:
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• استخدم بطاقات PVC بحجم 85.6 × 54 مم</li>
                <li>• اطبع بجودة عالية (300 DPI)</li>
                <li>• استخدم طابعة بطاقات احترافية</li>
                <li>• تأكد من معايرة الألوان</li>
              </ul>
            </div>
          </div>

          {/* معاينة البطاقة */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                معاينة البطاقة
              </h3>

              {selectedStudent ? (
                <div 
                  ref={cardRef}
                  className="flex flex-col items-center gap-8"
                  style={{ direction: 'ltr' }}
                >
                  <IDCard 
                    student={selectedStudent}
                    photo={photo}
                    clubName={clubName}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>اختر طالباً لعرض البطاقة</p>
                </div>
              )}
            </div>

            {/* معلومات إضافية */}
            <div className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
              <h4 className="font-semibold mb-2">💡 ملاحظة مهمة:</h4>
              <p className="text-sm opacity-90">
                البطاقة تحتوي على QR Code يمكن مسحه لتسجيل الحضور تلقائياً.
                تأكد من طباعة الوجه الخلفي بوضوح لضمان عمل QR Code بشكل صحيح.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* أنماط الطباعة */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .id-card-container,
          .id-card-container * {
            visibility: visible;
          }
          .id-card-container {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default IDCardsView;