// src/api/messages.api.js
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

const COLLECTION = "messages";
const messagesRef = collection(db, COLLECTION);

/**
 * Get all messages
 * @returns {Promise<Array>} Array of message objects
 */
export const getMessages = async () => {
  try {
    console.log("💬 Fetching all messages from Firebase...");
    const snapshot = await getDocs(messagesRef);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Loaded ${messages.length} messages`);
    return messages;
  } catch (error) {
    console.error("❌ Error getting messages:", error);
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
};

/**
 * Add a new message
 * @param {Object} messageData - Message data
 * @param {string} messageData.studentId - Student ID
 * @param {string} messageData.subject - Message subject
 * @param {string} messageData.message - Message content
 * @param {string} messageData.category - Message category
 * @param {string} messageData.status - Message status (sent/draft/failed)
 * @returns {Promise<Object>} Created message object
 */
export const addMessage = async (messageData) => {
  try {
    console.log("💬 Adding new message...", messageData);
    
    // Validation
    if (!messageData.studentId) {
      throw new Error("Student ID is required");
    }
    if (!messageData.subject) {
      throw new Error("Subject is required");
    }
    if (!messageData.message) {
      throw new Error("Message content is required");
    }

    const docRef = await addDoc(messagesRef, {
      ...messageData,
      status: messageData.status || 'sent',
      date: messageData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const newMessage = {
      id: docRef.id,
      ...messageData
    };

    console.log("✅ Message added successfully:", docRef.id);
    return newMessage;
  } catch (error) {
    console.error("❌ Error adding message:", error);
    throw new Error(`Failed to add message: ${error.message}`);
  }
};

/**
 * Update a message
 * @param {string} id - Message ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated message object
 */
export const updateMessage = async (id, updates) => {
  try {
    console.log(`📝 Updating message ${id}...`);
    const messageDoc = doc(db, COLLECTION, id);
    
    await updateDoc(messageDoc, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    console.log("✅ Message updated successfully");
    return { id, ...updates };
  } catch (error) {
    console.error("❌ Error updating message:", error);
    throw new Error(`Failed to update message: ${error.message}`);
  }
};

/**
 * Delete a message
 * @param {string} id - Message ID
 * @returns {Promise<void>}
 */
export const deleteMessage = async (id) => {
  try {
    console.log(`🗑️ Deleting message ${id}...`);
    const messageDoc = doc(db, COLLECTION, id);
    await deleteDoc(messageDoc);
    console.log("✅ Message deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting message:", error);
    throw new Error(`Failed to delete message: ${error.message}`);
  }
};

/**
 * Get messages for a specific student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} Array of message objects
 */
export const getStudentMessages = async (studentId) => {
  try {
    console.log(`💬 Fetching messages for student ${studentId}...`);
    const q = query(messagesRef, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Found ${messages.length} messages for student`);
    return messages;
  } catch (error) {
    console.error("❌ Error getting student messages:", error);
    throw new Error(`Failed to fetch student messages: ${error.message}`);
  }
};

/**
 * Get messages by category
 * @param {string} category - Message category
 * @returns {Promise<Array>} Array of message objects
 */
export const getMessagesByCategory = async (category) => {
  try {
    console.log(`💬 Fetching messages for category: ${category}...`);
    const q = query(messagesRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Found ${messages.length} messages for category ${category}`);
    return messages;
  } catch (error) {
    console.error("❌ Error getting messages by category:", error);
    throw new Error(`Failed to fetch messages by category: ${error.message}`);
  }
};

/**
 * Get message statistics
 * @param {Array} allMessages - All messages array
 * @returns {Object} Statistics object
 */
export const getMessageStats = (allMessages) => {
  const total = allMessages.length;
  const sent = allMessages.filter(m => m.status === 'sent').length;
  const failed = allMessages.filter(m => m.status === 'failed').length;
  const draft = allMessages.filter(m => m.status === 'draft').length;
  
  const byCategory = allMessages.reduce((acc, msg) => {
    acc[msg.category] = (acc[msg.category] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    sent,
    failed,
    draft,
    byCategory
  };
};

/**
 * Get recent messages (last N days)
 * @param {Array} allMessages - All messages array
 * @param {number} days - Number of days to look back
 * @returns {Array} Recent messages
 */
export const getRecentMessages = (allMessages, days = 7) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allMessages
    .filter(m => new Date(m.date || m.createdAt) >= cutoffDate)
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
};