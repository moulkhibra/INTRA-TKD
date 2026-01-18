import React, { useState } from 'react';
import { Users, Send, X } from 'lucide-react';

const MessageModal = ({ data, students, unpaidStudents, eligibleStudents, onSend, onClose }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const getDefaultTemplate = () => {
        switch (data.type) {
            case 'unpaid':
                return {
                    subject: 'Payment Reminder - Taekwondo Club',
                    message: `Dear Parent/Guardian,

This is a friendly reminder that payment for this month's training is still pending.

Student: [Student Name]
Amount: $50
Due Date: [Current Month]

Please contact us if you have any questions.

Best regards,
TKD Club Management`
                };
            case 'eligible':
                return {
                    subject: 'Belt Exam Eligibility Notification',
                    message: `Dear Parent/Guardian,

Great news! Your child is now eligible for their next belt examination.

Student: [Student Name]
Current Belt: [Current Belt]
Next Belt: [Next Belt]

Please confirm their participation in the upcoming exam.

Best regards,
TKD Club Management`
                };
            case 'low-attendance':
                return {
                    subject: 'Attendance Check-In',
                    message: `Dear Parent/Guardian,

We've noticed that [Student Name] hasn't been attending classes regularly over the past month.

We'd love to see them back in training! If there are any concerns or issues we can help with, please let us know.

Best regards,
TKD Club Management`
                };
            case 'all':
                return {
                    subject: 'Club Announcement',
                    message: `Dear Parents and Students,

[Your announcement here]

Best regards,
TKD Club Management`
                };
            case 'individual':
                return {
                    subject: 'Message from TKD Club',
                    message: `Dear ${data.student?.fullName}'s Parent/Guardian,

[Your message here]

Best regards,
TKD Club Management`
                };
            default:
                return { subject: '', message: '' };
        }
    };

    useState(() => {
        const template = getDefaultTemplate();
        setSubject(template.subject);
        setMessage(template.message);
    }, []);

    const handleSend = () => {
        if (subject && message) {
            if (data.type === 'individual') {
                onSend({
                    category: 'individual',
                    subject,
                    message,
                    recipients: [data.student.id]
                });
            } else {
                onSend({
                    category: data.type,
                    subject,
                    message
                });
            }
            onClose();
        }
    };

    const getRecipientInfo = () => {
        if (data.type === 'individual') {
            return {
                title: 'Send Individual Message',
                count: 1,
                recipients: [data.student?.fullName]
            };
        }

        let recipients = [];
        switch (data.type) {
            case 'unpaid':
                recipients = unpaidStudents.map(s => s.fullName);
                break;
            case 'eligible':
                recipients = eligibleStudents.map(s => s.fullName);
                break;
            case 'low-attendance':
                recipients = students.filter(s => Math.round((s.id) / 30 * 100) < 60).map(s => s.fullName);
                break;
            case 'all':
                recipients = students.map(s => s.fullName);
                break;
            default:
                recipients = [];
                break;
        }

        return {
            title: 'Send Bulk Message',
            count: data.count,
            recipients: recipients.slice(0, 5)
        };
    };

    const recipientInfo = getRecipientInfo();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{recipientInfo.title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <Users className="text-blue-600" size={20} />
                        <span className="font-semibold text-blue-900">Recipients: {recipientInfo.count}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recipientInfo.recipients.map((name, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {name}
                            </span>
                        ))}
                        {recipientInfo.count > 5 && (
                            <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded font-medium">
                                +{recipientInfo.count - 5} more
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Message subject"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border rounded px-3 py-2 h-48"
                            placeholder="Type your message here..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            💡 Tip: Copy this message and send via WhatsApp, SMS, or email to parent contacts
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleSend}
                            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center space-x-2"
                        >
                            <Send size={18} />
                            <span>Save Message Log</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
