import React, { useState } from 'react';
import { 
  ArrowLeft, Camera, Edit2, Save, X, Award, Calendar, DollarSign, 
  TrendingUp, Trophy, Activity, FileText, MessageSquare, Phone, User, Target, CheckCircle, XCircle
} from 'lucide-react';

const StudentProfile = ({ 
  student, 
  beltColors, 
  onClose, 
  onUpdate,
  payments = [],
  attendance = [],
  graduations = [],
  tournaments = [],
  getAge,
  getAgeCategory,
  getAttendanceStats
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);
  const [notes, setNotes] = useState(student.notes || '');
  const [activeTab, setActiveTab] = useState('overview');
  const [profileImage, setProfileImage] = useState(student.profileImage || null);

  // Get belt info
  const currentBelt = beltColors.find(b => b.id === editedStudent.beltId) || beltColors[0];

  // Get student data
  const studentPayments = payments.filter(p => p.studentId === student.id);
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentGraduations = graduations.filter(g => g.studentId === student.id);
  const studentTournaments = tournaments.filter(t => t.studentId === student.id);

  // Calculate stats
  const totalPaid = studentPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const attendanceLast30 = getAttendanceStats ? getAttendanceStats(student.id, 30) : 0;
  const attendancePercentage = Math.round((attendanceLast30 / 30) * 100);
  
  const medals = {
    gold: studentTournaments.filter(t => t.medal === 'Gold').length,
    silver: studentTournaments.filter(t => t.medal === 'Silver').length,
    bronze: studentTournaments.filter(t => t.medal === 'Bronze').length,
    total: studentTournaments.length
  };

  // Get last 7 days attendance
  const getLast7DaysAttendance = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const record = studentAttendance.find(a => a.date === dateStr);
      last7Days.push({
        date: dateStr,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        status: record?.status || null
      });
    }
    return last7Days;
  };

  const last7DaysAttendance = getLast7DaysAttendance();

  const handleSave = () => {
    onUpdate(student.id, {
      ...editedStudent,
      notes,
      profileImage
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
    
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700"
>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Save size={18} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedStudent(student);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Edit2 size={18} />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex items-center space-x-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {profileImage ? (
                  <img src={profileImage} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-gray-400" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{student.fullName}</h1>
              <div className="grid grid-cols-2 gap-4 text-red-100">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>{student.gender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{getAge(student.dateOfBirth)} years old</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target size={16} />
                  <span>{getAgeCategory(student.dateOfBirth)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity size={16} />
                  <span>{student.weight} kg</span>
                </div>
              </div>
            </div>

            {/* Current Belt */}
            <div className="text-center">
              <p className="text-sm text-red-100 mb-2">Current Belt</p>
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                style={{
                  backgroundColor: currentBelt.color,
                  color: currentBelt.id === 6 || currentBelt.id === 7 ? 'white' : 'black',
                  border: currentBelt.id === 1 ? '4px solid white' : 'none'
                }}
              >
                {currentBelt.name}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50">
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-blue-600">{attendancePercentage}%</p>
                <p className="text-xs text-gray-500">{attendanceLast30}/30 days</p>
              </div>
              <Activity className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${totalPaid}</p>
                <p className="text-xs text-gray-500">{studentPayments.length} payments</p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medals</p>
                <p className="text-2xl font-bold text-yellow-600">{medals.total}</p>
                <p className="text-xs text-gray-500">
                  🥇{medals.gold} 🥈{medals.silver} 🥉{medals.bronze}
                </p>
              </div>
              <Trophy className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Belt Level</p>
                <p className="text-2xl font-bold text-purple-600">{currentBelt.id}/7</p>
                <p className="text-xs text-gray-500">{studentGraduations.length} promotions</p>
              </div>
              <Award className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex space-x-1">
            {[
              { id: 'overview', name: 'Overview', icon: FileText },
              { id: 'attendance', name: 'Attendance', icon: Calendar },
              { id: 'payments', name: 'Payments', icon: DollarSign },
              { id: 'achievements', name: 'Achievements', icon: Trophy },
              { id: 'notes', name: 'Notes', icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <Phone className="text-blue-600" size={20} />
                  <span>Contact Information</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Parent Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedStudent.parentPhone || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, parentPhone: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    ) : (
                      <p className="font-medium">{student.parentPhone || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Registration Date</label>
                    <p className="font-medium">{new Date(student.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Last 7 Days Attendance */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <Activity className="text-green-600" size={20} />
                  <span>Last 7 Days Attendance</span>
                </h3>
                <div className="flex justify-between space-x-2">
                  {last7DaysAttendance.map((day, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <div className="text-xs text-gray-600 mb-2">{day.day}</div>
                      <div
                        className={`h-12 rounded-lg flex items-center justify-center ${
                          day.status === 'present'
                            ? 'bg-green-500 text-white'
                            : day.status === 'absent'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {day.status === 'present' ? (
                          <CheckCircle size={24} />
                        ) : day.status === 'absent' ? (
                          <XCircle size={24} />
                        ) : (
                          '-'
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(day.date).getDate()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <TrendingUp className="text-purple-600" size={20} />
                  <span>Belt Progress</span>
                </h3>
                <div className="space-y-3">
                  {beltColors.map((belt, idx) => {
                    const isAchieved = belt.id <= currentBelt.id;
                    const isCurrent = belt.id === currentBelt.id;
                    
                    return (
                      <div key={belt.id} className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isAchieved ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {isAchieved && <CheckCircle size={20} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-medium ${isCurrent ? 'text-red-600' : ''}`}>
                              {belt.name} Belt {isCurrent && '(Current)'}
                            </span>
                            {belt.months > 0 && (
                              <span className="text-sm text-gray-500">{belt.months} months</span>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: isAchieved ? '100%' : '0%',
                                backgroundColor: belt.color === '#FFFFFF' ? '#ccc' : belt.color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Attendance History</h3>
                <div className="text-sm text-gray-600">
                  Total: {studentAttendance.filter(a => a.status === 'present').length} sessions
                </div>
              </div>
              
              {studentAttendance.length > 0 ? (
                <div className="space-y-2">
                  {studentAttendance
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 30)
                    .map((record, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              record.status === 'present'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {record.status === 'present' ? (
                              <CheckCircle size={20} />
                            ) : (
                              <XCircle size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{new Date(record.date).toLocaleDateString('en', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                            <p className="text-sm text-gray-600">
                              {record.status === 'present' ? 'Present' : 'Absent'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No attendance records yet</p>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Payment History</h3>
                <div className="text-lg font-bold text-green-600">
                  Total: ${totalPaid}
                </div>
              </div>
              
              {studentPayments.length > 0 ? (
                <div className="space-y-2">
                  {studentPayments
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((payment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <DollarSign className="text-green-600" size={20} />
                          </div>
                          <div>
                            <p className="font-medium">{payment.month}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">${payment.amount}</p>
                          <p className="text-xs text-gray-500">{payment.status}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No payment records yet</p>
                </div>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Graduations */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <Award className="text-purple-600" size={20} />
                  <span>Belt Promotions</span>
                </h3>
                {studentGraduations.length > 0 ? (
                  <div className="space-y-2">
                    {studentGraduations
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((grad, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <div className="flex items-center space-x-3">
                            <Award className="text-purple-600" size={24} />
                            <div>
                              <p className="font-medium">
                                {grad.fromBelt} → {grad.toBelt}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(grad.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No promotions yet</p>
                )}
              </div>

              {/* Tournaments */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <Trophy className="text-yellow-600" size={20} />
                  <span>Tournament Results</span>
                </h3>
                {studentTournaments.length > 0 ? (
                  <div className="space-y-3">
                    {studentTournaments
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((tournament, idx) => {
                        const medalColors = {
                          Gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                          Silver: 'bg-gray-100 text-gray-800 border-gray-300',
                          Bronze: 'bg-orange-100 text-orange-800 border-orange-300',
                          Participation: 'bg-blue-100 text-blue-800 border-blue-300'
                        };

                        return (
                          <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-bold text-lg">{tournament.tournamentName}</p>
                                <p className="text-sm text-gray-600">{tournament.location}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${medalColors[tournament.medal]}`}>
                                {tournament.medal === 'Gold' && '🥇'}
                                {tournament.medal === 'Silver' && '🥈'}
                                {tournament.medal === 'Bronze' && '🥉'}
                                {tournament.medal === 'Participation' && '🎖️'}
                                {' '}{tournament.medal}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>📅 {new Date(tournament.date).toLocaleDateString()}</p>
                              <p>🎯 {tournament.category} - {tournament.weightCategory}</p>
                              {tournament.notes && (
                                <p className="italic mt-2">"{tournament.notes}"</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No tournament results yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <MessageSquare className="text-blue-600" size={20} />
                <span>Coach Notes</span>
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!isEditing}
                placeholder="Add notes about this student..."
                className="w-full h-64 border rounded-lg p-4 resize-none"
              />
              {!isEditing && (
                <p className="text-sm text-gray-500 mt-2">
                  Click "Edit" button to add or modify notes
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;