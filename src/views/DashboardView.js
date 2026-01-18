import React from 'react';
import { Users, DollarSign, Award, AlertCircle, TrendingUp, TrendingDown, Activity, Trophy } from 'lucide-react';

const DashboardView = ({ students, getAge, unpaidStudents, eligibleStudents, payments = [], attendance = [], graduations = [], tournaments = [] }) => {
  
  // احصائيات الحضور
  const getLast30DaysAttendance = () => {
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAttendance = attendance.filter(a => a.date === dateStr && a.status === 'present').length;
      last30Days.push({
        date: dateStr,
        count: dayAttendance,
        label: date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
      });
    }
    return last30Days;
  };

  // احصائيات الإيرادات
  const getLast6MonthsRevenue = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      const monthRevenue = payments
        .filter(p => p.month === monthStr)
        .reduce((sum, p) => sum + (p.amount || 0), 0);
      
      months.push({
        month: date.toLocaleDateString('en', { month: 'short' }),
        revenue: monthRevenue
      });
    }
    return months;
  };

  // توزيع الأحزمة
  const beltColors = [
    { id: 1, name: 'White', color: '#FFFFFF' },
    { id: 2, name: 'Yellow', color: '#FFD700' },
    { id: 3, name: 'Orange', color: '#FFA500' },
    { id: 4, name: 'Green', color: '#32CD32' },
    { id: 5, name: 'Blue', color: '#1E90FF' },
    { id: 6, name: 'Red', color: '#DC143C' },
    { id: 7, name: 'Black', color: '#000000' }
  ];

  const getBeltDistribution = () => {
    return beltColors.map(belt => ({
      ...belt,
      count: students.filter(s => s.beltId === belt.id).length,
      percentage: students.length > 0 ? Math.round((students.filter(s => s.beltId === belt.id).length / students.length) * 100) : 0
    }));
  };

  // احصائيات الفئات العمرية
  const getAgeDistribution = () => {
    const categories = {
      kids: students.filter(s => getAge(s.dateOfBirth) <= 11).length,
      cadets: students.filter(s => {
        const age = getAge(s.dateOfBirth);
        return age >= 12 && age <= 14;
      }).length,
      juniors: students.filter(s => {
        const age = getAge(s.dateOfBirth);
        return age >= 15 && age <= 17;
      }).length,
      seniors: students.filter(s => getAge(s.dateOfBirth) >= 18).length
    };
    return categories;
  };

  // Top performers
  const getTopPerformers = () => {
    return students.map(student => {
      const studentAttendance = attendance.filter(a => 
        a.studentId === student.id && 
        a.status === 'present' &&
        new Date(a.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;
      
      const studentTournaments = tournaments.filter(t => t.studentId === student.id);
      const medals = {
        gold: studentTournaments.filter(t => t.medal === 'Gold').length,
        silver: studentTournaments.filter(t => t.medal === 'Silver').length,
        bronze: studentTournaments.filter(t => t.medal === 'Bronze').length
      };
      
      const score = studentAttendance * 2 + medals.gold * 10 + medals.silver * 5 + medals.bronze * 3;
      
      return {
        ...student,
        attendanceCount: studentAttendance,
        medals,
        score
      };
    }).sort((a, b) => b.score - a.score).slice(0, 5);
  };

  // حساب الإحصائيات
  const attendanceData = getLast30DaysAttendance();
  const revenueData = getLast6MonthsRevenue();
  const beltDistribution = getBeltDistribution();
  const ageDistribution = getAgeDistribution();
  const topPerformers = getTopPerformers();
  
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const currentMonthRevenue = revenueData[revenueData.length - 1]?.revenue || 0;
  const lastMonthRevenue = revenueData[revenueData.length - 2]?.revenue || 0;
  const revenueChange = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0;
  
  const avgAttendance = attendanceData.length > 0 
    ? Math.round(attendanceData.reduce((sum, d) => sum + d.count, 0) / attendanceData.length)
    : 0;
  
  const maxAttendance = Math.max(...attendanceData.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📊 Dashboard Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Students</p>
              <p className="text-4xl font-bold">{students.length}</p>
            </div>
          </div>
          <div className="flex items-center text-sm opacity-90">
            <div className="flex items-center space-x-2">
              <span>M: {students.filter(s => s.gender === 'Male').length}</span>
              <span>•</span>
              <span>F: {students.filter(s => s.gender === 'Female').length}</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-4xl font-bold">${totalRevenue}</p>
            </div>
          </div>
          <div className="flex items-center text-sm opacity-90">
            {revenueChange >= 0 ? (
              <TrendingUp size={16} className="mr-1" />
            ) : (
              <TrendingDown size={16} className="mr-1" />
            )}
            <span>{revenueChange}% from last month</span>
          </div>
        </div>

        {/* Unpaid */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Unpaid This Month</p>
              <p className="text-4xl font-bold">{unpaidStudents.length}</p>
            </div>
          </div>
          <div className="text-sm opacity-90">
            {students.length > 0 ? Math.round((unpaidStudents.length / students.length) * 100) : 0}% of total students
          </div>
        </div>

        {/* Belt Exams */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Award size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Ready for Exam</p>
              <p className="text-4xl font-bold">{eligibleStudents.length}</p>
            </div>
          </div>
          <div className="text-sm opacity-90">
            Next graduations: {graduations.length}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Activity className="text-blue-600" size={22} />
              <span>Attendance Trend (Last 30 Days)</span>
            </h3>
            <div className="text-sm text-gray-600">
              Avg: {avgAttendance} students/day
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-48 flex items-end space-x-1">
              {attendanceData.slice(-14).map((day, idx) => {
                const height = maxAttendance > 0 ? (day.count / maxAttendance) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer relative group"
                      style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '2px' }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.count} students
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{attendanceData.slice(-14)[0]?.label}</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <TrendingUp className="text-green-600" size={22} />
              <span>Revenue Trend (Last 6 Months)</span>
            </h3>
            <div className="text-sm text-gray-600">
              This month: ${currentMonthRevenue}
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-48 flex items-end space-x-2">
              {revenueData.map((month, idx) => {
                const maxRevenue = Math.max(...revenueData.map(m => m.revenue), 1);
                const height = (month.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-all cursor-pointer relative group"
                      style={{ height: `${height}%`, minHeight: month.revenue > 0 ? '8px' : '2px' }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${month.revenue}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              {revenueData.map((m, idx) => (
                <span key={idx}>{m.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Belt Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Award className="text-yellow-600" size={22} />
            <span>Belt Distribution</span>
          </h3>
          <div className="space-y-3">
            {beltDistribution.map(belt => (
              <div key={belt.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ 
                        backgroundColor: belt.color,
                        borderColor: belt.id === 1 ? '#ccc' : belt.color
                      }}
                    />
                    <span>{belt.name}</span>
                  </span>
                  <span className="text-gray-600">{belt.count} ({belt.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${belt.percentage}%`,
                      backgroundColor: belt.color === '#FFFFFF' ? '#ccc' : belt.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Users className="text-blue-600" size={22} />
            <span>Age Categories</span>
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Kids (≤11)', count: ageDistribution.kids, color: 'bg-pink-500' },
              { name: 'Cadets (12-14)', count: ageDistribution.cadets, color: 'bg-blue-500' },
              { name: 'Juniors (15-17)', count: ageDistribution.juniors, color: 'bg-purple-500' },
              { name: 'Seniors (18+)', count: ageDistribution.seniors, color: 'bg-indigo-500' }
            ].map((category, idx) => {
              const percentage = students.length > 0 ? Math.round((category.count / students.length) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-gray-600">{category.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${category.color} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Trophy className="text-yellow-600" size={22} />
            <span>Top Performers</span>
          </h3>
          <div className="space-y-3">
            {topPerformers.length > 0 ? topPerformers.map((student, idx) => (
              <div key={student.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  idx === 0 ? 'bg-yellow-500' : 
                  idx === 1 ? 'bg-gray-400' : 
                  idx === 2 ? 'bg-orange-600' : 
                  'bg-blue-500'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{student.fullName}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span>{student.attendanceCount} days</span>
                    {student.medals.gold > 0 && <span className="text-yellow-600">🥇{student.medals.gold}</span>}
                    {student.medals.silver > 0 && <span className="text-gray-600">🥈{student.medals.silver}</span>}
                    {student.medals.bronze > 0 && <span className="text-orange-600">🥉{student.medals.bronze}</span>}
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-700">
                  {student.score}
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4">No data available yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {unpaidStudents.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
          <div className="flex">
            <AlertCircle className="text-orange-500 mr-3" size={24} />
            <div>
              <h3 className="font-bold text-orange-800">Payment Reminders</h3>
              <p className="text-orange-700 text-sm">
                {unpaidStudents.length} student(s) haven't paid for this month. Consider sending reminders.
              </p>
            </div>
          </div>
        </div>
      )}

      {eligibleStudents.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex">
            <Award className="text-green-500 mr-3" size={24} />
            <div>
              <h3 className="font-bold text-green-800">Belt Exam Ready</h3>
              <p className="text-green-700 text-sm">
                {eligibleStudents.length} student(s) are ready for their next belt exam. Schedule an exam date soon!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;