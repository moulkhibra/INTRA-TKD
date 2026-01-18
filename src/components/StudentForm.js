import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const StudentForm = ({ student, beltColors, onSave, onCancel }) => {
    const [formData, setFormData] = useState(student || {
        fullName: '',
        gender: 'Male',
        dateOfBirth: '',
        weight: '',
        parentPhone: '',
        beltId: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // التحقق من البيانات
        if (!formData.fullName || !formData.dateOfBirth || !formData.weight || !formData.gender) {
            setError('Please fill all required fields (*)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSave({
                ...formData,
                weight: parseFloat(formData.weight),
                beltId: parseInt(formData.beltId)
            });
        } catch (err) {
            setError('Failed to save student. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">
                    {student ? 'Edit Student' : 'Add New Student'}
                </h3>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter full name"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Gender *</label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            disabled={loading}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                        <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            disabled={loading}
                        />
                        {formData.dateOfBirth && (
                            <p className="text-xs text-gray-500 mt-1">
                                Age Category: {(() => {
                                    const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
                                    if (age <= 11) return 'Kids (≤11)';
                                    if (age >= 12 && age <= 14) return 'Cadets (12-14)';
                                    if (age >= 15 && age <= 17) return 'Juniors (15-17)';
                                    return 'Seniors (18+) - Olympic Level';
                                })()}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Weight (kg) *</label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter weight"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Parent/Guardian Phone</label>
                        <input
                            type="tel"
                            value={formData.parentPhone}
                            onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            placeholder="+212 XXX-XXXXXX"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">Required for students under 18</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Current Belt</label>
                        <select
                            value={formData.beltId}
                            onChange={(e) => setFormData({ ...formData, beltId: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            disabled={loading}
                        >
                            {beltColors.map(belt => (
                                <option key={belt.id} value={belt.id}>{belt.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Check size={18} />
                            <span>{loading ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 flex items-center justify-center space-x-2"
                        >
                            <X size={18} />
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentForm;
