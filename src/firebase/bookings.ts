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
  getDoc,
  deleteDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { BookingDetails, Museum, TimeSlot } from '../types';

// Collection references
const bookingsCollection = collection(db, 'bookings');
const museumsCollection = collection(db, 'museums');

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
export const getRecentBookings = async (limit: number = 10) => {
  try {
    const querySnapshot = await getDocs(
      query(
        bookingsCollection, 
        orderBy('createdAt', 'desc'),
        limit(limit)
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
export const getBookingStats = async () => {
  try {
    const allBookings = await getAllBookings();
    
    // Calculate total revenue
    const totalRevenue = allBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    // Get today's bookings
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = allBookings.filter(booking => booking.date === today);
    const todayRevenue = todayBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    return {
      totalBookings: allBookings.length,
      totalRevenue,
      todayBookings: todayBookings.length,
      todayRevenue
    };
  } catch (error) {
    console.error("Error getting booking stats: ", error);
    throw error;
  }
};

// Update a booking
export const updateBooking = async (id: string, data: Partial<BookingDetails>) => {
  try {
    const bookingRef = doc(db, 'bookings', id);
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
    const bookingRef = doc(db, 'bookings', id);
    await deleteDoc(bookingRef);
    return id;
  } catch (error) {
    console.error("Error deleting booking: ", error);
    throw error;
  }
};