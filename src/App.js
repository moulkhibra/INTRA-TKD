import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Users, DollarSign, Award, Calendar, TrendingUp, FileText, MessageSquare, Trophy, LogOut, QrCode, Home, GraduationCap, CreditCard, ShoppingBag } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './views/LoginPage';
import QRAttendanceView from './views/QRAttendanceView';
import PWAInstallBanner from './components/PWAInstallBanner';
import NetworkStatus from './components/NetworkStatus';
import PortalLoginView from './views/PortalLoginView';
import ParentPortalView from './views/ParentPortalView';
import StudentPortalView from './views/StudentPortalView';
import ParentsManagementView from './views/ParentsManagementView';
import IDCardsView from './views/IDCardsView';

import { 
  getStudents, 
  addStudent, 
  updateStudent as apiUpdateStudent, 
  deleteStudent as apiDeleteStudent
} from "./api/students";

import {
  getAttendance,
  addAttendance as apiAddAttendance,
  updateAttendance as apiUpdateAttendance
} from "./api/attendance.api";

import {
  getGraduations,
  addGraduation as apiAddGraduation
} from "./api/graduations.api";

import {
  getMessages,
  addMessage as apiAddMessage
} from "./api/messages.api";

import {
  getPayments,
  addPayment as apiAddPayment,
  deletePayment as apiDeletePayment,
  calculateTotalRevenue,
  calculateMonthlyRevenue
} from "./api/payments.api";

import {
  getTournaments,
  addTournament as apiAddTournament,
  deleteTournament as apiDeleteTournament,
  getStudentMedals as apiGetStudentMedals
} from "./api/tournaments.api";

// Views
import DashboardView from './views/DashboardView';
import StudentsView from './views/StudentsView';
import ParentsPortal from './views/ParentsPortal';
import AttendanceView from './views/AttendanceView';
import TournamentsView from './views/TournamentsView';
import PaymentsView from './views/PaymentsView';
import ExamsView from './views/ExamsView';
import MessagesView from './views/MessagesView';
import ReportsView from './views/ReportsView';

