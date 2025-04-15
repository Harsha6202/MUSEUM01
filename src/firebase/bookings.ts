import { db } from './config';
import { 
  collection, 
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { BookingDetails, Museum, TimeSlot } from '../types';

// Collection reference
const bookingsCollection = collection(db, 'bookings');

// Add a new booking
export const addBooking = async (booking: BookingDetails) => {
  try {
    const docRef = await addDoc(bookingsCollection, {
      ...booking,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...booking };
  } catch (error) {
    console.error("Error adding booking: ", error);
    throw error;
  }
};

// Set up real-time listener for all bookings
export const setupBookingsListener = (callback: (bookings: BookingDetails[]) => void) => {
  return onSnapshot(
    query(bookingsCollection, orderBy('createdAt', 'desc')),
    (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BookingDetails[];
      callback(bookings);
    }
  );
};

// Set up real-time listener for date-specific bookings
export const setupDateBookingsListener = (date: string, callback: (bookings: BookingDetails[]) => void) => {
  return onSnapshot(
    query(bookingsCollection, where("date", "==", date)),
    (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BookingDetails[];
      callback(bookings);
    }
  );
};

// Get all bookings
export const getAllBookings = async () => {
  try {
    const querySnapshot = await getDocs(
      query(bookingsCollection, orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BookingDetails[];
  } catch (error) {
    console.error("Error getting bookings: ", error);
    throw error;
  }
};

// Get bookings for a specific date
export const getBookingsByDate = async (date: string) => {
  try {
    const querySnapshot = await getDocs(
      query(bookingsCollection, where("date", "==", date))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BookingDetails[];
  } catch (error) {
    console.error("Error getting bookings by date: ", error);
    throw error;
  }
};

// Get bookings for a specific museum
export const getBookingsByMuseum = async (museumId: string) => {
  try {
    const querySnapshot = await getDocs(
      query(bookingsCollection, where("museum.id", "==", museumId))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BookingDetails[];
  } catch (error) {
    console.error("Error getting bookings by museum: ", error);
    throw error;
  }
};

// Get bookings for a specific date and museum
export const getBookingsByDateAndMuseum = async (date: string, museumId: string) => {
  try {
    const querySnapshot = await getDocs(
      query(
        bookingsCollection, 
        where("date", "==", date),
        where("museum.id", "==", museumId)
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BookingDetails[];
  } catch (error) {
    console.error("Error getting bookings by date and museum: ", error);
    throw error;
  }
};

// Get available time slots for a specific date and museum
export const getAvailableTimeSlots = async (date: string, museum: Museum): Promise<TimeSlot[]> => {
  try {
    const bookings = await getBookingsByDateAndMuseum(date, museum.id);
    
    // Calculate booked visitors for each time slot
    const bookedVisitorsBySlot: Record<string, number> = {};
    
    bookings.forEach(booking => {
      if (booking.time) {
        const visitorCount = Object.values(booking.visitors).reduce((sum, count) => sum + count, 0);
        bookedVisitorsBySlot[booking.time] = (bookedVisitorsBySlot[booking.time] || 0) + visitorCount;
      }
    });
    
    // Create time slots with availability information
    return museum.timeSlots.map(time => {
      const bookedVisitors = bookedVisitorsBySlot[time] || 0;
      const availableSpots = museum.capacity - bookedVisitors;
      
      return {
        time,
        available: availableSpots,
        total: museum.capacity,
        isAvailable: availableSpots > 0
      };
    });
  } catch (error) {
    console.error("Error getting available time slots: ", error);
    throw error;
  }
};

// Get recent bookings for admin dashboard
export const getRecentBookings = async (limitCount: number = 10) => {
  try {
    const querySnapshot = await getDocs(
      query(
        bookingsCollection, 
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BookingDetails[];
  } catch (error) {
    console.error("Error getting recent bookings: ", error);
    throw error;
  }
};

// Get booking statistics for admin dashboard
export const setupBookingStatsListener = (callback: (stats: {
  totalBookings: number;
  totalRevenue: number;
  todayBookings: number;
  todayRevenue: number;
}) => void) => {
  return onSnapshot(bookingsCollection, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as BookingDetails[];
    
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(booking => booking.date === today);
    
    callback({
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
      todayBookings: todayBookings.length,
      todayRevenue: todayBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
    });
  });
};

// Update a booking
export const updateBooking = async (id: string, data: Partial<BookingDetails>) => {
  try {
    const bookingRef = doc(bookingsCollection, id);
    await updateDoc(bookingRef, data);
    return { id, ...data };
  } catch (error) {
    console.error("Error updating booking: ", error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (id: string) => {
  try {
    const bookingRef = doc(bookingsCollection, id);
    await deleteDoc(bookingRef);
    return id;
  } catch (error) {
    console.error("Error deleting booking: ", error);
    throw error;
  }
};