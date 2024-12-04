import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDbB4KT3qN-vSutIj1Giuulzj7ETYYsiOI",
  authDomain: "real-rpg-2.firebaseapp.com",
  projectId: "real-rpg-2",
  storageBucket: "real-rpg-2.firebasestorage.app",
  messagingSenderId: "847802676753",
  appId: "1:847802676753:web:a020406ca584924ce823b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});