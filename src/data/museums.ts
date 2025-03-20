import { Museum } from '../types';

export const museums: Museum[] = [
  {
    id: '1',
    name: 'National Museum',
    description: "India's premier cultural institution housing a vast collection of artifacts.",
    location: 'New Delhi',
    state: 'Delhi',
    basePrice: 50,
    imageUrl: 'https://images.unsplash.com/photo-1609602644879-dd158c2b56b4',
    openingHours: '10:00 AM - 6:00 PM',
    capacity: 500,
    currentVisitors: 0,
    timeSlots: [
      '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
      '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ],
    pricing: {
      adult: 150,
      child: 50,
      senior: 75,
      tourist: 300
    },
    analytics: {
      dailyVisitors: 450,
      peakHours: ['11:00 AM', '2:00 PM'],
      popularExhibits: ['Ancient India', 'Buddhist Art'],
      averageVisitDuration: 120
    }
  },
  {
    id: '2',
    name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
    description: 'Former Prince of Wales Museum showcasing Indian history and culture.',
    location: 'Mumbai',
    state: 'Maharashtra',
    basePrice: 85,
    imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445',
    openingHours: '10:30 AM - 6:00 PM',
    capacity: 400,
    currentVisitors: 0,
    timeSlots: [
      '10:30 AM', '11:30 AM', '12:30 PM', '1:30 PM',
      '2:30 PM', '3:30 PM', '4:30 PM', '5:30 PM'
    ],
    pricing: {
      adult: 200,
      child: 75,
      senior: 100,
      tourist: 400
    },
    analytics: {
      dailyVisitors: 380,
      peakHours: ['12:30 PM', '3:30 PM'],
      popularExhibits: ['Maratha History', 'Maritime Heritage'],
      averageVisitDuration: 150
    }
  },
  {
    id: '3',
    name: 'Indian Museum',
    description: 'The oldest and largest museum in India with rare collections.',
    location: 'Kolkata',
    state: 'West Bengal',
    basePrice: 40,
    imageUrl: 'https://images.unsplash.com/photo-1569587112025-0d460e81a126',
    openingHours: '10:00 AM - 5:00 PM',
    capacity: 300,
    currentVisitors: 0,
    timeSlots: [
      '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
      '2:00 PM', '3:00 PM', '4:00 PM'
    ],
    pricing: {
      adult: 100,
      child: 40,
      senior: 60,
      tourist: 200
    },
    analytics: {
      dailyVisitors: 280,
      peakHours: ['11:00 AM', '2:00 PM'],
      popularExhibits: ['Bengal School', 'Natural History'],
      averageVisitDuration: 90
    }
  },
  {
    id: '4',
    name: 'Salar Jung Museum',
    description: 'One of the largest museums in the world featuring personal art collections.',
    location: 'Hyderabad',
    state: 'Telangana',
    basePrice: 65,
    imageUrl: 'https://images.unsplash.com/photo-1584037618503-6140c67e9edc',
    openingHours: '10:00 AM - 5:00 PM',
    capacity: 350,
    currentVisitors: 0,
    timeSlots: [
      '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
      '2:00 PM', '3:00 PM', '4:00 PM'
    ],
    pricing: {
      adult: 150,
      child: 60,
      senior: 80,
      tourist: 300
    },
    analytics: {
      dailyVisitors: 320,
      peakHours: ['12:00 PM', '3:00 PM'],
      popularExhibits: ['Islamic Art', 'European Galleries'],
      averageVisitDuration: 180
    }
  }
];