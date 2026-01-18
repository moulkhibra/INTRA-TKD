import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

const PaymentForm = ({ students, onAddPayment }) => {
    const [selectedStudent, setSelectedStudent] = useState('');
    const [amount, setAmount] = useState('100');

    const handleSubmit = () => {
        if (selectedStudent && amount) {
            onAddPayment(parseInt(selectedStudent), parseFloat(amount));
            setSelectedStudent('100');
            setAmount('100');
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Select Student</label>
                <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="">Choose a student...</option>
                    {students.map(student => (
                        <option key={student.id} value={student.id}>{student.fullName}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Amount ($)</label>
                <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center space-x-2"
            >
                <DollarSign size={18} />
                <span>Record Payment</span>
            </button>
        </div>
    );
};

export default PaymentForm;
