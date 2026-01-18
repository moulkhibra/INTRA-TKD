import React from 'react';
import { Award, TrendingUp, Users, Calendar } from 'lucide-react';

const ExamsView = ({
    eligibleStudents,
    graduations,
    students,
    beltColors,
    getAge,
    getAgeCategory,
    promoteStudent,
    isEligibleForExam,
    getNextExamDate
}) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Belt Progression Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Ready for Exam</h3>
                        <Award className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">{eligibleStudents.length}</p>
                    <p className="text-blue-100 text-sm mt-1">Students qualified</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Total Graduations</h3>
                        <TrendingUp className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">{graduations.length}</p>
                    <p className="text-purple-100 text-sm mt-1">All-time promotions</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Black Belts</h3>
                        <Award className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">{students.filter(s => s.beltId === 6).length}</p>
                    <p className="text-yellow-100 text-sm mt-1">Achieved mastery</p>
                </div>
            </div>

            {eligibleStudents.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg flex items-center space-x-2">
                            <Award className="text-green-600" size={24} />
                            <span>Students Ready for Belt Exam</span>
                        </h3>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {eligibleStudents.length} Eligible
                        </span>
                    </div>
                    <div className="space-y-3">
                        {eligibleStudents.map(student => {
                            const currentBelt = beltColors.find(b => b.id === student.beltId);
                            const nextBelt = beltColors.find(b => b.id === currentBelt.id + 1);
                            const lastPromotion = new Date(student.lastBeltPromotion);
                            const daysSince = Math.floor((new Date() - lastPromotion) / (1000 * 60 * 60 * 24));
                            const age = getAge(student.dateOfBirth);
                            const ageCategory = getAgeCategory(student.dateOfBirth);

                            return (
                                <div key={student.id} className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <p className="font-bold text-lg">{student.fullName}</p>
                                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{student.gender}</span>
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className="px-3 py-1 rounded-full text-sm font-medium"
                                                    style={{
                                                        backgroundColor: currentBelt?.color || '#ccc',
                                                        color: currentBelt?.id === 6 ? 'white' : 'black',
                                                        border: currentBelt?.id === 1 ? '1px solid #ccc' : 'none'
                                                    }}
                                                >
                                                    {currentBelt?.name || 'Unknown'}
                                                </span>
                                                <span className="text-gray-400">→</span>
                                                <span
                                                    className="px-3 py-1 rounded-full text-sm font-medium"
                                                    style={{
                                                        backgroundColor: nextBelt?.color || '#ccc',
                                                        color: nextBelt?.id === 6 ? 'white' : 'black',
                                                        border: nextBelt?.id === 1 ? '1px solid #ccc' : 'none'
                                                    }}
                                                >
                                                    {nextBelt?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>{age} years ({ageCategory})</span>
                                            <span>•</span>
                                            <span>Last promotion: {daysSince} days ago</span>
                                            <span>•</span>
                                            <span className="text-green-700 font-medium">Qualified ✓</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => promoteStudent(student.id)}
                                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2 font-medium shadow-md hover:shadow-lg transition-all ml-4"
                                    >
                                        <Award size={20} />
                                        <span>Promote Now</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                        <Users className="text-blue-600" size={22} />
                        <span>Students by Belt Level</span>
                    </h3>
                    <div className="space-y-4">
                        {beltColors.map(belt => {
                            const studentsWithBelt = students.filter(s => s.beltId === belt.id);
                            const count = studentsWithBelt.length;
                            const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;

                            return (
                                <div key={belt.id}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-8 h-8 rounded-full shadow-md"
                                                style={{
                                                    backgroundColor: belt.color,
                                                    border: belt.id === 1 ? '2px solid #ccc' : 'none'
                                                }}
                                            />
                                            <div>
                                                <p className="font-semibold">{belt.name} Belt</p>
                                                <p className="text-xs text-gray-500">{belt.months === 0 ? 'Starting level' : `${belt.months} months minimum`}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{count}</p>
                                            <p className="text-xs text-gray-500">{percentage}%</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-3 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: belt.color,
                                                opacity: 0.8
                                            }}
                                        />
                                    </div>
                                    {count > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {studentsWithBelt.slice(0, 5).map(student => (
                                                <span key={student.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {student.fullName}
                                                </span>
                                            ))}
                                            {count > 5 && (
                                                <span className="text-xs bg-gray-200 px-2 py-1 rounded font-medium">
                                                    +{count - 5} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                        <Calendar className="text-purple-600" size={22} />
                        <span>Upcoming Eligibility Timeline</span>
                    </h3>
                    <div className="space-y-3">
                        {students
                            .filter(s => !isEligibleForExam(s) && s.beltId < 6)
                            .map(student => {
                                const nextExam = getNextExamDate(student);
                                const currentBelt = beltColors.find(b => b.id === student.beltId);
                                const nextBelt = beltColors.find(b => b.id === currentBelt.id + 1);
                                const daysUntil = nextExam ? Math.ceil((nextExam - new Date()) / (1000 * 60 * 60 * 24)) : null;

                                return nextExam && daysUntil > 0 ? (
                                    <div key={student.id} className="p-3 border rounded-lg hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{student.fullName}</p>
                                                <p className="text-sm text-gray-600">{currentBelt?.name || 'Unknown'} → {nextBelt?.name || 'Unknown'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-purple-600">{daysUntil} days</p>
                                                <p className="text-xs text-gray-500">{nextExam.toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-purple-600 h-1.5 rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min(100, Math.max(0, 100 - (daysUntil / (nextBelt?.months - currentBelt?.months || 1) / 30 * 100)))}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : null;
                            })
                            .slice(0, 8)}
                        {students.filter(s => !isEligibleForExam(s) && s.beltId < 6).length === 0 && (
                            <p className="text-gray-500 text-center py-8">All students are either eligible for exam or at maximum rank</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                        <TrendingUp className="text-green-600" size={22} />
                        <span>Graduation History</span>
                    </h3>
                    {graduations.length > 0 ? (
                        <div className="space-y-2">
                            {graduations.slice(-20).reverse().map(grad => {
                                const student = students.find(s => s.id === grad.studentId);
                                const fromBelt = beltColors.find(b => b.name === grad.fromBelt);
                                const toBelt = beltColors.find(b => b.name === grad.toBelt);

                                return (
                                    <div key={grad.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-6 h-6 rounded-full"
                                                    style={{
                                                        backgroundColor: fromBelt?.color || '#ccc',
                                                        border: fromBelt?.id === 1 ? '1px solid #ccc' : 'none'
                                                    }}
                                                />
                                                <span className="text-gray-400">→</span>
                                                <div
                                                    className="w-6 h-6 rounded-full"
                                                    style={{
                                                        backgroundColor: toBelt?.color || '#ccc',
                                                        border: toBelt?.id === 1 ? '1px solid #ccc' : 'none'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{student?.fullName || 'Unknown Student'}</p>
                                                <p className="text-sm text-gray-600">{grad.fromBelt} Belt → {grad.toBelt} Belt</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{new Date(grad.date).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-500">
                                                {Math.floor((new Date() - new Date(grad.date)) / (1000 * 60 * 60 * 24))} days ago
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Award className="mx-auto text-gray-300 mb-3" size={48} />
                            <p className="text-gray-500">No graduations recorded yet</p>
                            <p className="text-sm text-gray-400 mt-1">Promotions will appear here as students advance</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamsView;
