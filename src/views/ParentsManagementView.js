// src/views/ParentsManagementView.js
import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Link as LinkIcon, Mail, Phone } from 'lucide-react';
import { 
  getAllParents, 
  addParent, 
  updateParent, 
  deleteParent,
  linkStudentToParent

} from '../api/parents';
import { getStudents } from '../api/students';

const ParentsManagementView = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedParent, setSelectedParent] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [parentsData, studentsData] = await Promise.all([
        getAllParents(),
        getStudents()
      ]);
      setParents(parentsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleOpenModal = (mode, parent = null) => {
    setModalMode(mode);
    if (mode === 'edit' && parent) {
      setSelectedParent(parent);
      setFormData({
        name: parent.name,
        email: parent.email,
        phone: parent.phone || '',
        password: parent.password || '',
        address: parent.address || '',
        notes: parent.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await addParent(formData);
      } else {
        await updateParent(selectedParent.id, formData);
      }
      await loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving parent:', error);
    }
  };

  const handleDelete = async (parentId) => {
    if (window.confirm('هل أنت متأكد من حذف ولي الأمر؟')) {
      try {
        await deleteParent(parentId);
        await loadData();
      } catch (error) {
        console.error('Error deleting parent:', error);
      }
    }
  };

  const handleLinkStudent = async (studentId, parentId) => {
    try {
      await linkStudentToParent(studentId, parentId);
      await loadData();
      setShowLinkModal(false);
    } catch (error) {
      console.error('Error linking student:', error);
    }
  };

  const getParentStudents = (parentId) => {
    return students.filter(s => s.parentId === parentId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* الرأس */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              إدارة أولياء الأمور
            </h1>
            <p className="text-gray-600 mt-1">
              إدارة حسابات أولياء الأمور وربطهم بأبنائهم
            </p>
          </div>
          <button
            onClick={() => handleOpenModal('add')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            إضافة ولي أمر
          </button>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الآباء</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{parents.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">آباء نشطون</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {parents.filter(p => getParentStudents(p.id).length > 0).length}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">بدون أبناء مربوطين</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {parents.filter(p => getParentStudents(p.id).length === 0).length}
                </p>
              </div>
              <Users className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* جدول الآباء */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الاسم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  البريد / الهاتف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الأبناء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  العنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parents.map((parent) => {
                const parentStudents = getParentStudents(parent.id);
                return (
                  <tr key={parent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {parent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{parent.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {parent.email}
                        </p>
                        {parent.phone && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {parent.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {parentStudents.length > 0 ? (
                        <div className="space-y-1">
                          {parentStudents.map(student => (
                            <p key={student.id} className="text-sm text-gray-700">
                              • {student.name}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">لا يوجد</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {parent.address || '---'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedParent(parent);
                            setShowLinkModal(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="ربط طالب"
                        >
                          <LinkIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', parent)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="تعديل"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(parent.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {parents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">لا يوجد أولياء أمور مسجلين</p>
            </div>
          )}
        </div>

        {/* Modal إضافة/تعديل */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {modalMode === 'add' ? 'إضافة ولي أمر جديد' : 'تعديل بيانات ولي الأمر'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الهاتف
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      كلمة المرور *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={modalMode === 'add'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={modalMode === 'edit' ? 'اتركه فارغاً للإبقاء على القديم' : ''}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ملاحظات
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {modalMode === 'add' ? 'إضافة' : 'حفظ'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal ربط طالب */}
        {showLinkModal && selectedParent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  ربط طالب بـ {selectedParent.name}
                </h3>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students
                    .filter(s => !s.parentId || s.parentId === selectedParent.id)
                    .map(student => (
                      <button
                        key={student.id}
                        onClick={() => handleLinkStudent(student.id, selectedParent.id)}
                        className={`w-full p-3 rounded-lg border-2 transition text-right ${
                          student.parentId === selectedParent.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-blue-500'
                        }`}
                      >
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.currentBelt}</p>
                        {student.parentId === selectedParent.id && (
                          <span className="text-xs text-green-600">✓ مربوط</span>
                        )}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => setShowLinkModal(false)}
                  className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentsManagementView;
