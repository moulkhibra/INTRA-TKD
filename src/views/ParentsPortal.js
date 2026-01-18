import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getParentChildren, getParentByEmail } from '../api/parents';
import { getStudentAttendance } from '../api/attendance.api';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, LogOut, Phone, Mail, MapPin, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function ParentsPortal() {
  const { user, logout } = useAuth();
  const [parent, setParent] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParentData = useCallback(async () => {
    if (!user?.email) return;
    
    try {
      // الحصول على بيانات ولي الأمر
      const parentData = await getParentByEmail(user.email);
      setParent(parentData);

      // الحصول على الأبناء
      if (parentData?.id) {
        const childrenData = await getParentChildren(parentData.id);
        setChildren(childrenData);
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0]);
          fetchAttendance(childrenData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching parent data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchParentData();
  }, [user?.email, fetchParentData]);

  const fetchAttendance = async (studentId) => {
    try {
      const data = await getStudentAttendance(studentId);
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const calculateAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, percentage };
  };

  const attendanceData = calculateAttendanceStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">بوابة الأهالي</h1>
            <p className="text-gray-600 mt-1">مرحباً {parent?.name || user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* معلومات ولي الأمر */}
      {parent && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User size={24} className="text-indigo-600" />
            بيانات ولي الأمر
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2">الاسم الكامل:</p>
              <p className="text-lg font-semibold text-gray-800">{parent.name}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <Mail size={16} /> البريد الإلكتروني:
              </p>
              <p className="text-lg font-semibold text-gray-800">{parent.email}</p>
            </div>
            {parent.phone && (
              <div>
                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <Phone size={16} /> رقم الهاتف:
                </p>
                <p className="text-lg font-semibold text-gray-800">{parent.phone}</p>
              </div>
            )}
            {parent.address && (
              <div>
                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> العنوان:
                </p>
                <p className="text-lg font-semibold text-gray-800">{parent.address}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* الأبناء */}
      {children.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">الأبناء</h2>
            <div className="space-y-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    setSelectedChild(child);
                    fetchAttendance(child.id);
                  }}
                  className={`w-full p-3 rounded-lg text-right transition ${
                    selectedChild?.id === child.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <p className="font-semibold">{child.name}</p>
                  <p className="text-sm opacity-75">المستوى: {child.level}</p>
                </button>
              ))}
            </div>
          </div>

          {/* معلومات الابن المختار */}
          {selectedChild && (
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">معلومات {selectedChild.name}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">العمر:</p>
                  <p className="text-xl font-semibold text-blue-600">{selectedChild.age} سنة</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">المستوى:</p>
                  <p className="text-xl font-semibold text-green-600">{selectedChild.level}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">تاريخ التسجيل:</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {new Date(selectedChild.joinDate).toLocaleDateString('ar-IQ')}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">الحالة:</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {selectedChild.status === 'active' ? '✅ نشط' : '❌ معطل'}
                  </p>
                </div>
              </div>

              {/* صورة الابن */}
              {selectedChild.photoURL && (
                <div className="mb-6">
                  <img 
                    src={selectedChild.photoURL} 
                    alt={selectedChild.name}
                    className="w-32 h-32 rounded-lg object-cover border-4 border-indigo-600"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* إحصائيات الحضور */}
      {selectedChild && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* الإحصائيات */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-indigo-600" />
              إحصائيات الحضور
            </h2>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-r-4 border-green-600">
                <p className="text-gray-600 mb-1">مجموع الجلسات:</p>
                <p className="text-3xl font-bold text-green-600">{attendanceData.total}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-r-4 border-blue-600">
                <p className="text-gray-600 mb-1 flex items-center gap-2">
                  <CheckCircle size={16} /> الحضور:
                </p>
                <p className="text-3xl font-bold text-blue-600">{attendanceData.present}</p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border-r-4 border-red-600">
                <p className="text-gray-600 mb-1 flex items-center gap-2">
                  <AlertCircle size={16} /> الغياب:
                </p>
                <p className="text-3xl font-bold text-red-600">{attendanceData.absent}</p>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border-r-4 border-indigo-600">
                <p className="text-gray-600 mb-1">النسبة المئوية:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-300 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${attendanceData.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">{attendanceData.percentage}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* رسم بياني */}
          {attendanceData.total > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">توزيع الحضور</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'حاضر', value: attendanceData.present, color: '#3b82f6' },
                      { name: 'غايب', value: attendanceData.absent, color: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} جلسة`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* رسالة إذا لم يكن هناك أبناء */}
      {children.length === 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-yellow-600 mb-4" />
          <p className="text-gray-700">لم يتم ربط أي طالب بحسابك بعد</p>
          <p className="text-gray-500 mt-2">يرجى التواصل مع إدارة النادي</p>
        </div>
      )}
    </div>
  );
}
