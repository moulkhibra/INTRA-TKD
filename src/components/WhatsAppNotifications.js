import React, { useState } from 'react';
import { MessageCircle, Users, AlertCircle, Award, Calendar, Copy, Check, X, Phone } from 'lucide-react';

const WhatsAppNotifications = ({ 
  students, 
  unpaidStudents, 
  eligibleStudents, 
  getAttendanceStats 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedNumbers, setCopiedNumbers] = useState([]);

  // قوالب الرسائل
  const messageTemplates = [
    {
      id: 'payment-reminder',
      title: 'تذكير بالدفع',
      icon: AlertCircle,
      color: 'orange',
      category: 'unpaid',
      recipients: unpaidStudents,
      template: (student) => `السلام عليكم،

تذكير ودي بدفع رسوم التدريب لهذا الشهر:

👤 الطالب: ${student.fullName}
💵 المبلغ: 100 دولار
📅 الشهر: ${new Date().toLocaleString('ar', { month: 'long', year: 'numeric' })}

يمكنكم الدفع في النادي أو التواصل معنا لترتيب الدفع.

شكراً لتعاونكم 🙏
نادي التايكوندو`
    },
    {
      id: 'exam-notification',
      title: 'إشعار امتحان الحزام',
      icon: Award,
      color: 'green',
      category: 'eligible',
      recipients: eligibleStudents,
      template: (student) => `السلام عليكم،

خبر سار! ابنكم/ابنتكم مؤهل(ة) لامتحان الحزام القادم:

👤 الطالب: ${student.fullName}
🥋 الحزام الحالي: ${getBeltName(student.beltId)}
⬆️ الحزام القادم: ${getNextBeltName(student.beltId)}
📅 تاريخ الامتحان: [سيتم الإعلان قريباً]

يرجى تأكيد المشاركة.

بالتوفيق! 🌟
نادي التايكوندو`
    },
    {
      id: 'low-attendance',
      title: 'تنبيه الغياب',
      icon: Calendar,
      color: 'red',
      category: 'low-attendance',
      recipients: students.filter(s => {
        const pct = Math.round((getAttendanceStats(s.id, 30) / 30) * 100);
        return pct < 60;
      }),
      template: (student) => {
        const attendancePct = Math.round((getAttendanceStats(student.id, 30) / 30) * 100);
        return `السلام عليكم،

لاحظنا أن ${student.fullName} لم يحضر التدريبات بشكل منتظم مؤخراً.

📊 نسبة الحضور: ${attendancePct}%
📅 آخر 30 يوم: ${getAttendanceStats(student.id, 30)} حصة

نتمنى رؤيته/رؤيتها قريباً! إذا كان هناك أي مشكلة، نحن هنا للمساعدة.

تحياتنا 🙏
نادي التايكوندو`;
      }
    },
    {
      id: 'welcome',
      title: 'رسالة ترحيب',
      icon: Users,
      color: 'blue',
      category: 'custom',
      recipients: [],
      template: (student) => `السلام عليكم ومرحباً بكم،

نحن سعداء بانضمام ${student.fullName} إلى عائلة نادي التايكوندو! 🥋

📍 موقع النادي: [العنوان]
⏰ أوقات التدريب:
   - الأحد، الثلاثاء، الخميس: 5:00 - 6:30 مساءً
   
👤 تم تسجيله في فئة: ${getAgeCategory(student.dateOfBirth)}
🥋 الحزام الحالي: ${getBeltName(student.beltId)}

نتطلع لرؤيتكم في الحصة القادمة!

بالتوفيق 🌟
نادي التايكوندو`
    },
    {
      id: 'achievement',
      title: 'تهنئة بالإنجاز',
      icon: Award,
      color: 'yellow',
      category: 'custom',
      recipients: [],
      template: (student) => `السلام عليكم،

مبروك! 🎉

نفخر بإعلان تفوق ${student.fullName} وحصوله/حصولها على:
🥋 الحزام الجديد: ${getNextBeltName(student.beltId)}

استمر في التدريب والاجتهاد! 💪

تهانينا الحارة 🌟
نادي التايكوندو`
    },
    {
      id: 'event',
      title: 'إعلان عن فعالية',
      icon: Calendar,
      color: 'purple',
      category: 'all',
      recipients: students,
      template: (student) => `السلام عليكم،

نعلن عن فعالية خاصة في النادي! 🎊

📅 التاريخ: [التاريخ]
⏰ الوقت: [الوقت]
📍 المكان: [المكان]
🎯 الموضوع: [الموضوع]

ندعوكم جميعاً للحضور والمشاركة!

نراكم قريباً 👋
نادي التايكوندو`
    }
  ];

  // Helper functions
  const getBeltName = (beltId) => {
    const belts = ['', 'White', 'Yellow', 'Orange', 'Green', 'Blue', 'Red', 'Black'];
    return belts[beltId] || 'Unknown';
  };

  const getNextBeltName = (beltId) => {
    const belts = ['', 'White', 'Yellow', 'Orange', 'Green', 'Blue', 'Red', 'Black'];
    return belts[beltId + 1] || 'Black';
  };

  const getAgeCategory = (dateOfBirth) => {
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age <= 11) return 'Kids (≤11)';
    if (age >= 12 && age <= 14) return 'Cadets (12-14)';
    if (age >= 15 && age <= 17) return 'Juniors (15-17)';
    return 'Seniors (18+)';
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setSelectedStudents(template.recipients);
    setShowPreview(true);
  };

  const copyToClipboard = (text, studentId) => {
    navigator.clipboard.writeText(text);
    setCopiedNumbers([...copiedNumbers, studentId]);
    setTimeout(() => {
      setCopiedNumbers(copiedNumbers.filter(id => id !== studentId));
    }, 2000);
  };

  const openWhatsApp = (phone, message) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  const copyAllNumbers = () => {
    const numbers = selectedStudents
      .filter(s => s.parentPhone)
      .map(s => s.parentPhone)
      .join('\n');
    
    navigator.clipboard.writeText(numbers);
    alert('تم نسخ جميع الأرقام!');
  };

  const getColorClasses = (color) => {
    const colors = {
      orange: 'from-orange-500 to-orange-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      blue: 'from-blue-500 to-blue-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600'
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <MessageCircle className="text-green-600" size={32} />
          <span>📱 WhatsApp Notifications</span>
        </h2>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex">
          <MessageCircle className="text-blue-500 mr-3 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-blue-800">كيف يعمل النظام؟</h3>
            <p className="text-blue-700 text-sm mt-1">
              اختر قالب الرسالة → سيتم إنشاء رسائل مخصصة لكل طالب → يمكنك نسخ الرسالة وإرسالها عبر WhatsApp أو فتح WhatsApp مباشرة
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div>
        <h3 className="text-lg font-bold mb-4">قوالب الرسائل الجاهزة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {messageTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`bg-gradient-to-br ${getColorClasses(template.color)} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon size={32} className="opacity-80" />
                  <div className="bg-white text-gray-800 rounded-full px-3 py-1 text-sm font-bold">
                    {template.recipients.length}
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2">{template.title}</h4>
                <p className="text-sm opacity-90">
                  {template.recipients.length} طالب
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <MessageCircle className="text-green-600" size={24} />
                <span>{selectedTemplate.title}</span>
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{selectedStudents.length}</p>
                    <p className="text-sm text-gray-600">إجمالي المستلمين</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedStudents.filter(s => s.parentPhone).length}
                    </p>
                    <p className="text-sm text-gray-600">لديهم رقم</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedStudents.filter(s => !s.parentPhone).length}
                    </p>
                    <p className="text-sm text-gray-600">بدون رقم</p>
                  </div>
                </div>
                
                {selectedStudents.filter(s => s.parentPhone).length > 0 && (
                  <button
                    onClick={copyAllNumbers}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Copy size={18} />
                    <span>نسخ جميع الأرقام</span>
                  </button>
                )}
              </div>

              {/* Messages List */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">الرسائل المخصصة:</h4>
                
                {selectedStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users size={48} className="mx-auto mb-3 opacity-50" />
                    <p>لا يوجد طلاب مؤهلين لهذا القالب</p>
                  </div>
                ) : (
                  selectedStudents.map((student) => {
                    const message = selectedTemplate.template(student);
                    const hasPhone = !!student.parentPhone;
                    const isCopied = copiedNumbers.includes(student.id);

                    return (
                      <div key={student.id} className={`border rounded-lg p-4 ${!hasPhone ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-lg">{student.fullName}</p>
                            {hasPhone ? (
                              <p className="text-sm text-gray-600 flex items-center space-x-1">
                                <Phone size={14} />
                                <span>{student.parentPhone}</span>
                              </p>
                            ) : (
                              <p className="text-sm text-red-600 flex items-center space-x-1">
                                <AlertCircle size={14} />
                                <span>لا يوجد رقم هاتف</span>
                              </p>
                            )}
                          </div>
                          
                          {hasPhone && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => copyToClipboard(message, student.id)}
                                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                                title="نسخ الرسالة"
                              >
                                {isCopied ? (
                                  <Check size={18} className="text-green-600" />
                                ) : (
                                  <Copy size={18} className="text-gray-600" />
                                )}
                              </button>
                              <button
                                onClick={() => openWhatsApp(student.parentPhone, message)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                              >
                                <MessageCircle size={18} />
                                <span>فتح WhatsApp</span>
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap font-arabic">
                          {message}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Missing Phone Numbers Warning */}
              {selectedStudents.filter(s => !s.parentPhone).length > 0 && (
                <div className="mt-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                  <div className="flex">
                    <AlertCircle className="text-orange-500 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-bold text-orange-800">تنبيه</p>
                      <p className="text-orange-700 text-sm">
                        {selectedStudents.filter(s => !s.parentPhone).length} طالب ليس لديهم رقم هاتف مسجل
                      </p>
                      <div className="mt-2 space-y-1">
                        {selectedStudents.filter(s => !s.parentPhone).map(s => (
                          <p key={s.id} className="text-xs text-orange-600">• {s.fullName}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppNotifications;