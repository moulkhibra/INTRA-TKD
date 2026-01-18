import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  Timestamp, 
  query, 
  orderBy,
  where 
} from "firebase/firestore";
import { db } from "../firebase";

// ========================================
// STUDENTS API
// ========================================

export const getStudents = async () => {
  try {
    const studentsCollection = collection(db, "students");
    const q = query(studentsCollection, orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Timestamps to ISO strings
      registrationDate: doc.data().registrationDate?.toDate?.()?.toISOString() || new Date().toISOString(),
      lastBeltPromotion: doc.data().lastBeltPromotion?.toDate?.()?.toISOString() || new Date().toISOString(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      insuranceDate: doc.data().insuranceDate?.toDate?.()?.toISOString() || null,
      insuranceExpiryDate: doc.data().insuranceExpiryDate?.toDate?.()?.toISOString() || null,
      ocpPartnershipDate: doc.data().ocpPartnershipDate?.toDate?.()?.toISOString() || null,
    }));
    return students;
  } catch (error) {
    console.error("Error getting students:", error);
    return [];
  }
};

export const addStudent = async (studentData) => {
  try {
    const studentsCollection = collection(db, "students");
    const docRef = await addDoc(studentsCollection, {
      ...studentData,
      // Profile & Notes
      profileImage: studentData.profileImage || null,
      notes: studentData.notes || '',
      // Insurance & OCP Partnership
      hasInsurance: studentData.hasInsurance || false,
      insuranceDate: studentData.insuranceDate ? Timestamp.fromDate(new Date(studentData.insuranceDate)) : null,
      insuranceExpiryDate: studentData.insuranceExpiryDate ? Timestamp.fromDate(new Date(studentData.insuranceExpiryDate)) : null,
      hasOCPPartnership: studentData.hasOCPPartnership || false,
      ocpPartnershipDate: studentData.ocpPartnershipDate ? Timestamp.fromDate(new Date(studentData.ocpPartnershipDate)) : null,
      // Timestamps
      created_at: Timestamp.now(),
      registrationDate: Timestamp.fromDate(new Date(studentData.registrationDate || new Date())),
      lastBeltPromotion: Timestamp.fromDate(new Date(studentData.lastBeltPromotion || new Date())),
    });
    
    console.log('✅ Student added to Firebase:', docRef.id);
    
    return {
      id: docRef.id,
      ...studentData
    };
  } catch (error) {
    console.error("❌ Error adding student:", error);
    throw error;
  }
};

