// src/views/QRAttendanceView.js
import React, { useState, useEffect } from 'react';
import QRScanner from '../components/QRScanner';
import { getAttendanceByDate } from '../api/attendance.api';
import { Users, CheckCircle, Calendar, QrCode, Clock } from 'lucide-react';

const QRAttendanceView = ({ students = [], markAttendance, attendance = [] }) => {
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    lastUpdate: null
  });

  // تحميل حضور اليوم
  const loadTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendanceRecords = await getAttendanceByDate(today);
      
      // إضافة أسماء الطلاب
      const enrichedRecords = attendanceRecords.map(record => {
        const student = students.find(s => s.id === record.studentId);
        return {
          ...record,
          studentName: student?.fullName || 'Unknown Student'
        };
      });
      
      setTodayAttendance(enrichedRecords);
      
      setStats({
        total: enrichedRecords.length,
        present: enrichedRecords.filter(a => a.status === 'present').length,
        lastUpdate: new Date()
      });
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  useEffect(() => {
    loadTodayAttendance();
    
    // تحديث كل 30 ثانية
    const interval = setInterval(loadTodayAttendance, 30000);
    return () => clearInterval(interval);
  }, [students]);

  const handleScanSuccess = (data) => {
    // تحديث القائمة بعد المسح الناجح
    loadTodayAttendance();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* الرأس */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <QrCode className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              QR Code Attendance System
            </h1>
          </div>
          <p className="text-gray-600">
            Quick and secure attendance tracking for students
          </p>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Attendance</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {stats.total}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Present Today</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats.present}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Date</p>
                <p className="text-lg font-bold text-gray-800 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-gray-400 opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* الماسح */}
          <div>
            <QRScanner 
              onScanSuccess={handleScanSuccess}
              onScanError={(error) => console.error('Scan error:', error)}
            />
          </div>

          {/* قائمة الحضور اليوم */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Today's Attendance
              </h3>
              {stats.lastUpdate && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={14} />
                  Updated: {stats.lastUpdate.toLocaleTimeString('en-US')}
                </span>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {todayAttendance.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No attendance recorded yet</p>
                  <p className="text-sm mt-1">Start scanning student QR codes</p>
                </div>
              ) : (
                todayAttendance
                  .sort((a, b) => {
                    // ترتيب حسب الوقت (الأحدث أولاً)
                    return b.time?.localeCompare(a.time) || 0;
                  })
                  .map((record, index) => (
                    <div
                      key={record.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {record.studentName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {record.studentName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {record.time || 'Not specified'}
                            {record.method && ` • ${record.method}`}
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* نصائح */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Tips for Best Use:
          </h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Ensure good lighting when scanning</li>
            <li>• Print QR codes for each student and attach to membership cards</li>
            <li>• Students can save QR codes on their phones</li>
            <li>• System prevents duplicate scans within 3 seconds</li>
            <li>• You can download QR codes from the student profile page</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRAttendanceView;