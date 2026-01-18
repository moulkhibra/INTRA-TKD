import React from 'react';
import { AlertCircle, Award, Calendar, Send, MessageSquare, Bell } from 'lucide-react';
import MessageTemplate from '../components/MessageTemplate';
import MessageModal from '../components/MessageModal';
import WhatsAppNotifications from '../components/WhatsAppNotifications';

const MessagesView = ({
    unpaidStudents,
    eligibleStudents,
    students,
    getAttendanceStats,
    setShowMessageModal,
    messages,
    getAge,
    getStudentPaymentStatus,
    isEligibleForExam,
    showMessageModal,
    sendBulkMessage
}) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Parent Communication Hub</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Payment Reminders</h3>
                        <AlertCircle className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">{unpaidStudents.length}</p>
                    <p className="text-orange-100 text-sm mt-1">Parents to notify</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Belt Exam Ready</h3>
                        <Award className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">{eligibleStudents.length}</p>
                    <p className="text-blue-100 text-sm mt-1">Good news to share</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Low Attendance</h3>
                        <Calendar className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">
                        {students.filter(s => Math.round((getAttendanceStats(s.id, 30) / 30) * 100) < 60).length}
                    </p>
                    <p className="text-red-100 text-sm mt-1">Need check-in</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                        <Send className="text-blue-600" size={22} />
                        <span>Quick Message Templates</span>
                    </h3>
                    <div className="space-y-3">
                        <MessageTemplate
                            title="Payment Reminder"
                            description={`Send to ${unpaidStudents.length} students with outstanding payments`}
                            color="orange"
                            onClick={() => setShowMessageModal({ type: 'unpaid', count: unpaidStudents.length })}
                            count={unpaidStudents.length}
                        />

                        <MessageTemplate
                            title="Belt Exam Notification"
                            description={`Notify ${eligibleStudents.length} students ready for promotion`}
                            color="green"
                            onClick={() => setShowMessageModal({ type: 'eligible', count: eligibleStudents.length })}
                            count={eligibleStudents.length}
                        />

                        <MessageTemplate
                            title="Attendance Alert"
                            description={`Check-in with ${students.filter(s => Math.round((getAttendanceStats(s.id, 30) / 30) * 100) < 60).length} students with low attendance`}
                            color="red"
                            onClick={() => setShowMessageModal({
                                type: 'low-attendance',
                                count: students.filter(s => Math.round((getAttendanceStats(s.id, 30) / 30) * 100) < 60).length
                            })}
                            count={students.filter(s => Math.round((getAttendanceStats(s.id, 30) / 30) * 100) < 60).length}
                        />

                        <MessageTemplate
                            title="General Announcement"
                            description={`Send to all ${students.length} students/parents`}
                            color="blue"
                            onClick={() => setShowMessageModal({ type: 'all', count: students.length })}
                            count={students.length}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                        <MessageSquare className="text-purple-600" size={22} />
                        <span>Message History</span>
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {messages.length > 0 ? (
                            messages.slice(-20).reverse().map(msg => {
                                const student = students.find(s => s.id === msg.studentId);
                                return (
                                    <div key={msg.id} className="p-3 border rounded-lg hover:bg-gray-50">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-medium text-sm">{student?.fullName || 'Unknown'}</p>
                                            <span className="text-xs text-gray-500">
                                                {new Date(msg.sentAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">{msg.subject}</p>
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{msg.message}</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded ${msg.category === 'unpaid' ? 'bg-orange-100 text-orange-800' :
                                                msg.category === 'eligible' ? 'bg-green-100 text-green-800' :
                                                    msg.category === 'low-attendance' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {msg.category === 'unpaid' ? 'Payment' :
                                                    msg.category === 'eligible' ? 'Belt Exam' :
                                                        msg.category === 'low-attendance' ? 'Attendance' :
                                                            'General'}
                                            </span>
                                            {student?.parentPhone && (
                                                <span className="text-xs text-gray-500">📱 {student.parentPhone}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8">
                                <Bell className="mx-auto text-gray-300 mb-3" size={48} />
                                <p className="text-gray-500">No messages sent yet</p>
                                <p className="text-sm text-gray-400 mt-1">Use quick templates to start communicating</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parent Phone</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {students.map(student => {
                                const age = getAge(student.dateOfBirth);
                                const paid = getStudentPaymentStatus(student.id);
                                const eligible = isEligibleForExam(student);
                                const attendancePct = Math.round((getAttendanceStats(student.id, 30) / 30) * 100);

                                return (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{student.fullName}</div>
                                            <div className="text-xs text-gray-500">{student.gender}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{age} years</td>
                                        <td className="px-4 py-3">
                                            {student.parentPhone ? (
                                                <a href={`tel:${student.parentPhone}`} className="text-blue-600 hover:underline text-sm">
                                                    {student.parentPhone}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not provided</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {!paid && (
                                                    <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">Unpaid</span>
                                                )}
                                                {eligible && (
                                                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Exam Ready</span>
                                                )}
                                                {attendancePct < 60 && (
                                                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">Low Attend.</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setShowMessageModal({ type: 'individual', student })}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Send Message
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showMessageModal && (
                <MessageModal
                    data={showMessageModal}
                    students={students}
                    unpaidStudents={unpaidStudents}
                    eligibleStudents={eligibleStudents}
                    onSend={sendBulkMessage}
                    onClose={() => setShowMessageModal(false)}
                />
            )}

            <WhatsAppNotifications
                students={students}
                unpaidStudents={unpaidStudents}
                eligibleStudents={eligibleStudents}
                getAttendanceStats={getAttendanceStats}
            />
        </div>
    );
};

export default MessagesView;
