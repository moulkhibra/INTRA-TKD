// src/api/payments.api.js

import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  doc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Get all payments
 */
export const getPayments = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'payments'), orderBy('date', 'desc'))
    );
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('❌ Error fetching payments:', error);
    return [];
  }
};

/**
 * Add a new payment with enhanced data
 */
export const addPayment = async (paymentData) => {
  try {
    console.log('💰 Adding payment to Firebase...', paymentData);
    
    const docRef = await addDoc(collection(db, 'payments'), {
      studentId: paymentData.studentId,
      amount: parseFloat(paymentData.amount),
      date: Timestamp.fromDate(new Date(paymentData.date || new Date())),
      status: paymentData.status || 'Paid',
      month: paymentData.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      
      // ✅ New enhanced fields
      type: paymentData.type || 'training', // training, insurance, both
      hasOCPDiscount: paymentData.hasOCPDiscount || false,
      insuranceIncluded: paymentData.insuranceIncluded || false,
      originalAmount: paymentData.originalAmount || paymentData.amount,
      insuranceAmount: paymentData.insuranceAmount || 0,
      description: paymentData.description || 'Payment',
      
      created_at: Timestamp.now()
    });
    
    console.log('✅ Payment added successfully!', docRef.id);
    
    return {
      id: docRef.id,
      ...paymentData,
      date: paymentData.date || new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error adding payment:', error);
    throw error;
  }
};

/**
 * Update a payment
 */
export const updatePayment = async (id, updates) => {
  try {
    console.log('📝 Updating payment...', { id, updates });
    
    const paymentRef = doc(db, 'payments', id);
    
    const updateData = { ...updates };
    if (updates.date) {
      updateData.date = Timestamp.fromDate(new Date(updates.date));
    }
    
    await updateDoc(paymentRef, updateData);
    
    console.log('✅ Payment updated successfully!');
    return { id, ...updates };
  } catch (error) {
    console.error('❌ Error updating payment:', error);
    throw error;
  }
};

/**
 * Delete a payment
 */
export const deletePayment = async (id) => {
  try {
    console.log('🗑️ Deleting payment...', id);
    
    await deleteDoc(doc(db, 'payments', id));
    
    console.log('✅ Payment deleted successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error deleting payment:', error);
    throw error;
  }
};

/**
 * Get payments for a specific student
 */
export const getStudentPayments = async (studentId) => {
  try {
    const q = query(
      collection(db, 'payments'),
      where('studentId', '==', studentId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('❌ Error fetching student payments:', error);
    return [];
  }
};

/**
 * Calculate total revenue
 */
export const calculateTotalRevenue = (payments) => {
  return payments.reduce((sum, payment) => {
    return sum + (parseFloat(payment.amount) || 0);
  }, 0);
};

/**
 * Calculate monthly revenue
 */
export const calculateMonthlyRevenue = (payments, month) => {
  return payments
    .filter(p => p.month === month)
    .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
};

/**
 * Calculate insurance revenue
 */
export const calculateInsuranceRevenue = (payments) => {
  return payments
    .filter(p => p.insuranceIncluded)
    .reduce((sum, payment) => sum + (parseFloat(payment.insuranceAmount) || 0), 0);
};

/**
 * Calculate total OCP discounts given
 */
export const calculateOCPDiscounts = (payments, discountRate = 0.20) => {
  return payments
    .filter(p => p.hasOCPDiscount)
    .reduce((sum, payment) => {
      const original = parseFloat(payment.originalAmount) || parseFloat(payment.amount);
      return sum + (original * discountRate);
    }, 0);
};