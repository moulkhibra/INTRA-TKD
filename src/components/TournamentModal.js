import React, { useState } from 'react';
import { Trophy, X } from 'lucide-react';

const TournamentModal = ({ students, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        tournamentName: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        weightCategory: '',
        medal: 'Gold',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // Validation
        if (!formData.studentId) {
            setError('⚠️ Please select a student');
            return;
        }
        if (!formData.tournamentName) {
            setError('⚠️ Please enter tournament name');
            return;
        }
        if (!formData.location) {
            setError('⚠️ Please enter location');
            return;
        }
        if (!formData.category) {
            setError('⚠️ Please select age category');
            return;
        }
        if (!formData.weightCategory) {
            setError('⚠️ Please enter weight category');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Prepare data with proper types
            const tournamentData = {
                studentId: formData.studentId, // Keep as string (Firestore doc ID)
                tournamentName: formData.tournamentName.trim(),
                location: formData.location.trim(),
                date: formData.date,
                category: formData.category,
                weightCategory: formData.weightCategory.trim(),
                medal: formData.medal,
                notes: formData.notes.trim(),
                createdAt: new Date().toISOString()
            };

            console.log('📤 Submitting tournament data:', tournamentData);

            // Call the save function
            await onSave(tournamentData);
            
            console.log('✅ Tournament saved successfully!');
            
            // Close modal on success
            onClose();
        } catch (err) {
            console.error('❌ Error saving tournament:', err);
            setError(`Failed to save: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center space-x-2">
                        <Trophy className="text-yellow-600" size={24} />
                        <span>Add Tournament Result</span>
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Student *</label>
                        <select
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            disabled={loading}
                        >
                            <option value="">Select student...</option>
                            {students.map(student => {
                                const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
                                return (
                                    <option key={student.id} value={student.id}>
                                        {student.fullName} - {student.gender} - {age} years
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tournament Name *</label>
                            <input
                                type="text"
                                value={formData.tournamentName}
                                onChange={(e) => setFormData({ ...formData, tournamentName: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                placeholder="e.g., National Championships"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Location *</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                placeholder="e.g., Casablanca"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Date *</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Age Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                disabled={loading}
                            >
                                <option value="">Select category...</option>
                                <option value="Kids (≤11)">Kids (≤11)</option>
                                <option value="Cadets (12-14)">Cadets (12-14)</option>
                                <option value="Juniors (15-17)">Juniors (15-17)</option>
                                <option value="Seniors (18+)">Seniors (18+/Olympic)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Weight Category *</label>
                            <input
                                type="text"
                                value={formData.weightCategory}
                                onChange={(e) => setFormData({ ...formData, weightCategory: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                placeholder="e.g., -68kg, +80kg"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Medal/Result *</label>
                        <div className="grid grid-cols-4 gap-3">
                            {['Gold', 'Silver', 'Bronze', 'Participation'].map(medal => (
                                <button
                                    key={medal}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, medal })}
                                    disabled={loading}
                                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                                        formData.medal === medal
                                            ? medal === 'Gold' ? 'border-yellow-500 bg-yellow-50' :
                                              medal === 'Silver' ? 'border-gray-400 bg-gray-50' :
                                              medal === 'Bronze' ? 'border-orange-500 bg-orange-50' :
                                              'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">
                                        {medal === 'Gold' && '🥇'}
                                        {medal === 'Silver' && '🥈'}
                                        {medal === 'Bronze' && '🥉'}
                                        {medal === 'Participation' && '🎖️'}
                                    </div>
                                    <div className="text-xs font-medium">{medal}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full border rounded px-3 py-2 h-20"
                            placeholder="Any additional notes about the performance..."
                            disabled={loading}
                        />
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 flex items-center justify-center space-x-2 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <Trophy size={18} />
                            <span>{loading ? 'Saving...' : 'Save Result'}</span>
                        </button>
                        <button
                            onClick={onClose}
                            disabled={loading}
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

export default TournamentModal;