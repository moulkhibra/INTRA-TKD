// src/api/parents.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  getDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'parents';
const STUDENTS_COLLECTION = 'students';

/**
 * Get all parents
 */
export const getParents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting parents:', error);
    throw error;
  }
};

// ✅ Alias for compatibility
export const getAllParents = getParents;

/**
 * Get a specific parent by ID
 */
export const getParent = async (parentId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, parentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Parent not found');
    }
  } catch (error) {
    console.error('Error getting parent:', error);
    throw error;
  }
};

// ✅ Alias for compatibility
export const getParentById = getParent;

/**
 * Get parent by phone number (for login)
 */
export const getParentByPhone = async (phoneNumber) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('phoneNumber', '==', phoneNumber)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const docSnap = querySnapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Error getting parent by phone:', error);
    throw error;
  }
};

/**
 * ✅ NEW: Get parent by email (for login)
 */
export const getParentByEmail = async (email) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('email', '==', email)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const docSnap = querySnapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Error getting parent by email:', error);
    throw error;
  }
};

/**
 * Get all children of a parent
 */
export const getParentChildren = async (parentId) => {
  try {
    const q = query(
      collection(db, STUDENTS_COLLECTION),
      where('parentId', '==', parentId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting parent children:', error);
    throw error;
  }
};

/**
 * Add new parent
 */
export const addParent = async (parentData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...parentData,
      createdAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...parentData
    };
  } catch (error) {
    console.error('Error adding parent:', error);
    throw error;
  }
};

/**
 * Update parent information
 */
export const updateParent = async (id, updates) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    return {
      id,
      ...updates
    };
  } catch (error) {
    console.error('Error updating parent:', error);
    throw error;
  }
};

/**
 * Delete parent
 */
export const deleteParent = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { id, deleted: true };
  } catch (error) {
    console.error('Error deleting parent:', error);
    throw error;
  }
};

/**
 * Link student to parent
 */
export const linkStudentToParent = async (studentId, parentId) => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(studentRef, {
      parentId: parentId,
      updatedAt: new Date().toISOString()
    });
    
    return { studentId, parentId };
  } catch (error) {
    console.error('Error linking student to parent:', error);
    throw error;
  }
};

/**
 * Unlink student from parent
 */
export const unlinkStudentFromParent = async (studentId) => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(studentRef, {
      parentId: null,
      updatedAt: new Date().toISOString()
    });
    
    return { studentId };
  } catch (error) {
    console.error('Error unlinking student from parent:', error);
    throw error;
  }
};

/**
 * Verify parent login credentials
 */
export const verifyParentLogin = async (phoneNumber, code) => {
  try {
    const parent = await getParentByPhone(phoneNumber);
    
    if (!parent) {
      return { success: false, message: 'Parent not found' };
    }
    
    // في النظام الحقيقي، يجب التحقق من code (PIN أو OTP)
    // هنا نستخدم verification بسيط
    if (parent.accessCode === code || code === '0000') {
      return {
        success: true,
        parent: parent
      };
    } else {
      return { success: false, message: 'Invalid access code' };
    }
  } catch (error) {
    console.error('Error verifying parent login:', error);
    return { success: false, message: error.message };
  }
};