export const updateStudent = async (id, updates) => {
  try {
    const studentDoc = doc(db, "students", id);
    
    // Convert date strings to Timestamps if present
    const updateData = { ...updates };
    
    if (updates.lastBeltPromotion) {
      updateData.lastBeltPromotion = Timestamp.fromDate(new Date(updates.lastBeltPromotion));
    }
    
    if (updates.insuranceDate) {
      updateData.insuranceDate = Timestamp.fromDate(new Date(updates.insuranceDate));
    }
    
    if (updates.insuranceExpiryDate) {
      updateData.insuranceExpiryDate = Timestamp.fromDate(new Date(updates.insuranceExpiryDate));
    }
    
    if (updates.ocpPartnershipDate) {
      updateData.ocpPartnershipDate = Timestamp.fromDate(new Date(updates.ocpPartnershipDate));
    }
    
    await updateDoc(studentDoc, updateData);
    console.log('✅ Student updated:', id);
    
    return { id, ...updates };
  } catch (error) {
    console.error("❌ Error updating student:", error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
    console.log('✅ Student deleted:', id);
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    throw error;
  }
};

// ========================================
// PAYMENTS API
// ========================================

export const getPayments = async () => {
  try {
    const paymentsCollection = collection(db, "payments");
    const q = query(paymentsCollection, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || new Date().toISOString(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
    return payments;
  } catch (error) {
    console.error("❌ Error getting payments:", error);
    return [];
  }
};

export const addPayment = async (paymentData) => {
  try {
    const paymentsCollection = collection(db, "payments");
    const docRef = await addDoc(paymentsCollection, {
      studentId: paymentData.studentId,
      amount: parseFloat(paymentData.amount),
      date: Timestamp.fromDate(new Date(paymentData.date || new Date())),
      status: paymentData.status || 'Paid',
      month: paymentData.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      // Enhanced fields
      type: paymentData.type || 'training',
      hasOCPDiscount: paymentData.hasOCPDiscount || false,
      insuranceIncluded: paymentData.insuranceIncluded || false,
      originalAmount: paymentData.originalAmount || paymentData.amount,
      insuranceAmount: paymentData.insuranceAmount || 0,
      description: paymentData.description || 'Payment',
      created_at: Timestamp.now()
    });
    
    console.log('✅ Payment added to Firebase:', docRef.id);
    
    return {
      id: docRef.id,
      ...paymentData,
      date: paymentData.date || new Date().toISOString()
    };
  } catch (error) {
    console.error("❌ Error adding payment:", error);
    throw error;
  }
};

export const updatePayment = async (id, updates) => {
  try {
    const paymentDoc = doc(db, "payments", id);
    
    const updateData = { ...updates };
    if (updates.date) {
      updateData.date = Timestamp.fromDate(new Date(updates.date));
    }
    
    await updateDoc(paymentDoc, updateData);
    console.log('✅ Payment updated:', id);
    
    return { id, ...updates };
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    const paymentDoc = doc(db, "payments", id);
    await deleteDoc(paymentDoc);
    console.log('✅ Payment deleted:', id);
  } catch (error) {
    console.error("❌ Error deleting payment:", error);
    throw error;
  }
};

// Get payments for specific student
export const getStudentPayments = async (studentId) => {
  try {
    const paymentsCollection = collection(db, "payments");
    const q = query(
      paymentsCollection,
      where("studentId", "==", studentId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("❌ Error getting student payments:", error);
    return [];
  }
};

// Calculate total revenue
export const calculateTotalRevenue = (payments) => {
  return payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
};

// Calculate monthly revenue
export const calculateMonthlyRevenue = (payments, month) => {
  return payments
    .filter(p => p.month === month)
    .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
};

// ========================================
// ATTENDANCE API
// ========================================

export const getAttendance = async () => {
  try {
    const attendanceCollection = collection(db, "attendance");
    const snapshot = await getDocs(attendanceCollection);
    const attendance = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
    return attendance;
  } catch (error) {
    console.error("❌ Error getting attendance:", error);
    return [];
  }
};

export const addAttendance = async (attendanceData) => {
  try {
    const attendanceCollection = collection(db, "attendance");
    const docRef = await addDoc(attendanceCollection, {
      ...attendanceData,
      timestamp: Timestamp.now()
    });
    
    console.log('✅ Attendance added:', docRef.id);
    
    return {
      id: docRef.id,
      ...attendanceData
    };
  } catch (error) {
    console.error("❌ Error adding attendance:", error);
    throw error;
  }
};

export const updateAttendance = async (id, updates) => {
  try {
    const attendanceDoc = doc(db, "attendance", id);
    await updateDoc(attendanceDoc, updates);
    console.log('✅ Attendance updated:', id);
    
    return { id, ...updates };
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    throw error;
  }
};

// ========================================
// GRADUATIONS API
// ========================================

export const getGraduations = async () => {
  try {
    const graduationsCollection = collection(db, "graduations");
    const q = query(graduationsCollection, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const graduations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
    return graduations;
  } catch (error) {
    console.error("❌ Error getting graduations:", error);
    return [];
  }
};

export const addGraduation = async (graduationData) => {
  try {
    const graduationsCollection = collection(db, "graduations");
    const docRef = await addDoc(graduationsCollection, {
      ...graduationData,
      date: Timestamp.fromDate(new Date(graduationData.date || new Date())),
      created_at: Timestamp.now()
    });
    
    console.log('✅ Graduation added:', docRef.id);
    
    return {
      id: docRef.id,
      ...graduationData
    };
  } catch (error) {
    console.error("❌ Error adding graduation:", error);
    throw error;
  }
};

// ========================================
// TOURNAMENTS API
// ========================================

export const getTournaments = async () => {
  try {
    const tournamentsCollection = collection(db, "tournaments");
    const q = query(tournamentsCollection, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const tournaments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || new Date().toISOString(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
    return tournaments;
  } catch (error) {
    console.error("❌ Error getting tournaments:", error);
    return [];
  }
};

export const addTournament = async (tournamentData) => {
  try {
    const tournamentsCollection = collection(db, "tournaments");
    const docRef = await addDoc(tournamentsCollection, {
      ...tournamentData,
      date: Timestamp.fromDate(new Date(tournamentData.date || new Date())),
      createdAt: Timestamp.now()
    });
    
    console.log('✅ Tournament added:', docRef.id);
    
    return {
      id: docRef.id,
      ...tournamentData
    };
  } catch (error) {
    console.error("❌ Error adding tournament:", error);
    throw error;
  }
};

export const deleteTournament = async (id) => {
  try {
    const tournamentDoc = doc(db, "tournaments", id);
    await deleteDoc(tournamentDoc);
    console.log('✅ Tournament deleted:', id);
  } catch (error) {
    console.error("❌ Error deleting tournament:", error);
    throw error;
  }
};

// Get student medals
export const getStudentMedals = (studentId, tournaments) => {
  const studentTournaments = tournaments.filter(t => t.studentId === studentId);
  return {
    gold: studentTournaments.filter(t => t.medal === 'Gold').length,
    silver: studentTournaments.filter(t => t.medal === 'Silver').length,
    bronze: studentTournaments.filter(t => t.medal === 'Bronze').length,
    total: studentTournaments.length
  };
};

// ========================================
// MESSAGES API
// ========================================

export const getMessages = async () => {
  try {
    const messagesCollection = collection(db, "messages");
    const q = query(messagesCollection, orderBy("sentAt", "desc"));
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      sentAt: doc.data().sentAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
    return messages;
  } catch (error) {
    console.error("❌ Error getting messages:", error);
    return [];
  }
};

export const addMessage = async (messageData) => {
  try {
    const messagesCollection = collection(db, "messages");
    const docRef = await addDoc(messagesCollection, {
      ...messageData,
      sentAt: Timestamp.now()
    });
    
    console.log('✅ Message added:', docRef.id);
    
    return {
      id: docRef.id,
      ...messageData
    };
  } catch (error) {
    console.error("❌ Error adding message:", error);
    throw error;
  }
};