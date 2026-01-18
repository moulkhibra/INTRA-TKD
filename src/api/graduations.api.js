// src/api/graduations.api.js
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

const COLLECTION = "graduations";
const graduationsRef = collection(db, COLLECTION);

/**
 * Get all graduations
 * @returns {Promise<Array>} Array of graduation objects
 */
export const getGraduations = async () => {
  try {
    console.log("🥋 Fetching all graduations from Firebase...");
    const snapshot = await getDocs(graduationsRef);
    const graduations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Loaded ${graduations.length} graduations`);
    return graduations;
  } catch (error) {
    console.error("❌ Error getting graduations:", error);
    throw new Error(`Failed to fetch graduations: ${error.message}`);
  }
};

/**
 * Add a new graduation
 * @param {Object} graduationData - Graduation data
 * @param {string} graduationData.studentId - Student ID
 * @param {string} graduationData.fromBelt - Current belt name
 * @param {string} graduationData.toBelt - New belt name
 * @param {string} graduationData.date - Graduation date
 * @returns {Promise<Object>} Created graduation object
 */
export const addGraduation = async (graduationData) => {
  try {
    console.log("🥋 Adding new graduation...", graduationData);
    
    // Validation
    if (!graduationData.studentId) {
      throw new Error("Student ID is required");
    }
    if (!graduationData.fromBelt) {
      throw new Error("Current belt is required");
    }
    if (!graduationData.toBelt) {
      throw new Error("New belt is required");
    }

    const docRef = await addDoc(graduationsRef, {
      ...graduationData,
      date: graduationData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const newGraduation = {
      id: docRef.id,
      ...graduationData
    };

    console.log("✅ Graduation added successfully:", docRef.id);
    return newGraduation;
  } catch (error) {
    console.error("❌ Error adding graduation:", error);
    throw new Error(`Failed to add graduation: ${error.message}`);
  }
};

/**
 * Update a graduation
 * @param {string} id - Graduation ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated graduation object
 */
export const updateGraduation = async (id, updates) => {
  try {
    console.log(`📝 Updating graduation ${id}...`);
    const graduationDoc = doc(db, COLLECTION, id);
    
    await updateDoc(graduationDoc, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    console.log("✅ Graduation updated successfully");
    return { id, ...updates };
  } catch (error) {
    console.error("❌ Error updating graduation:", error);
    throw new Error(`Failed to update graduation: ${error.message}`);
  }
};

/**
 * Delete a graduation
 * @param {string} id - Graduation ID
 * @returns {Promise<void>}
 */
export const deleteGraduation = async (id) => {
  try {
    console.log(`🗑️ Deleting graduation ${id}...`);
    const graduationDoc = doc(db, COLLECTION, id);
    await deleteDoc(graduationDoc);
    console.log("✅ Graduation deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting graduation:", error);
    throw new Error(`Failed to delete graduation: ${error.message}`);
  }
};

/**
 * Get graduations for a specific student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} Array of graduation objects
 */
export const getStudentGraduations = async (studentId) => {
  try {
    console.log(`🥋 Fetching graduations for student ${studentId}...`);
    const q = query(graduationsRef, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    const graduations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Found ${graduations.length} graduations for student`);
    return graduations;
  } catch (error) {
    console.error("❌ Error getting student graduations:", error);
    throw new Error(`Failed to fetch student graduations: ${error.message}`);
  }
};

/**
 * Get graduation history for a student (sorted by date)
 * @param {string} studentId - Student ID
 * @param {Array} allGraduations - All graduations array
 * @returns {Array} Sorted graduation history
 */
export const getGraduationHistory = (studentId, allGraduations) => {
  return allGraduations
    .filter(g => g.studentId === studentId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Get recent graduations (last N days)
 * @param {Array} allGraduations - All graduations array
 * @param {number} days - Number of days to look back
 * @returns {Array} Recent graduations
 */
export const getRecentGraduations = (allGraduations, days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allGraduations
    .filter(g => new Date(g.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};