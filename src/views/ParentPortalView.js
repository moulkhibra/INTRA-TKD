// src/views/ParentPortalView.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Award,
  Bell,
  MessageSquare,
  QrCode
} from 'lucide-react';
import { getParentChildren } from '../api/parents';
import { getStudentAttendance } from '../api/attendance.api';
import { getStudentPayments } from '../api/payments.api';

const ParentPortalView = ({ parentId }) => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childStats, setChildStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadParentData = useCallback(async () => {
    try {
      setLoading(true);
      const childrenData = await getParentChildren(parentId);
      setChildren(childrenData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        await loadChildStats(childrenData[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    loadParentData();
  }, [parentId, loadParentData]);

  const loadChildStats = async (studentId) => {
    try {
      const attendance = await getStudentAttendance(studentId);
      const payments = await getStudentPayments(studentId);
      
      // حساب نسبة الحضور
      const thisMonth = new Date().getMonth();
      const monthAttendance = attendance.filter(a => {
        const date = new Date(a.date);
        return date.getMonth() === thisMonth;
      });
      
      const attendanceRate = monthAttendance.length > 0 
        ? (monthAttendance.filter(a => a.status === 'حاضر').length / monthAttendance.length * 100).toFixed(1)
        : 0;

      // آخر دفعة
      const lastPayment = payments.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      )[0];

      setChildStats({
        attendanceRate,
        totalAttendance: monthAttendance.length,
        lastPayment,
        totalPayments: payments.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleChildSelect = async (child) => {
    setSelectedChild(child);
    await loadChildStats(child.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* الرأس */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            مرحباً بك في بورتال الآباء 👋
          </h1>
          <p className="text-gray-600">
            تابع تقدم أبنائك وإنجازاتهم في أكاديمية التايكواندو
          </p>
        </div>

        {/* اختيار الابن */}
        {children.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر الطالب:
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => handleChildSelect(child)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition flex-shrink-0 ${
                    selectedChild?.id === child.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    selectedChild?.id === child.id ? 'bg-blue-600' : 'bg-gray-400'
                  }`}>
                    {child.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">{child.name}</p>
                    <p className="text-xs text-gray-500">{child.currentBelt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* معلومات الطالب المختار */}
        {selectedChild && (
          <>
            {/* البطاقة الشخصية */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">
                      {selectedChild.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedChild.name}
                    </h2>
                    <div className="space-y-1 text-blue-100">
                      <p className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        الحزام الحالي: <span className="font-semibold">{selectedChild.currentBelt}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        المستوى: <span className="font-semibold">{selectedChild.level}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        تاريخ التسجيل: {new Date(selectedChild.enrollmentDate).toLocaleDateString('ar-MA')}
                      </p>
                    </div>
                  </div>
                </div>
                <QrCode className="w-12 h-12 opacity-50" />
              </div>
            </div>

            {/* الإحصائيات */}
            {childStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  icon={<Calendar className="w-8 h-8" />}
                  title="نسبة الحضور"
                  value={`${childStats.attendanceRate}%`}
                  subtitle="هذا الشهر"
                  color="blue"
                />
                <StatCard
                  icon={<TrendingUp className="w-8 h-8" />}
                  title="عدد الحصص"
                  value={childStats.totalAttendance}
                  subtitle="هذا الشهر"
                  color="green"
                />
                <StatCard
                  icon={<Award className="w-8 h-8" />}
                  title="الإنجازات"
                  value="5"
                  subtitle="شارات حصل عليها"
                  color="yellow"
                />
                <StatCard
                  icon={<DollarSign className="w-8 h-8" />}
                  title="آخر دفعة"
                  value={childStats.lastPayment?.amount || '---'}
                  subtitle={childStats.lastPayment?.date || 'لا يوجد'}
                  color="purple"
                />
              </div>
            )}

            {/* الأقسام */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* التقدم والأهداف */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    التقدم والأهداف
                  </h3>
                </div>
                <div className="space-y-4">
                  <ProgressItem
                    title="الحزام التالي"
                    current={selectedChild.currentBelt}
                    target="الحزام الأصفر"
                    progress={65}
                  />
                  <ProgressItem
                    title="الحضور المطلوب"
                    current="18 حصة"
                    target="24 حصة"
                    progress={75}
                  />
                  <ProgressItem
                    title="المهارات المتقنة"
                    current="12 مهارة"
                    target="16 مهارة"
                    progress={75}
                  />
                </div>
              </div>

              {/* الإشعارات الأخيرة */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    الإشعارات الأخيرة
                  </h3>
                </div>
                <div className="space-y-3">
                  <NotificationItem
                    type="success"
                    title="حضور مسجل"
                    message="تم تسجيل حضور اليوم بنجاح"
                    time="منذ ساعتين"
                  />
                  <NotificationItem
                    type="info"
                    title="اختبار قادم"
                    message="اختبار الحزام الأصفر يوم السبت"
                    time="منذ يوم"
                  />
                  <NotificationItem
                    type="warning"
                    title="تذكير الدفع"
                    message="موعد الدفع الشهري قريب"
                    time="منذ 3 أيام"
                  />
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <ActionButton
                icon={<Calendar className="w-6 h-6" />}
                label="سجل الحضور"
                onClick={() => {}}
              />
              <ActionButton
                icon={<DollarSign className="w-6 h-6" />}
                label="الدفعات"
                onClick={() => {}}
              />
              <ActionButton
                icon={<MessageSquare className="w-6 h-6" />}
                label="التواصل"
                onClick={() => {}}
              />
              <ActionButton
                icon={<QrCode className="w-6 h-6" />}
                label="QR Code"
                onClick={() => {}}
              />
            </div>
          </>
        )}

        {children.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              لا يوجد أبناء مسجلين
            </h3>
            <p className="text-gray-600">
              يرجى التواصل مع إدارة النادي لإضافة أبنائك
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// مكونات مساعدة
const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className={`w-14 h-14 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
};

const ProgressItem = ({ title, current, target, progress }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-gray-700">{title}</span>
      <span className="text-sm text-gray-500">{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
    <div className="flex justify-between text-xs text-gray-500">
      <span>{current}</span>
      <span>{target}</span>
    </div>
  </div>
);

const NotificationItem = ({ type, title, message, time }) => {
  const colors = {
    success: 'bg-green-50 border-green-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[type]}`}>
      <div className="flex justify-between items-start mb-1">
        <p className="font-semibold text-sm text-gray-800">{title}</p>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition hover:scale-105"
  >
    <div className="text-blue-600">
      {icon}
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </button>
);

export default ParentPortalView;
