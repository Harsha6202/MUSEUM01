import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDGJYEeeDFemavCBnwh2AZZ2VlgQVrsx48",
  projectId: "museum-reservation",
  messagingSenderId: "254193649769",
  authDomain: "museum-reservation.firebaseapp.com",
  storageBucket: "museum-reservation.appspot.com",
  appId: "1:254193649769:web:a1b2c3d4e5f6g7h8i9j0k1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };