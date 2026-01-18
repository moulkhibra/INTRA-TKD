// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} fullName - User full name
   * @param {string} role - User role (admin/parent)
   * @param {string} studentId - Student ID (for parents only)
   */
  const signup = async (email, password, fullName, role = 'parent', studentId = null) => {
    try {
      console.log('📝 Creating new user account...');
      
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        fullName: fullName,
        role: role,
        studentId: studentId, // Only for parents
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('✅ User account created successfully!');
      return user;
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  };

  /**
   * Sign in existing user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    try {
      console.log('🔐 Signing in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Signed in successfully!');
      return userCredential.user;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  /**
   * Sign out current user
   */
  const logout = async () => {
    try {
      console.log('👋 Signing out...');
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      console.log('✅ Signed out successfully!');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  };

  /**
   * Send password reset email
   * @param {string} email - User email
   */
  const resetPassword = async (email) => {
    try {
      console.log('📧 Sending password reset email...');
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent!');
    } catch (error) {
      console.error('❌ Password reset error:', error);
      throw error;
    }
  };

  /**
   * Get user role and data from Firestore
   */
  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
        return userData;
      } else {
        console.warn('⚠️ User document not found in Firestore');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('👤 User authenticated:', user.email);
        setCurrentUser(user);
        // Get user role from Firestore
        await getUserData(user.uid);
      } else {
        console.log('👤 No user authenticated');
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    resetPassword,
    isAdmin: userRole === 'admin',
    isParent: userRole === 'parent'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};