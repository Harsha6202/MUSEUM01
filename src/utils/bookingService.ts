import { BookingDetails, Museum, TimeSlot } from '../types';
import { 
  addBooking as addFirebaseBooking,
  getAllBookings as getFirebaseBookings,
  getBookingsByDate as getFirebaseBookingsByDate,
  getBookingsByMuseum as getFirebaseBookingsByMuseum,
  getBookingsByDateAndMuseum as getFirebaseBookingsByDateAndMuseum,
  getAvailableTimeSlots as getFirebaseAvailableTimeSlots,
  updateBooking as updateFirebaseBooking,
  deleteBooking as deleteFirebaseBooking
} from '../firebase/bookings';

// Add a new booking
export const addBooking = async (booking: BookingDetails): Promise<BookingDetails> => {
  try {
    return await addFirebaseBooking(booking);
  } catch (error) {
    console.error("Error adding booking: ", error);
    throw error;
  }
};

// Get all bookings
export const getAllBookings = async (): Promise<BookingDetails[]> => {
  try {
    return await getFirebaseBookings();
  } catch (error) {
    console.error("Error getting bookings: ", error);
    throw error;
  }
};

// Get bookings for a specific date
export const getBookingsByDate = async (date: string): Promise<BookingDetails[]> => {
  try {
    return await getFirebaseBookingsByDate(date);
  } catch (error) {
    console.error("Error getting bookings by date: ", error);
    throw error;
  }
};

// Get bookings for a specific museum
export const getBookingsByMuseum = async (museumId: string): Promise<BookingDetails[]> => {
  try {
    return await getFirebaseBookingsByMuseum(museumId);
  } catch (error) {
    console.error("Error getting bookings by museum: ", error);
    throw error;
  }
};

// Get bookings for a specific date and museum
export const getBookingsByDateAndMuseum = async (date: string, museumId: string): Promise<BookingDetails[]> => {
  try {
    return await getFirebaseBookingsByDateAndMuseum(date, museumId);
  } catch (error) {
    console.error("Error getting bookings by date and museum: ", error);
    throw error;
  }
};

// Get available time slots for a specific date and museum
export const getAvailableTimeSlots = async (date: string, museum: Museum): Promise<TimeSlot[]> => {
  try {
    return await getFirebaseAvailableTimeSlots(date, museum);
  } catch (error) {
    console.error("Error getting available time slots: ", error);
    throw error;
  }
};

// Update a booking
export const updateBooking = async (id: string, data: Partial<BookingDetails>): Promise<BookingDetails> => {
  try {
    const result = await updateFirebaseBooking(id, data);
    return result as BookingDetails;
  } catch (error) {
    console.error("Error updating booking: ", error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (id: string): Promise<string> => {
  try {
    return await deleteFirebaseBooking(id);
  } catch (error) {
    console.error("Error deleting booking: ", error);
    throw error;
  }
};

export const getBookingStats = async (): Promise<{
  totalBookings: number;
  totalRevenue: number;
  todayBookings: number;
  todayRevenue: number;
  visitorMetrics: { daily: number; weekly: number; monthly: number };
  peakTimes: string[];
  popularMuseums: { name: string; bookings: number }[];
}> => {
  try {
    const allBookings = await getAllBookings();
    if (!Array.isArray(allBookings)) {
      throw new Error('Invalid bookings data received');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Filter valid bookings with proper date and visitor data
    const validBookings = allBookings.filter(booking => 
      booking && 
      booking.date && 
      booking.visitors && 
      typeof booking.visitors === 'object' && 
      booking.totalAmount !== undefined
    );

    const todayBookings = validBookings.filter(booking => booking.date === todayStr);

    // Calculate visitor count for a booking
    const getVisitorCount = (visitors: BookingDetails['visitors']): number => {
      return Object.values(visitors).reduce((sum, count) => 
        sum + (typeof count === 'number' ? count : 0), 0
      );
    };

    // Calculate time-based visitor metrics
    const calculateTimeBasedVisitors = (bookings: BookingDetails[], startDate: Date): number => {
      return bookings
        .filter(booking => {
          const bookingDate = new Date(booking.date!);
          return bookingDate >= startDate && bookingDate <= today;
        })
        .reduce((sum, booking) => sum + getVisitorCount(booking.visitors), 0);
    };

    // Calculate peak times
    const timeSlotCounts = validBookings.reduce((acc, booking) => {
      if (booking.time) {
        acc[booking.time] = (acc[booking.time] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const peakTimes = Object.entries(timeSlotCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([time]) => time);

    // Calculate popular museums
    const museumCounts = validBookings.reduce((acc, booking) => {
      if (booking.museum?.name) {
        acc[booking.museum.name] = (acc[booking.museum.name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const popularMuseums = Object.entries(museumCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, bookings]) => ({ name, bookings }));

    // Calculate time ranges for metrics
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    return {
      totalBookings: validBookings.length,
      totalRevenue: validBookings.reduce((sum, booking) => 
        sum + (typeof booking.totalAmount === 'number' ? booking.totalAmount : 0), 0
      ),
      todayBookings: todayBookings.length,
      todayRevenue: todayBookings.reduce((sum, booking) => 
        sum + (typeof booking.totalAmount === 'number' ? booking.totalAmount : 0), 0
      ),
      visitorMetrics: {
        daily: todayBookings.reduce((sum, booking) => 
          sum + getVisitorCount(booking.visitors), 0
        ),
        weekly: calculateTimeBasedVisitors(validBookings, weekAgo),
        monthly: calculateTimeBasedVisitors(validBookings, monthAgo)
      },
      peakTimes,
      popularMuseums
    };
  } catch (error) {
    console.error("Error getting booking stats: ", error);
    throw new Error('Failed to calculate booking statistics');
  }
};