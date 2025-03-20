import { BookingDetails, AnalyticsData, Museum } from '../types';

export function generateAnalytics(bookings: BookingDetails[]): AnalyticsData {
  const totalBookings = bookings.length;
  let totalVisitors = 0;
  let totalRevenue = 0;
  const visitorDemographics = {
    adults: 0,
    children: 0,
    seniors: 0,
    tourists: 0
  };
  const timeSlotCounts: { [key: string]: number } = {};

  bookings.forEach(booking => {
    // Count visitors
    const visitors = booking.visitors;
    totalVisitors += Object.values(visitors).reduce((a, b) => a + b, 0);
    
    // Add to demographics
    visitorDemographics.adults += visitors.adult;
    visitorDemographics.children += visitors.child;
    visitorDemographics.seniors += visitors.senior;
    visitorDemographics.tourists += visitors.tourist;

    // Add revenue
    totalRevenue += booking.totalAmount;

    // Count time slots
    if (booking.time) {
      timeSlotCounts[booking.time] = (timeSlotCounts[booking.time] || 0) + 1;
    }
  });

  // Find popular time slots
  const popularTimeSlots = Object.entries(timeSlotCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([time]) => time);

  return {
    visitorCount: totalVisitors,
    revenue: totalRevenue,
    bookingConversion: (totalBookings / 100) * 100, // Assuming 100 website visits
    averageGroupSize: totalVisitors / totalBookings || 0,
    popularTimeSlots,
    visitorDemographics
  };
}

export function getAvailableTimeSlots(museum: Museum, date: string, existingBookings: BookingDetails[]) {
  return museum.timeSlots.map(time => {
    const bookingsForSlot = existingBookings.filter(
      booking => booking.date === date && booking.time === time
    );

    const bookedVisitors = bookingsForSlot.reduce((total, booking) => 
      total + Object.values(booking.visitors).reduce((a, b) => a + b, 0), 0
    );

    const available = museum.capacity - bookedVisitors;

    return {
      time,
      available,
      total: museum.capacity,
      isAvailable: available > 0
    };
  });
}

export function generateVisitorInsights(bookings: BookingDetails[]) {
  const insights = {
    peakDays: new Set<string>(),
    averageGroupSize: 0,
    popularMuseums: new Map<string, number>(),
    visitorTrends: {
      weekday: 0,
      weekend: 0
    }
  };

  bookings.forEach(booking => {
    if (booking.date) {
      const date = new Date(booking.date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      if (isWeekend) {
        insights.visitorTrends.weekend++;
      } else {
        insights.visitorTrends.weekday++;
      }

      const totalVisitors = Object.values(booking.visitors).reduce((a, b) => a + b, 0);
      if (totalVisitors > 10) {
        insights.peakDays.add(booking.date);
      }

      if (booking.museum) {
        const current = insights.popularMuseums.get(booking.museum.id) || 0;
        insights.popularMuseums.set(booking.museum.id, current + totalVisitors);
      }
    }
  });

  insights.averageGroupSize = bookings.reduce((acc, booking) => {
    const groupSize = Object.values(booking.visitors).reduce((a, b) => a + b, 0);
    return acc + groupSize;
  }, 0) / bookings.length;

  return insights;
}