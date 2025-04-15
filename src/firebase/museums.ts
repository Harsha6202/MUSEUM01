import { db } from './config';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { Museum } from '../types';
import { museums as initialMuseums } from '../data/museums';

// Collection reference
const museumsCollection = collection(db, 'museums');

// Initialize museums in Firestore
export const initializeMuseums = async () => {
  try {
    const snapshot = await getDocs(museumsCollection);
    
    if (snapshot.empty) {
      const promises = initialMuseums.map(museum => 
        setDoc(doc(museumsCollection, museum.id), museum)
      );
      
      await Promise.all(promises);
      console.log("Museums initialized in Firestore");
    }
  } catch (error) {
    console.error("Error initializing museums: ", error);
  }
};

// Set up real-time listener for museums using Firestore
export const setupMuseumsListener = (callback: (museums: Museum[]) => void) => {
  return onSnapshot(museumsCollection, (snapshot) => {
    const museums = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Museum[];
    callback(museums);
  });
};

// Get all museums
export const getAllMuseums = async (): Promise<Museum[]> => {
  try {
    const querySnapshot = await getDocs(museumsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Museum[];
  } catch (error) {
    console.error("Error getting museums: ", error);
    return initialMuseums;
  }
};

// Get a museum by ID
export const getMuseumById = async (id: string): Promise<Museum | null> => {
  try {
    const museumDoc = await getDoc(doc(museumsCollection, id));
    
    if (museumDoc.exists()) {
      return { id: museumDoc.id, ...museumDoc.data() } as Museum;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting museum: ", error);
    return initialMuseums.find(m => m.id === id) || null;
  }
};

// Get museums by state
export const getMuseumsByState = async (state: string): Promise<Museum[]> => {
  try {
    const q = query(museumsCollection, where("state", "==", state));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Museum[];
  } catch (error) {
    console.error("Error getting museums by state: ", error);
    return initialMuseums.filter(m => m.state === state);
  }
};

// Update museum
export const updateMuseum = async (id: string, data: Partial<Museum>): Promise<void> => {
  try {
    const museumRef = doc(museumsCollection, id);
    await updateDoc(museumRef, data);
  } catch (error) {
    console.error("Error updating museum: ", error);
    throw error;
  }
};

// Update current visitor count
export const updateCurrentVisitors = async (id: string, count: number): Promise<void> => {
  try {
    const museumRef = doc(museumsCollection, id);
    await updateDoc(museumRef, { currentVisitors: count });
  } catch (error) {
    console.error("Error updating visitor count: ", error);
    throw error;
  }
};