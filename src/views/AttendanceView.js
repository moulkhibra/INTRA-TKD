import React from 'react';
import { Check, X } from 'lucide-react';

const AttendanceView = ({
    selectedDate,
    setSelectedDate,
    students,
    beltColors,
    getAttendanceForDate,
    markAttendance,
    getAttendanceStats,
    attendance
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Attendance Tracking</h2>
                <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium">Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="p-6">
                    <h3 className="font-bold text-lg mb-4">Mark Attendance - {new Date(selectedDate).toLocaleDateString()}</h3>
                    <div className="space-y-2">
                        {students.map(student => {
                            const belt = beltColors.find(b => b.id === student.beltId);
                            const status = getAttendanceForDate(student.id, selectedDate);

                            return (
                                <div key={student.id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <p className="font-medium">{student.fullName}</p>
                                            <span
                                                className="text-xs px-2 py-1 rounded"
                                                style={{
                                                    backgroundColor: belt?.color || '#ccc',
                                                    color: belt?.id === 6 ? 'white' : 'black',
                                                    border: belt?.id === 1 ? '1px solid #ccc' : 'none'
                                                }}
                                            >
                                                {belt?.name || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => markAttendance(student.id, selectedDate, 'present')}
                                            className={`px-4 py-2 rounded flex items-center space-x-2 ${status === 'present'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                                                }`}
                                        >
                                            <Check size={18} />
                                            <span>Present</span>
                                        </button>
                                        <button
                                            onClick={() => markAttendance(student.id, selectedDate, 'absent')}
                                            className={`px-4 py-2 rounded flex items-center space-x-2 ${status === 'absent'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                                                }`}
                                        >
                                            <X size={18} />
                                            <span>Absent</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4">Attendance Statistics (Last 30 Days)</h3>
                    <div className="space-y-3">
                        {students.map(student => {
                            const count = getAttendanceStats(student.id, 30);
                            const percentage = Math.round((count / 30) * 100);

                            return (
                                <div key={student.id} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{student.fullName}</span>
                                        <span className="text-gray-600">{count} days ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${percentage >= 80 ? 'bg-green-600' :
                                                percentage >= 60 ? 'bg-yellow-500' :
                                                    'bg-red-600'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4">Recent Attendance</h3>
                    <div className="space-y-2">
                        {attendance.slice(-10).reverse().map(record => {
                            const student = students.find(s => s.id === record.studentId);
                            return (
                                <div key={record.id} className="flex justify-between items-center p-3 border rounded">
                                    <div>
                                        <p className="font-medium">{student?.fullName || 'Unknown'}</p>
                                        <p className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-sm font-medium ${record.status === 'present'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {record.status === 'present' ? 'Present' : 'Absent'}
                                    </span>
                                </div>
                            );
                        })}
                        {attendance.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No attendance records yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceView;
