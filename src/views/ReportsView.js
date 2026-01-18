import React from 'react';
import { DollarSign, Download, Calendar, Award, FileText, TrendingUp, Users, PieChart, Activity } from 'lucide-react';

const ReportsView = ({
    generateReport,
    beltColors,
    students,
    unpaidStudents,
    totalRevenue,
    getAttendanceStats,
    graduations,
    payments
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reports & Analytics</h2>
                    <p className="text-gray-500 mt-1">Get detailed insights and download club performance data</p>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <Activity className="text-blue-500" size={18} />
                    <span className="text-sm font-medium text-gray-700">Live Data Sync</span>
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
            </div>

            {/* Main Report Download Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        id: 'financial',
                        title: 'Financial Insight',
                        desc: 'Revenue & payments',
                        icon: DollarSign,
                        gradient: 'from-emerald-500 to-teal-600',
                        shadow: 'shadow-emerald-200'
                    },
                    {
                        id: 'attendance',
                        title: 'Attendance Flow',
                        desc: 'Tracking & trends',
                        icon: Calendar,
                        gradient: 'from-blue-500 to-indigo-600',
                        shadow: 'shadow-blue-200'
                    },
                    {
                        id: 'belt',
                        title: 'Belt Progression',
                        desc: 'Rank distributions',
                        icon: Award,
                        gradient: 'from-amber-400 to-orange-500',
                        shadow: 'shadow-amber-200'
                    },
                    {
                        id: 'comprehensive',
                        title: 'Master Overview',
                        desc: 'All-in-one metrics',
                        icon: FileText,
                        gradient: 'from-purple-500 to-pink-600',
                        shadow: 'shadow-purple-200'
                    }
                ].map((report) => (
                    <div
                        key={report.id}
                        className={`group relative overflow-hidden bg-gradient-to-br ${report.gradient} p-6 rounded-2xl shadow-lg ${report.shadow} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer`}
                        onClick={() => generateReport(report.id)}
                    >
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="bg-white/20 p-2.5 w-fit rounded-xl backdrop-blur-sm mb-4">
                                <report.icon className="text-white" size={24} />
                            </div>
                            <h3 className="text-white font-bold text-lg leading-tight">{report.title}</h3>
                            <p className="text-white/80 text-xs mt-1 mb-6 font-medium">{report.desc}</p>
                            <div className="flex items-center text-white text-sm font-bold bg-white/20 w-fit px-3 py-1.5 rounded-lg group-hover:bg-white group-hover:text-gray-900 transition-colors">
                                <Download size={16} className="mr-2" />
                                <span>Export PDF</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Analytics Section with Glassmorphism */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <PieChart className="text-blue-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Performance Metrics Overview</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Belt Distribution */}
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold text-gray-800 flex items-center">
                                    <Users className="mr-2 text-indigo-500" size={18} />
                                    Belt Distribution
                                </h4>
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">
                                    {students.length} Total
                                </span>
                            </div>
                            <div className="space-y-4">
                                {beltColors.map(belt => {
                                    const count = students.filter(s => s.beltId === belt.id).length;
                                    const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                                    return (
                                        <div key={belt.id} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                                                <span className="flex items-center">
                                                    <div
                                                        className="w-2.5 h-2.5 rounded-full mr-2 shadow-sm"
                                                        style={{
                                                            backgroundColor: belt.color,
                                                            border: belt.id === 1 ? '1px solid #e5e7eb' : 'none'
                                                        }}
                                                    />
                                                    {belt.name}
                                                </span>
                                                <span className="text-gray-900">{count} students</span>
                                            </div>
                                            <div className="w-full bg-gray-200/50 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: belt.color,
                                                        opacity: 0.9
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold text-gray-800 flex items-center">
                                    <DollarSign className="mr-2 text-emerald-500" size={18} />
                                    Collection Status
                                </h4>
                                <TrendingUp className="text-emerald-500" size={20} />
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                                        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Collected</p>
                                        <p className="text-2xl font-black text-emerald-600">${totalRevenue}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                                        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Unpaid</p>
                                        <p className="text-2xl font-black text-rose-500">${unpaidStudents.length * 100}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-gray-600">Monthly Target Met</span>
                                        <span className="text-emerald-600">
                                            {students.length > 0 ? Math.round(((students.length - unpaidStudents.length) / students.length) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200/50 h-4 rounded-full overflow-hidden p-1 shadow-inner">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 bg-emerald-500"
                                            style={{
                                                width: `${students.length > 0 ? Math.round(((students.length - unpaidStudents.length) / students.length) * 100) : 0}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Insights */}
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold text-gray-800 flex items-center">
                                    <Activity className="mr-2 text-blue-500" size={18} />
                                    Active Engagement
                                </h4>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">Last 30 Days</span>
                            </div>
                            <div className="space-y-4">
                                {students.length > 0 && (
                                    <>
                                        {[
                                            { label: 'High (80%+)', color: 'bg-green-500', value: students.filter(s => Math.round((getAttendanceStats(s.id, 30) / 30) * 100) >= 80).length },
                                            {
                                                label: 'Normal (60-79%)', color: 'bg-blue-500', value: students.filter(s => {
                                                    const pct = Math.round((getAttendanceStats(s.id, 30) / 30) * 100);
                                                    return pct >= 60 && pct < 80;
                                                }).length
                                            },
                                            { label: 'Low (<60%)', color: 'bg-rose-500', value: students.filter(s => Math.round((getAttendanceStats(s.id, 30) / 30) * 100) < 60).length }
                                        ].map((stat, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`} />
                                                    <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                                                </div>
                                                <span className="text-sm font-black text-gray-900">{stat.value}</span>
                                            </div>
                                        ))}

                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Avg. Session Attendance</p>
                                                    <p className="text-2xl font-black text-gray-900 underline decoration-blue-500 decoration-4 underline-offset-4">
                                                        {Math.round(students.reduce((sum, s) => sum + getAttendanceStats(s.id, 30), 0) / students.length)} days
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lower Activity Lists */}
                    <div className="border-t border-gray-100 pt-8 mt-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <TrendingUp size={20} className="mr-2 text-gray-400" />
                            Recent Activity Snapshot
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Latest Graduations */}
                            <div className="space-y-3">
                                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest pl-1">Promotions Timeline</p>
                                <div className="space-y-2">
                                    {graduations.slice(-4).reverse().map(grad => {
                                        const student = students.find(s => s.id === grad.studentId);
                                        return (
                                            <div key={grad.id} className="group flex items-center justify-between p-4 bg-indigo-50/50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-2xl transition-all duration-200">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm font-bold text-indigo-600">
                                                        {student?.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{student?.fullName}</p>
                                                        <p className="text-[10px] font-bold text-indigo-500 uppercase">{grad.fromBelt} → {grad.toBelt}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100">
                                                    {new Date(grad.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {graduations.length === 0 && (
                                        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm italic font-medium">No graduations yet</div>
                                    )}
                                </div>
                            </div>

                            {/* Latest Payments */}
                            <div className="space-y-3">
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest pl-1">Recent Collections</p>
                                <div className="space-y-2">
                                    {payments.slice(-4).reverse().map(payment => {
                                        const student = students.find(s => s.id === payment.studentId);
                                        return (
                                            <div key={payment.id} className="group flex items-center justify-between p-4 bg-emerald-50/50 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 rounded-2xl transition-all duration-200">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-600">
                                                        <DollarSign size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{student?.fullName}</p>
                                                        <p className="text-[10px] font-black text-emerald-600 uppercase">Paid for {payment.month}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-black text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-sm border border-emerald-50">
                                                    ${payment.amount}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {payments.length === 0 && (
                                        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm italic font-medium">No payments yet</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
