import { BookingDetails, Museum, TimeSlot } from '../types';

// Local storage keys
const BOOKINGS_STORAGE_KEY = 'museum_bookings';

// Helper to get bookings from local storage
const getStoredBookings = (): BookingDetails[] => {
  const storedData = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

// Helper to save bookings to local storage
const saveBookingsToStorage = (bookings: BookingDetails[]) => {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
};

// Add a new booking
export const addBooking = async (booking: BookingDetails): Promise<BookingDetails> => {
  try {
    const bookings = getStoredBookings();
    const newBooking = {
      ...booking,
      id: `booking_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    saveBookingsToStorage(bookings);
    
    return newBooking;
  } catch (error) {
    console.error("Error adding booking: ", error);
    throw error;
  }
};

// Get all bookings
export const getAllBookings = async (): Promise<BookingDetails[]> => {
  try {
    return getStoredBookings().sort((a, b) => {
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    });
  } catch (error) {
    console.error("Error getting bookings: ", error);
    throw error;
  }
};

// Get bookings for a specific date
export const getBookingsByDate = async (date: string): Promise<BookingDetails[]> => {
  try {
    const bookings = getStoredBookings();
    return bookings.filter(booking => booking.date === date);
  } catch (error) {
    console.error("Error getting bookings by date: ", error);
    throw error;
  }
};

// Get bookings for a specific museum
export const getBookingsByMuseum = async (museumId: string): Promise<BookingDetails[]> => {
  try {
    const bookings = getStoredBookings();
    return bookings.filter(booking => booking.museum?.id === museumId);
  } catch (error) {
    console.error("Error getting bookings by museum: ", error);
    throw error;
  }
};

// Get bookings for a specific date and museum
export const getBookingsByDateAndMuseum = async (date: string, museumId: string): Promise<BookingDetails[]> => {
  try {
    const bookings = getStoredBookings();
    return bookings.filter(
      booking => booking.date === date && booking.museum?.id === museumId
    );
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
    
    // Create time slots with availability information, limiting to 100 spots
    return museum.timeSlots.map(time => {
      const bookedVisitors = bookedVisitorsBySlot[time] || 0;
      const maxCapacity = Math.min(museum.capacity, 100); // Limit to 100 spots
      const availableSpots = maxCapacity - bookedVisitors;
      
      return {
        time,
        available: availableSpots,
        total: maxCapacity,
        isAvailable: availableSpots > 0
      };
    });
  } catch (error) {
    console.error("Error getting available time slots: ", error);
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
export const updateBooking = async (id: string, data: Partial<BookingDetails>): Promise<BookingDetails> => {
  try {
    const bookings = getStoredBookings();
    const index = bookings.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    const updatedBooking = { ...bookings[index], ...data };
    bookings[index] = updatedBooking;
    saveBookingsToStorage(bookings);
    
    return updatedBooking;
  } catch (error) {
    console.error("Error updating booking: ", error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (id: string): Promise<string> => {
  try {
    const bookings = getStoredBookings();
    const filteredBookings = bookings.filter(booking => booking.id !== id);
    
    if (filteredBookings.length === bookings.length) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    saveBookingsToStorage(filteredBookings);
    return id;
  } catch (error) {
    console.error("Error deleting booking: ", error);
    throw error;
  }
};