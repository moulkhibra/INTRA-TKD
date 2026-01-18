// src/firebase.js - WITHOUT Analytics (Recommended for now)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase ONLY if it doesn't exist
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized successfully!");
} else {
  app = getApp();
  console.log("✅ Firebase already initialized, reusing existing instance");
}

// Initialize Firestore (Analytics removed for now)
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export app
export default app;

console.log("✅ Firestore database ready!");
console.log("✅ Firebase Authentication ready!");

// 🔒 Note: Analytics disabled for development
// We'll enable it later when needed
