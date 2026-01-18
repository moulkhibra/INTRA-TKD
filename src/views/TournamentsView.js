import React from 'react';
import { Plus, Trophy, Medal, Trash2, Target } from 'lucide-react';
import TournamentModal from '../components/TournamentModal';

const TournamentsView = ({
    setShowTournamentModal,
    tournaments,
    students,
    deleteTournament,
    getStudentMedals,
    getStudentTournaments,
    getAgeCategory,
    showTournamentModal,
    addTournament
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tournament Management</h2>
                <button
                    onClick={() => setShowTournamentModal(true)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-yellow-700"
                >
                    <Plus size={18} />
                    <span>Add Tournament Result</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Total Medals</h3>
                        <Trophy className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">{tournaments.length}</p>
                    <p className="text-yellow-100 text-sm mt-1">Competition results</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Gold Medals</h3>
                        <Medal className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">{tournaments.filter(t => t.medal === 'Gold').length}</p>
                    <p className="text-yellow-100 text-sm mt-1">First place wins</p>
                </div>

                <div className="bg-gradient-to-br from-gray-400 to-gray-500 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Silver Medals</h3>
                        <Medal className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">{tournaments.filter(t => t.medal === 'Silver').length}</p>
                    <p className="text-gray-100 text-sm mt-1">Second place</p>
                </div>

                <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Bronze Medals</h3>
                        <Medal className="opacity-80" size={32} />
                    </div>
                    <p className="text-4xl font-bold">{tournaments.filter(t => t.medal === 'Bronze').length}</p>
                    <p className="text-orange-100 text-sm mt-1">Third place</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                        <Trophy className="text-yellow-600" size={22} />
                        <span>Recent Tournament Results</span>
                    </h3>
                    <div className="space-y-3">
                        {tournaments.length > 0 ? (
                            tournaments.slice(-15).reverse().map(tournament => {
                                const student = students.find(s => s.id === tournament.studentId);
                                const medalColors = {
                                    Gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                                    Silver: 'bg-gray-100 text-gray-800 border-gray-300',
                                    Bronze: 'bg-orange-100 text-orange-800 border-orange-300',
                                    Participation: 'bg-blue-100 text-blue-800 border-blue-300'
                                };

                                return (
                                    <div key={tournament.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <p className="font-bold text-lg">{student?.fullName || 'Unknown'}</p>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${medalColors[tournament.medal]}`}>
                                                        {tournament.medal === 'Gold' && '🥇'}
                                                        {tournament.medal === 'Silver' && '🥈'}
                                                        {tournament.medal === 'Bronze' && '🥉'}
                                                        {tournament.medal === 'Participation' && '🎖️'}
                                                        {' '}{tournament.medal}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <p><strong>Tournament:</strong> {tournament.tournamentName}</p>
                                                    <p><strong>Location:</strong> {tournament.location}</p>
                                                    <p><strong>Date:</strong> {new Date(tournament.date).toLocaleDateString()}</p>
                                                    <p><strong>Category:</strong> {tournament.category} - {tournament.weightCategory}</p>
                                                    {tournament.notes && (
                                                        <p className="text-gray-500 italic">"{tournament.notes}"</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteTournament(tournament.id)}
                                                className="text-red-600 hover:text-red-800 ml-4"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <Trophy className="mx-auto text-gray-300 mb-3" size={64} />
                                <p className="text-gray-500 text-lg font-medium">No tournament results yet</p>
                                <p className="text-sm text-gray-400 mt-1">Add your first competition result to start tracking achievements</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                        <Target className="text-red-600" size={22} />
                        <span>Leaderboard</span>
                    </h3>
                    <div className="space-y-3">
                        {students
                            .map(student => ({
                                ...student,
                                medals: getStudentMedals(student.id)
                            }))
                            .filter(s => s.medals.total > 0)
                            .sort((a, b) => {
                                if (b.medals.gold !== a.medals.gold) return b.medals.gold - a.medals.gold;
                                if (b.medals.silver !== a.medals.silver) return b.medals.silver - a.medals.silver;
                                return b.medals.bronze - a.medals.bronze;
                            })
                            .slice(0, 10)
                            .map((student, index) => (
                                <div key={student.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                            index === 2 ? 'bg-orange-600' :
                                                'bg-blue-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{student.fullName}</p>
                                        <div className="flex space-x-2 text-xs">
                                            {student.medals.gold > 0 && (
                                                <span className="text-yellow-600">🥇 {student.medals.gold}</span>
                                            )}
                                            {student.medals.silver > 0 && (
                                                <span className="text-gray-600">🥈 {student.medals.silver}</span>
                                            )}
                                            {student.medals.bronze > 0 && (
                                                <span className="text-orange-600">🥉 {student.medals.bronze}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{student.medals.total}</span>
                                </div>
                            ))}
                        {students.filter(s => getStudentMedals(s.id).total > 0).length === 0 && (
                            <p className="text-gray-500 text-center py-8 text-sm">No medal winners yet</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">Student Tournament History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Medals</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Competition</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Best Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {students.map(student => {
                                const medals = getStudentMedals(student.id);
                                const studentTournaments = getStudentTournaments(student.id);
                                const lastTournament = studentTournaments[studentTournaments.length - 1];
                                const bestMedal = medals.gold > 0 ? 'Gold' : medals.silver > 0 ? 'Silver' : medals.bronze > 0 ? 'Bronze' : 'N/A';

                                return (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{student.fullName}</p>
                                                <p className="text-xs text-gray-500">{getAgeCategory(student.dateOfBirth)}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {medals.total > 0 ? (
                                                <div className="flex space-x-2 text-sm">
                                                    {medals.gold > 0 && <span className="text-yellow-600">🥇 {medals.gold}</span>}
                                                    {medals.silver > 0 && <span className="text-gray-600">🥈 {medals.silver}</span>}
                                                    {medals.bronze > 0 && <span className="text-orange-600">🥉 {medals.bronze}</span>}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No medals</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {lastTournament ? (
                                                <div>
                                                    <p className="font-medium">{lastTournament.tournamentName}</p>
                                                    <p className="text-xs text-gray-500">{new Date(lastTournament.date).toLocaleDateString()}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {bestMedal !== 'N/A' ? (
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${bestMedal === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                                    bestMedal === 'Silver' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {bestMedal}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showTournamentModal && (
                <TournamentModal
                    students={students}
                    onSave={addTournament}
                    onClose={() => setShowTournamentModal(false)}
                />
            )}
        </div>
    );
};

export default TournamentsView;
