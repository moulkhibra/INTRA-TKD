import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, QrCode, IdCard } from 'lucide-react';
import StudentForm from '../components/StudentForm';
import StudentProfile from '../components/StudentProfile';
import StudentQRModal from '../components/StudentQRModal';


const StudentsView = ({
  setShowAddStudent,
  searchTerm,
  setSearchTerm,
  filteredStudents,
  beltColors,
  getAge,
  getAgeCategory,
  getStudentPaymentStatus,
  isEligibleForExam,
  setEditingStudent,
  deleteStudent,
  showAddStudent,
  editingStudent,
  updateStudent,
  handleAddStudent,
  payments = [],
  attendance = [],
  graduations = [],
  tournaments = [],
  getAttendanceStats,
  clubName = 'INSTITUTE NAME',
  clubLogo = null,
  // الـ props الجديدة
  selectedStudent,
  setSelectedStudent,
  showIDCardModal,
  setShowIDCardModal
}) => {
  const [showQRModal, setShowQRModal] = useState(false);

  const handleShowQR = (student) => {
    setSelectedStudent(student);
    setShowQRModal(true);
  };

  const handleShowIDCard = (student) => {
    setSelectedStudent(student);
    setShowIDCardModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <button
          onClick={() => setShowAddStudent(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
        >
          <Plus size={18} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Belt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map(student => {
              const belt = beltColors.find(b => b.id === student.beltId) || beltColors[0];
              const age = getAge(student.dateOfBirth);
              const ageCategory = getAgeCategory(student.dateOfBirth);
              const paid = getStudentPaymentStatus(student.id);
              const eligible = isEligibleForExam(student);

              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{student.fullName}</div>
                      <div className="text-sm text-gray-500">{student.gender}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">{age} years</div>
                    <div className="text-xs text-gray-500">{ageCategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.weight} kg</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: belt.color,
                        color: belt.id === 6 || belt.id === 7 ? 'white' : 'black',
                        border: belt.id === 1 ? '1px solid #ccc' : 'none'
                      }}
                    >
                      {belt.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`text-xs px-2 py-1 rounded ${paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {paid ? 'Paid' : 'Unpaid'}
                      </span>
                      {eligible && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          Exam Ready
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {/* View Profile Button */}
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-purple-600 hover:text-purple-800"
                        title="View Profile"
                      >
                        <Eye size={18} />
                      </button>
                      {/* ID Card Button */}
                      <button
                        onClick={() => handleShowIDCard(student)}
                        className="text-green-600 hover:text-green-800"
                        title="عرض بطاقة التعريف"
                      >
                        <IdCard size={18} />
                      </button>
                      <button
                        onClick={() => handleShowQR(student)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="عرض QR Code"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Student Modal */}
      {(showAddStudent || editingStudent) && (
        <StudentForm
          student={editingStudent}
          beltColors={beltColors}
          onSave={editingStudent ? (data) => updateStudent(editingStudent.id, data) : handleAddStudent}
          onCancel={() => {
            setShowAddStudent(false);
            setEditingStudent(null);
          }}
        />
      )}

      {/* Student Profile Modal */}
      {selectedStudent && !showIDCardModal && (
        <StudentProfile
        student={selectedStudent}
        beltColors={beltColors}
        onClose={() => setSelectedStudent(null)}
        onUpdate={updateStudent}
        payments={payments}
        attendance={attendance}
        graduations={graduations}
        tournaments={tournaments}
        getAge={getAge}
        getAgeCategory={getAgeCategory}
        getAttendanceStats={getAttendanceStats}
        />
        )}

      {showQRModal && selectedStudent && (
        <StudentQRModal
          student={selectedStudent}
          isOpen={showQRModal}
          onClose={() => {
            setShowQRModal(false);
            setShowIDCardModal(false);
            setSelectedStudent(null);
          }}
          clubName={clubName}
          clubLogo={clubLogo}
        />
      )}
    </div>
  );
};

export default StudentsView;