// src/api/tournaments.api.js
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

const COLLECTION = "tournaments";
const tournamentsRef = collection(db, COLLECTION);

/**
 * Get all tournaments
 * @returns {Promise<Array>} Array of tournament objects
 */
export const getTournaments = async () => {
  try {
    console.log("🏆 Fetching all tournaments from Firebase...");
    const snapshot = await getDocs(tournamentsRef);
    const tournaments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Loaded ${tournaments.length} tournaments`);
    return tournaments;
  } catch (error) {
    console.error("❌ Error getting tournaments:", error);
    throw new Error(`Failed to fetch tournaments: ${error.message}`);
  }
};

/**
 * Add a new tournament
 * @param {Object} tournamentData - Tournament data
 * @returns {Promise<Object>} Created tournament object
 */
export const addTournament = async (tournamentData) => {
  try {
    console.log("🏆 Adding new tournament...", tournamentData);
    
    // Validation
    if (!tournamentData.studentId) {
      throw new Error("Student ID is required");
    }
    if (!tournamentData.tournamentName) {
      throw new Error("Tournament name is required");
    }
    if (!tournamentData.location) {
      throw new Error("Location is required");
    }
    if (!tournamentData.category) {
      throw new Error("Age category is required");
    }
    if (!tournamentData.weightCategory) {
      throw new Error("Weight category is required");
    }

    const docRef = await addDoc(tournamentsRef, {
      ...tournamentData,
      createdAt: tournamentData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const newTournament = {
      id: docRef.id,
      ...tournamentData
    };

    console.log("✅ Tournament added successfully:", docRef.id);
    return newTournament;
  } catch (error) {
    console.error("❌ Error adding tournament:", error);
    throw new Error(`Failed to add tournament: ${error.message}`);
  }
};

/**
 * Update a tournament
 * @param {string} id - Tournament ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated tournament object
 */
export const updateTournament = async (id, updates) => {
  try {
    console.log(`📝 Updating tournament ${id}...`);
    const tournamentDoc = doc(db, COLLECTION, id);
    
    await updateDoc(tournamentDoc, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    console.log("✅ Tournament updated successfully");
    return { id, ...updates };
  } catch (error) {
    console.error("❌ Error updating tournament:", error);
    throw new Error(`Failed to update tournament: ${error.message}`);
  }
};

/**
 * Delete a tournament
 * @param {string} id - Tournament ID
 * @returns {Promise<void>}
 */
export const deleteTournament = async (id) => {
  try {
    console.log(`🗑️ Deleting tournament ${id}...`);
    const tournamentDoc = doc(db, COLLECTION, id);
    await deleteDoc(tournamentDoc);
    console.log("✅ Tournament deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting tournament:", error);
    throw new Error(`Failed to delete tournament: ${error.message}`);
  }
};

/**
 * Get tournaments for a specific student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} Array of tournament objects
 */
export const getStudentTournaments = async (studentId) => {
  try {
    console.log(`🏆 Fetching tournaments for student ${studentId}...`);
    const q = query(tournamentsRef, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    const tournaments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Found ${tournaments.length} tournaments for student`);
    return tournaments;
  } catch (error) {
    console.error("❌ Error getting student tournaments:", error);
    throw new Error(`Failed to fetch student tournaments: ${error.message}`);
  }
};

/**
 * Get student medals count
 * @param {string} studentId - Student ID
 * @param {Array} allTournaments - All tournaments array
 * @returns {Object} Medals count object
 */
export const getStudentMedals = (studentId, allTournaments) => {
  const studentTournaments = allTournaments.filter(t => t.studentId === studentId);
  return {
    gold: studentTournaments.filter(t => t.medal === 'Gold').length,
    silver: studentTournaments.filter(t => t.medal === 'Silver').length,
    bronze: studentTournaments.filter(t => t.medal === 'Bronze').length,
    participation: studentTournaments.filter(t => t.medal === 'Participation').length,
    total: studentTournaments.length
  };
};