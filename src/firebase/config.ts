import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDJjlFiJbSJMJFumYS0PY5URx_sCB5YjfE",
  authDomain: "museum-reservation-default.firebaseapp.com",
  databaseURL: "https://museum-reservation-default-rtdb.firebaseio.com",
  projectId: "museum-reservation",
  storageBucket: "museum-reservation.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };