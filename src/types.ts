import { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  options?: string[];
  showCalendar?: boolean;
  showTimeSlots?: boolean;
  showMuseums?: boolean;
  component?: 'initial' | 'museumSelection' | 'visitorSelection' | 'analytics' | 'timeSlots' | 'bookingConfirmation';
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export interface Museum {
  id: string;
  name: string;
  description: string;
  location: string;
  basePrice: number;
  imageUrl: string;
  openingHours: string;
  state: string;
  timeSlots: string[];
  capacity: number;
  currentVisitors: number;
  pricing: {
    adult: number;
    child: number;
    senior: number;
    tourist: number;
  };
  analytics?: {
    dailyVisitors: number;
    peakHours: string[];
    popularExhibits: string[];
    averageVisitDuration: number;
  };
}

export interface BookingDetails {
  id?: string;
  name: string;
  email: string;
  museum?: Museum;
  date?: string;
  time?: string;
  visitors: {
    adult: number;
    child: number;
    senior: number;
    tourist: number;
  };
  totalAmount: number;
  paymentStatus: 'completed' | 'failed';
  ticketNumber?: string;
  createdAt?: string;
  specialRequirements?: string;
  language?: string;
  guidedTour?: boolean;
  audioGuide?: boolean;
}

export interface TimeSlot {
  time: string;
  available: number;
  total: number;
  isAvailable: boolean;
}