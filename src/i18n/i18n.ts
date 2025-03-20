import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hiTranslations from './translations/hi.json';
import bnTranslations from './translations/bn.json';
import taTranslations from './translations/ta.json';
import teTranslations from './translations/te.json';
import mrTranslations from './translations/mr.json';

const enTranslations = {
  chatbot: {
    title: "Museum Booking Assistant",
    typing: "Assistant is typing...",
    inputPlaceholder: "Type your message here...",
    emailPrompt: "Please enter your email address:",
    invalidEmail: "Please enter a valid email address.",
    museumPrompt: "Please select a museum to visit:",
    unhandledResponse: "I'm not sure how to help with that. Would you like to start booking tickets?",
    suggestions: {
      booking: "Book tickets",
      info: "Museum information",
      contact: "Contact support",
      faq: "FAQ"
    }
  },
  welcome: "Hello! Welcome to the Museum Ticket Booking Assistant. How can I help you today?",
  greetUser: "Nice to meet you, {{name}}! How can I assist you today?",
  bookingQuestion: "Would you like to book museum tickets?",
  dateQuestion: "For which date would you like to book your visit?",
  ticketTypeQuestion: "How many tickets do you need, and for which age group?",
  ageGroups: {
    adult: "Adult",
    child: "Child",
    senior: "Senior",
    tourist: "Tourist"
  },
  tourQuestion: "Would you like to add any guided tours or special exhibit access?",
  totalPrice: "Your total price is ₹{{amount}}. Would you like to proceed with the payment?",
  paymentMethod: "Please choose your payment method:",
  paymentProcessing: "Processing your payment... Please wait.",
  paymentSuccess: "Payment successful! Your booking has been confirmed.",
  deliveryMethod: "Would you like to receive your ticket via email or SMS?",
  ticketGenerated: "Here is your e-ticket:",
  ticketInstructions: "Please present this ticket at the museum entrance. Enjoy your visit!",
  helpQuestion: "Can I help you with anything else today, {{name}}?",
  thankYou: "Thank you for using the Museum Ticket Booking Assistant. Have a great visit!",
  typeMessage: "Type your message or select an option below...",
  quickReplies: {
    bookTickets: "Book Tickets",
    checkAvailability: "Check Availability",
    viewPricing: "View Pricing",
    contactSupport: "Contact Support"
  },
  navigation: {
    home: "Home",
    exhibitions: "Exhibitions",
    planVisit: "Plan Your Visit",
    about: "About",
    contact: "Contact",
    admin: "Admin",
    bookNow: "Book Now"
  },
  homepage: {
    hero: {
      title: "Discover Our Rich Cultural Heritage",
      subtitle: "Experience the beauty of art, history, and culture at the National Museum.",
      bookTickets: "Book Tickets"
    },
    info: {
      openingHours: {
        title: "Opening Hours",
        weekdays: "Tuesday - Sunday: 10:00 AM - 6:00 PM",
        monday: "Monday: Closed"
      },
      ticketPrices: {
        title: "Ticket Prices",
        adult: "Adults: ₹200",
        student: "Students: ₹100",
        children: "Children (under 12): Free"
      },
      location: {
        title: "Location",
        address: "123 Heritage Road",
        city: "New Delhi, 110001",
        country: "India"
      }
    }
  },
  options: {
    yes: "Yes",
    no: "No",
    email: "Email",
    sms: "SMS",
    guidedTour: "Add Guided Tour",
    specialExhibit: "Special Exhibit Access",
    proceed: "Proceed to Payment",
    cancel: "Cancel"
  },
  payment: {
    methods: {
      card: "Credit/Debit Card",
      upi: "UPI",
      wallet: "Digital Wallet"
    },
    amount: "Total Amount",
    processing: "Processing Payment",
    success: "Payment Successful",
    failed: "Payment Failed"
  },
  ticket: {
    title: "E-Ticket",
    number: "Ticket Number",
    date: "Visit Date",
    time: "Visit Time",
    museum: "Museum",
    visitors: "Number of Visitors",
    type: "Ticket Type",
    addons: "Add-ons",
    amount: "Amount Paid",
    print: "Print Ticket",
    qrCode: "Show QR Code"
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      hi: {
        translation: hiTranslations
      },
      bn: {
        translation: bnTranslations
      },
      ta: {
        translation: taTranslations
      },
      te: {
        translation: teTranslations
      },
      mr: {
        translation: mrTranslations
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;