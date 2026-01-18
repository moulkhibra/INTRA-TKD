// src/api/attendance.api.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

const COLLECTION = "attendance";
const attendanceRef = collection(db, COLLECTION);

/**
 * Get all attendance records
 * @returns {Promise<Array>} Array of attendance objects
 */
export const getAttendance = async () => {
  try {
    console.log("📅 Fetching all attendance from Firebase...");
    const snapshot = await getDocs(attendanceRef);
    const attendance = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Loaded ${attendance.length} attendance records`);
    return attendance;
  } catch (error) {
    console.error("❌ Error getting attendance:", error);
    throw new Error(`Failed to fetch attendance: ${error.message}`);
  }
};

/**
 * Add a new attendance record
 * @param {Object} attendanceData - Attendance data
 * @param {string} attendanceData.studentId - Student ID
 * @param {string} attendanceData.date - Date (YYYY-MM-DD)
 * @param {string} attendanceData.status - Status (present/absent/late)
 * @returns {Promise<Object>} Created attendance object
 */
export const addAttendance = async (attendanceData) => {
  try {
    console.log("📅 Adding new attendance...", attendanceData);
    
    // Validation
    if (!attendanceData.studentId) {
      throw new Error("Student ID is required");
    }
    if (!attendanceData.date) {
      throw new Error("Date is required");
    }
    if (!attendanceData.status) {
      throw new Error("Status is required");
    }

    const docRef = await addDoc(attendanceRef, {
      ...attendanceData,
      timestamp: attendanceData.timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const newAttendance = {
      id: docRef.id,
      ...attendanceData
    };

    console.log("✅ Attendance added successfully:", docRef.id);
    return newAttendance;
  } catch (error) {
    console.error("❌ Error adding attendance:", error);
    throw new Error(`Failed to add attendance: ${error.message}`);
  }
};

/**
 * Update an attendance record
 * @param {string} id - Attendance ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated attendance object
 */
export const updateAttendance = async (id, updates) => {
  try {
    console.log(`📝 Updating attendance ${id}...`);
    const attendanceDoc = doc(db, COLLECTION, id);
    
    await updateDoc(attendanceDoc, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    console.log("✅ Attendance updated successfully");
    return { id, ...updates };
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    throw new Error(`Failed to update attendance: ${error.message}`);
  }
};

/**
 * Delete an attendance record
 * @param {string} id - Attendance ID
 * @returns {Promise<void>}
 */
export const deleteAttendance = async (id) => {
  try {
    console.log(`🗑️ Deleting attendance ${id}...`);
    const attendanceDoc = doc(db, COLLECTION, id);
    await deleteDoc(attendanceDoc);
    console.log("✅ Attendance deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting attendance:", error);
    throw new Error(`Failed to delete attendance: ${error.message}`);
  }
};

/**
 * Get attendance for a specific student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} Array of attendance objects
 */
export const getStudentAttendance = async (studentId) => {
  try {
    console.log(`📅 Fetching attendance for student ${studentId}...`);
    const q = query(attendanceRef, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    const attendance = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Found ${attendance.length} attendance records for student`);
    return attendance;
  } catch (error) {
    console.error("❌ Error getting student attendance:", error);
    throw new Error(`Failed to fetch student attendance: ${error.message}`);
  }
};

/**
 * Get attendance for a specific date
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of attendance objects
 */
export const getAttendanceByDate = async (date) => {
  try {
    console.log(`📅 Fetching attendance for date: ${date}...`);
    const q = query(attendanceRef, where("date", "==", date));
    const snapshot = await getDocs(q);
    const attendance = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Found ${attendance.length} attendance records for ${date}`);
    return attendance;
  } catch (error) {
    console.error("❌ Error getting attendance by date:", error);
    throw new Error(`Failed to fetch attendance by date: ${error.message}`);
  }
};

/**
 * Get attendance statistics for a student
 * @param {string} studentId - Student ID
 * @param {Array} allAttendance - All attendance array
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Object} Statistics object
 */
export const getAttendanceStats = (studentId, allAttendance, days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const studentAttendance = allAttendance.filter(a => 
    a.studentId === studentId &&
    new Date(a.date) >= cutoffDate
  );

  const present = studentAttendance.filter(a => a.status === 'present').length;
  const absent = studentAttendance.filter(a => a.status === 'absent').length;
  const late = studentAttendance.filter(a => a.status === 'late').length;
  const total = studentAttendance.length;
  const percentage = total > 0 ? Math.round((present / days) * 100) : 0;

  return {
    present,
    absent,
    late,
    total,
    percentage,
    days
  };
};

/**
 * Calculate attendance percentage
 * @param {string} studentId - Student ID
 * @param {Array} allAttendance - All attendance array
 * @param {number} days - Number of days to look back
 * @returns {number} Attendance percentage
 */
export const calculateAttendancePercentage = (studentId, allAttendance, days = 30) => {
  const stats = getAttendanceStats(studentId, allAttendance, days);
  return stats.percentage;
};