const TKDManager = () => {
  const navigate = useNavigate();
  const { currentUser: user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [graduations, setGraduations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  
  // ✅ FIX: إضافة المتغيرات الناقصة
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showIDCardModal, setShowIDCardModal] = useState(false);

  const beltColors = [
    { id: 1, name: 'White', color: '#FFFFFF', months: 0 },
    { id: 2, name: 'Yellow', color: '#FFD700', months: 3 },
    { id: 3, name: 'Orange', color: '#FFA500', months: 6 },
    { id: 4, name: 'Green', color: '#32CD32', months: 9 },
    { id: 5, name: 'Blue', color: '#1E90FF', months: 12 },
    { id: 6, name: 'Red', color: '#DC143C', months: 18 },
    { id: 7, name: 'Black', color: '#000000', months: 24 }
  ];

  // Load ALL data from Firebase on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      console.log('🔥 Loading ALL data from Firebase...');

      const [studentsData, paymentsData, attendanceData, graduationsData, tournamentsData, messagesData] = await Promise.all([
        getStudents(),
        getPayments(),
        getAttendance(),
        getGraduations(),
        getTournaments(),
        getMessages()
      ]);
      
      setStudents(studentsData);
      setPayments(paymentsData);
      setAttendance(attendanceData);
      setGraduations(graduationsData);
      setTournaments(tournamentsData);
      setMessages(messagesData);
      
      console.log('✅ Data loaded successfully!');
      console.log(`📚 Students: ${studentsData.length}`);
      console.log(`💰 Payments: ${paymentsData.length}`);
      console.log(`📅 Attendance: ${attendanceData.length}`);
      console.log(`🥋 Graduations: ${graduationsData.length}`);
      console.log(`🏆 Tournaments: ${tournamentsData.length}`);
      console.log(`💬 Messages: ${messagesData.length}`);
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      alert(`Failed to load data: ${error.message}\n\nCheck Firebase configuration and internet connection.`);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  // ✅ FIX: تصحيح handleAddStudent - إزالة التكرار
  const handleAddStudent = async (studentData) => {
    try {
      const newStudent = {
        ...studentData,
        registrationDate: new Date().toISOString(),
        lastBeltPromotion: new Date().toISOString(),
      };

      const savedStudent = await addStudent(newStudent);
      await loadStudents();
      setShowAddStudent(false);
      
      // عرض ID Card بعد الإضافة
      setSelectedStudent(savedStudent);
      setShowIDCardModal(true);
      
      alert('✅ Student added successfully!');
    } catch (error) {
      console.error('Failed to add student:', error);
      alert('❌ Failed to add student. Check console for details.');
    }
  };

  const updateStudent = async (id, updates) => {
    try {
      await apiUpdateStudent(id, updates);
      await loadStudents();
      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student');
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await apiDeleteStudent(id);
      await loadStudents();
      
      // Clean up related data
      setPayments(payments.filter(p => p.studentId !== id));
      setGraduations(graduations.filter(g => g.studentId !== id));
      setAttendance(attendance.filter(a => a.studentId !== id));
      setTournaments(tournaments.filter(t => t.studentId !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  const addPayment = async (studentId, amount, extraData = {}) => {
    try {
      console.log('💰 Adding payment...', { studentId, amount, extraData });

      const newPayment = {
        studentId,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        status: 'Paid',
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        ...extraData
      };
      
      const savedPayment = await apiAddPayment(newPayment);
      setPayments([...payments, savedPayment]);
      console.log('✅ Payment added successfully!');
      alert('✅ Payment recorded successfully!');
    } catch (error) {
      console.error('❌ Error adding payment:', error);
      alert(`❌ Failed to add payment: ${error.message}`);
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this payment?')) {
      return;
    }
    
    try {
      console.log('🗑️ Deleting payment...', id);
      
      await apiDeletePayment(id);
      setPayments(payments.filter(p => p.id !== id));
      
      console.log('✅ Payment deleted successfully!');
      alert('✅ Payment deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting payment:', error);
      alert(`❌ Failed to delete payment: ${error.message}`);
    }
  };

  const markAttendance = async (studentId, date, status) => {
    try {
      const existingIndex = attendance.findIndex(
        a => a.studentId === studentId && a.date === date
      );

      if (existingIndex >= 0) {
        const existingRecord = attendance[existingIndex];
        await apiUpdateAttendance(existingRecord.id, { status });
        
        const updated = [...attendance];
        updated[existingIndex] = { ...updated[existingIndex], status };
        setAttendance(updated);
      } else {
        const newAttendance = {
          studentId,
          date,
          status,
          timestamp: new Date().toISOString()
        };
        
        const savedAttendance = await apiAddAttendance(newAttendance);
        setAttendance([...attendance, savedAttendance]);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert(`Failed to mark attendance: ${error.message}`);
    }
  };

  const promoteStudent = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      const currentBelt = beltColors.find(b => b.id === student.beltId);
      const nextBelt = beltColors.find(b => b.id === currentBelt.id + 1);

      if (nextBelt) {
        const graduation = {
          studentId,
          fromBelt: currentBelt.name,
          toBelt: nextBelt.name,
          date: new Date().toISOString()
        };
        
        const savedGraduation = await apiAddGraduation(graduation);
        setGraduations([...graduations, savedGraduation]);
        
        await updateStudent(studentId, {
          beltId: nextBelt.id,
          lastBeltPromotion: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error promoting student:', error);
      alert('Failed to promote student');
    }
  };

  const addTournament = async (tournamentData) => {
    try {
      const savedTournament = await apiAddTournament(tournamentData);
      setTournaments([...tournaments, savedTournament]);
      setShowTournamentModal(false);
    } catch (error) {
      console.error('Error adding tournament:', error);
      alert('Failed to add tournament');
    }
  };

  const deleteTournament = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament result?')) return;
    
    try {
      await apiDeleteTournament(id);
      setTournaments(tournaments.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Failed to delete tournament');
    }
  };

  const sendMessage = async (recipients, subject, messageText, category) => {
    try {
      const newMessages = await Promise.all(
        recipients.map(studentId => 
          apiAddMessage({
            studentId,
            subject,
            message: messageText,
            category,
            status: 'sent'
          })
        )
      );
      
      setMessages([...messages, ...newMessages]);
    } catch (error) {
      console.error('Error sending messages:', error);
      alert('Failed to send messages');
    }
  };

  const sendBulkMessage = (messageData) => {
    const { category, subject, message } = messageData;
    let recipients = [];

    switch (category) {
      case 'unpaid':
        recipients = unpaidStudents.map(s => s.id);
        break;
      case 'eligible':
        recipients = eligibleStudents.map(s => s.id);
        break;
      case 'low-attendance':
        recipients = students.filter(s => {
          const pct = Math.round((getAttendanceStats(s.id, 30) / 30) * 100);
          return pct < 60;
        }).map(s => s.id);
        break;
      case 'all':
        recipients = students.map(s => s.id);
        break;
      default:
        recipients = [];
    }

    if (recipients.length > 0) {
      sendMessage(recipients, subject, message, category);
    }
  };

  const getAgeCategory = (dateOfBirth) => {
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age <= 11) return 'Kids (≤11)';
    if (age >= 12 && age <= 14) return 'Cadets (12-14)';
    if (age >= 15 && age <= 17) return 'Juniors (15-17)';
    return 'Seniors (18+)';
  };

  const getAge = (dateOfBirth) => {
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  };

  const getStudentTournaments = (studentId) => {
    return tournaments.filter(t => t.studentId === studentId);
  };

  const getStudentMedals = (studentId) => {
    return apiGetStudentMedals(studentId, tournaments);
  };

  const getStudentPaymentStatus = (studentId) => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    return payments.some(p => p.studentId === studentId && p.month === currentMonth);
  };

  const getNextExamDate = (student) => {
    const currentBelt = beltColors.find(b => b.id === student.beltId);
    const nextBelt = beltColors.find(b => b.id === currentBelt.id + 1);

    if (!nextBelt) return null;

    const lastPromotion = new Date(student.lastBeltPromotion);
    const monthsRequired = nextBelt.months - currentBelt.months;
    const nextExam = new Date(lastPromotion);
    nextExam.setMonth(nextExam.getMonth() + monthsRequired);

    return nextExam;
  };

  const isEligibleForExam = (student) => {
    const nextExam = getNextExamDate(student);
    if (!nextExam) return false;
    return new Date() >= nextExam;
  };

  const getAttendanceForDate = (studentId, date) => {
    const record = attendance.find(a => a.studentId === studentId && a.date === date);
    return record?.status || null;
  };

  const getAttendanceStats = (studentId, days = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentAttendance = attendance.filter(a =>
      a.studentId === studentId &&
      new Date(a.date) >= cutoffDate &&
      a.status === 'present'
    );

    return recentAttendance.length;
  };

  const generateReport = (type) => {
    let reportData = '';
    const timestamp = new Date().toLocaleString();

    if (type === 'financial') {
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const monthlyRevenue = calculateMonthlyRevenue(payments, currentMonth);
      const totalRevenue = calculateTotalRevenue(payments);

      reportData = `FINANCIAL REPORT\nGenerated: ${timestamp}\n\n`;
      reportData += `Current Month: ${currentMonth}\n`;
      reportData += `Total Revenue: ${totalRevenue}\n`;
      reportData += `Monthly Revenue: ${monthlyRevenue}\n`;
      reportData += `Students Paid: ${students.length - unpaidStudents.length}/${students.length}\n`;
      reportData += `Outstanding: ${unpaidStudents.length} students\n\n`;
      reportData += `UNPAID STUDENTS:\n`;
      unpaidStudents.forEach(s => {
        reportData += `- ${s.fullName}\n`;
      });
    } else if (type === 'attendance') {
      reportData = `ATTENDANCE REPORT (Last 30 Days)\nGenerated: ${timestamp}\n\n`;
      students.forEach(student => {
        const count = getAttendanceStats(student.id, 30);
        const percentage = Math.round((count / 30) * 100);
        reportData += `${student.fullName}: ${count} days (${percentage}%)\n`;
      });
    } else if (type === 'belt') {
      reportData = `BELT PROGRESSION REPORT\nGenerated: ${timestamp}\n\n`;
      reportData += `CURRENT DISTRIBUTION:\n`;
      beltColors.forEach(belt => {
        const count = students.filter(s => s.beltId === belt.id).length;
        reportData += `${belt.name} Belt: ${count} students\n`;
      });
    } else if (type === 'comprehensive') {
      reportData = `COMPREHENSIVE CLUB REPORT\nGenerated: ${timestamp}\n\n`;
      reportData += `=== OVERVIEW ===\n`;
      reportData += `Total Students: ${students.length}\n`;
      reportData += `Total Revenue: ${totalRevenue}\n`;
      reportData += `Unpaid This Month: ${unpaidStudents.length}\n`;
      reportData += `Ready for Belt Exam: ${eligibleStudents.length}\n`;
    }

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TKD-${type}-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredStudents = students.filter(s =>
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unpaidStudents = students.filter(s => !getStudentPaymentStatus(s.id));
  const eligibleStudents = students.filter(isEligibleForExam);
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TKD Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🥋 INTRA-TKD</h1>
            <p className="text-red-100">Taekwondo Club Management System</p>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold">{user.name || user.email}</p>
                  <p className="text-xs text-red-100">{user.role}</p>
                </div>
                
                <button
                  onClick={() => navigate('/parents-management')}
                  className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  title="Parents Management"
                >
                  <Users size={18} />
                  <span className="hidden sm:inline">إدارة الآباء</span>
                </button>
                
                <button
                  onClick={() => window.open('/portal/login', '_blank')}
                  className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  title="Parent & Student Portal"
                >
                  <GraduationCap size={18} />
                  <span className="hidden sm:inline">بورتال</span>
                </button>
                
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md border-b">
        <div className="flex space-x-1 p-2 overflow-x-auto">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
            { id: 'students', name: 'Students', icon: Users },
            { id: 'attendance', name: 'Attendance', icon: Calendar },
            { id: 'qr-attendance', name: 'QR Attendance', icon: QrCode },
            { id: 'tournaments', name: 'Tournaments', icon: Trophy },
            { id: 'payments', name: 'Payments', icon: DollarSign },
            { id: 'belts', name: 'Belt Progress', icon: Award },
            { id: 'communication', name: 'Communication', icon: MessageSquare },
            { id: 'reports', name: 'Reports', icon: FileText },
            { id: 'id-cards', name: 'ID Cards', icon: CreditCard }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            students={students}
            getAge={getAge}
            unpaidStudents={unpaidStudents}
            eligibleStudents={eligibleStudents}
            payments={payments}
            attendance={attendance}
            graduations={graduations}
            tournaments={tournaments} 
          />
        )}

        {activeTab === 'students' && (
          <StudentsView
            setShowAddStudent={setShowAddStudent}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredStudents={filteredStudents}
            beltColors={beltColors}
            getAge={getAge}
            getAgeCategory={getAgeCategory}
            getStudentPaymentStatus={getStudentPaymentStatus}
            isEligibleForExam={isEligibleForExam}
            setEditingStudent={setEditingStudent}
            deleteStudent={deleteStudent}
            showAddStudent={showAddStudent}
            editingStudent={editingStudent}
            updateStudent={updateStudent}
            handleAddStudent={handleAddStudent}
            payments={payments}
            attendance={attendance}
            graduations={graduations}
            tournaments={tournaments}
            getAttendanceStats={getAttendanceStats}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            showIDCardModal={showIDCardModal}
            setShowIDCardModal={setShowIDCardModal}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            students={students}
            beltColors={beltColors}
            getAttendanceForDate={getAttendanceForDate}
            markAttendance={markAttendance}
            getAttendanceStats={getAttendanceStats}
            attendance={attendance}
          />
        )}

        {activeTab === 'qr-attendance' && (
          <QRAttendanceView
            students={students}
            markAttendance={markAttendance}
            attendance={attendance}
          />
        )}

        {activeTab === 'tournaments' && (
          <TournamentsView
            setShowTournamentModal={setShowTournamentModal}
            tournaments={tournaments}
            students={students}
            deleteTournament={deleteTournament}
            getStudentMedals={getStudentMedals}
            getStudentTournaments={getStudentTournaments}
            getAgeCategory={getAgeCategory}
            showTournamentModal={showTournamentModal}
            addTournament={addTournament}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsView
            students={students}
            addPayment={addPayment}
            unpaidStudents={unpaidStudents}
            payments={payments}
            deletePayment={deletePayment}
            updateStudent={updateStudent} 
          />
        )}

        {activeTab === 'belts' && (
          <ExamsView
            eligibleStudents={eligibleStudents}
            graduations={graduations}
            students={students}
            beltColors={beltColors}
            getAge={getAge}
            getAgeCategory={getAgeCategory}
            promoteStudent={promoteStudent}
            isEligibleForExam={isEligibleForExam}
            getNextExamDate={getNextExamDate}
          />
        )}

        {activeTab === 'communication' && (
          <MessagesView
            unpaidStudents={unpaidStudents}
            eligibleStudents={eligibleStudents}
            students={students}
            getAttendanceStats={getAttendanceStats}
            setShowMessageModal={setShowMessageModal}
            messages={messages}
            getAge={getAge}
            getStudentPaymentStatus={getStudentPaymentStatus}
            isEligibleForExam={isEligibleForExam}
            showMessageModal={showMessageModal}
            sendBulkMessage={sendBulkMessage}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            generateReport={generateReport}
            beltColors={beltColors}
            students={students}
            unpaidStudents={unpaidStudents}
            totalRevenue={totalRevenue}
            getAttendanceStats={getAttendanceStats}
            graduations={graduations}
            payments={payments}
          />
        )}

        {activeTab === 'id-cards' && (
          <IDCardsView
            students={students}
            beltColors={beltColors}
          />
        )}
      </div>
    </div>
  );
};

// Main App wrapper with routes
function App() {
  const { loading } = useAuth();
  const navigate = useNavigate();

  const handlePortalLogin = (userData) => {
    if (userData.type === 'parent') {
      localStorage.setItem('portalUser', JSON.stringify(userData));
      navigate('/portal/parent');
    } else if (userData.type === 'student') {
      localStorage.setItem('portalUser', JSON.stringify(userData));
      navigate('/portal/student');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PWAInstallBanner />
      <NetworkStatus />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Portal routes */}
        <Route path="/portal/login" element={<PortalLoginView onLoginSuccess={handlePortalLogin} />} />
        
        <Route 
          path="/portal/parent" 
          element={
            <ProtectedRoute type="parent">
              <ParentPortalView />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/portal/student" 
          element={
            <ProtectedRoute type="student">
              <StudentPortalView />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route
          path="/parents-management"
          element={
            <ProtectedRoute>
              <ParentsManagementView />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/id-cards" 
          element={
            <ProtectedRoute>
              <IDCardsView />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <TKDManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
