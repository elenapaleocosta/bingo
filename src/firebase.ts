import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCaCMijF7b7kRy56WuVOeV6vRjjOafgZyI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "amaliasbingo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "amaliasbingo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "amaliasbingo.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "311743202591",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:311743202591:web:2f79c863e424f2dba05c2a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Y7CC0K42EP"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firestore database instance
export const db = getFirestore(app);
export default app;

// Connection Verification Test Function
export async function testFirebaseConnection(): Promise<{ success: boolean; id?: string; data?: any; error?: string }> {
  try {
    const testDocData = {
      gameName: "Amalia's Snoopy & Miffy Bingo",
      status: "connected",
      createdAt: serverTimestamp(),
      testNote: "Firestore database connection verified successfully!",
      phrasesCount: 14
    };

    // Write a dummy document to 'bingo_games' collection
    const docRef = await addDoc(collection(db, "bingo_games"), testDocData);
    
    // Read the document back to verify read access
    const snap = await getDoc(doc(db, "bingo_games", docRef.id));

    if (snap.exists()) {
      return {
        success: true,
        id: docRef.id,
        data: snap.data()
      };
    } else {
      return {
        success: false,
        error: "Document was written but could not be read back."
      };
    }
  } catch (err: any) {
    console.error("Firestore test connection error:", err);
    return {
      success: false,
      error: err?.message || String(err)
    };
  }
}
