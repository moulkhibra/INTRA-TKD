// src/views/StudentPortalView.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Award,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Star,
  QrCode,
  Flame
} from 'lucide-react';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { getStudentAttendance } from '../api/attendance.api';

const StudentPortalView = ({ student }) => {
  const [showQR, setShowQR] = useState(false);
  const [stats, setStats] = useState({
    attendanceStreak: 0,
    totalClasses: 0,
    achievements: [],
    nextBelt: ''
  });

  const loadStudentStats = useCallback(async () => {
    try {
      const attendance = await getStudentAttendance(student.id);
      
      // حساب الحضور المتتالي
      const sortedAttendance = attendance.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      let streak = 0;
      for (const record of sortedAttendance) {
        if (record.status === 'حاضر') {
          streak++;
        } else {
          break;
        }
      }

      setStats({
        attendanceStreak: streak,
        totalClasses: attendance.filter(a => a.status === 'حاضر').length,
        achievements: [
          { id: 1, name: 'مبتدئ متميز', icon: '🌟', date: '2025-01-01' },
          { id: 2, name: 'حضور منتظم', icon: '📅', date: '2025-01-05' },
          { id: 3, name: 'روح رياضية', icon: '🤝', date: '2025-01-10' }
        ],
        nextBelt: 'الحزام الأصفر'
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [student.id]);

  useEffect(() => {
    loadStudentStats();
  }, [student.id, loadStudentStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* رأس البطل */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-5xl font-bold text-orange-600">
                    {student.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {student.name}
                  </h1>
                  <div className="flex items-center gap-4 text-orange-100">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <span className="font-semibold">{student.currentBelt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>المستوى {student.level}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowQR(true)}
                className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition shadow-lg flex items-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                QR Code
              </button>
            </div>

            {/* شريط التقدم */}
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">التقدم نحو {stats.nextBelt}</span>
                <span className="text-sm">65%</span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                <div className="bg-white h-3 rounded-full transition-all" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MiniStatCard
            icon={<Flame className="w-8 h-8 text-orange-500" />}
            value={stats.attendanceStreak}
            label="أيام متتالية"
            color="orange"
          />
          <MiniStatCard
            icon={<Calendar className="w-8 h-8 text-blue-500" />}
            value={stats.totalClasses}
            label="إجمالي الحصص"
            color="blue"
          />
          <MiniStatCard
            icon={<Trophy className="w-8 h-8 text-yellow-500" />}
            value={stats.achievements.length}
            label="الإنجازات"
            color="yellow"
          />
          <MiniStatCard
            icon={<Star className="w-8 h-8 text-purple-500" />}
            value="85"
            label="نقاط الخبرة"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* الإنجازات */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-800">
                إنجازاتي 🏆
              </h2>
            </div>
            
            <div className="space-y-3">
              {stats.achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:shadow-md transition"
                >
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{achievement.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(achievement.date).toLocaleDateString('ar-MA')}
                    </p>
                  </div>
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold rounded-xl hover:shadow-lg transition">
              عرض جميع الإنجازات
            </button>
          </div>

          {/* المهارات والأهداف */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">
                أهدافي 🎯
              </h2>
            </div>

            <div className="space-y-4">
              <GoalCard
                title="إتقان الركلة الأمامية"
                progress={90}
                color="green"
              />
              <GoalCard
                title="حفظ البومسيه الأول"
                progress={70}
                color="blue"
              />
              <GoalCard
                title="تحسين المرونة"
                progress={50}
                color="purple"
              />
              <GoalCard
                title="التحضير للاختبار"
                progress={85}
                color="orange"
              />
            </div>
          </div>
        </div>

        {/* التحديات اليومية */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">
              تحديات اليوم 🔥
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ChallengeCard
              emoji="💪"
              title="20 ضغط"
              status="مكتمل"
              completed={true}
            />
            <ChallengeCard
              emoji="🥋"
              title="ممارسة 30 دقيقة"
              status="جاري..."
              completed={false}
            />
            <ChallengeCard
              emoji="📚"
              title="مراجعة الحركات"
              status="غير مكتمل"
              completed={false}
            />
          </div>
        </div>

        {/* رسالة تحفيزية */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white text-center">
          <p className="text-2xl font-bold mb-2">
            "النجاح ليس نهاية، الفشل ليس قاتلاً، الشجاعة للاستمرار هي التي تهم" 💫
          </p>
          <p className="text-blue-100">- ونستون تشرشل</p>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">QR Code الخاص بي</h3>
                <button
                  onClick={() => setShowQR(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <QRCodeGenerator student={student} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// مكونات مساعدة
const MiniStatCard = ({ icon, value, label, color }) => {
  const colors = {
    orange: 'bg-orange-50',
    blue: 'bg-blue-50',
    yellow: 'bg-yellow-50',
    purple: 'bg-purple-50'
  };

  return (
    <div className={`${colors[color]} rounded-xl shadow-md p-4 hover:shadow-lg transition`}>
      <div className="flex flex-col items-center text-center">
        {icon}
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
      </div>
    </div>
  );
};

const GoalCard = ({ title, progress, color }) => {
  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">{title}</span>
        <span className="text-sm font-semibold text-gray-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${colors[color]} h-2.5 rounded-full transition-all`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const ChallengeCard = ({ emoji, title, status, completed }) => (
  <div className={`p-4 rounded-xl border-2 transition hover:shadow-md ${
    completed 
      ? 'bg-green-50 border-green-300' 
      : 'bg-gray-50 border-gray-200'
  }`}>
    <div className="text-4xl mb-2 text-center">{emoji}</div>
    <p className="font-semibold text-gray-800 text-center mb-1">{title}</p>
    <p className={`text-sm text-center ${
      completed ? 'text-green-600 font-semibold' : 'text-gray-500'
    }`}>
      {status}
    </p>
  </div>
);

export default StudentPortalView;