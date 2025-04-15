import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hiTranslations from './translations/hi.json';
import bnTranslations from './translations/bn.json';
import taTranslations from './translations/ta.json';
import teTranslations from './translations/te.json';
import mrTranslations from './translations/mr.json';

const enTranslations = {
  timings: {
    title: "Museum Timings & Information",
    subtitle: "Plan your visit to India's most prestigious museums",
    importantNotice: "Important Notice",
    holidayNotice: "Closed on national holidays. Special exhibitions may have different timings.",
    entryFees: "Entry Fees"
  },
  about: {
    title: "About Indian Museums",
    subtitle: "Preserving and showcasing India's rich cultural heritage through our network of prestigious museums.",
    mission: {
      title: "Our Mission",
      description: "To preserve, protect, and promote India's cultural heritage by maintaining world-class museums that educate and inspire visitors from around the globe. We strive to make our collections accessible to everyone while ensuring their preservation for future generations."
    },
    vision: {
      title: "Our Vision",
      description: "To be the leading cultural institution in Asia, recognized globally for excellence in preservation, education, and presentation of India's rich historical and cultural heritage, while embracing modern technology and innovative practices."
    },
    features: {
      title: "What Sets Us Apart",
      history: {
        title: "Rich History",
        description: "Over 100 years of experience in preserving India's cultural heritage"
      },
      curators: {
        title: "Expert Curators",
        description: "Dedicated team of experienced curators and historians"
      },
      awards: {
        title: "Award Winning",
        description: "Recognized globally for excellence in museum management"
      },
      facilities: {
        title: "Modern Facilities",
        description: "State-of-the-art conservation and display facilities"
      }
    },
    stats: {
      visitors: "Annual Visitors",
      artifacts: "Artifacts",
      staff: "Expert Staff",
      years: "Years of Excellence"
    },
    team: {
      title: "Our Leadership Team"
    }
  },
  contact: {
    title: "Contact Us",
    subtitle: "Get in touch with us for any queries or assistance",
    info: {
      title: "Contact Information",
      address: {
        title: "Address"
      },
      phone: {
        title: "Phone",
        tollFree: "Toll Free"
      },
      email: {
        title: "Email"
      },
      hours: {
        title: "Working Hours",
        weekdays: "Monday - Friday: 9:00 AM - 5:00 PM",
        weekends: "Saturday - Sunday: 10:00 AM - 2:00 PM"
      }
    },
    form: {
      title: "Send us a Message",
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      sent: "Message Sent!"
    }
  },
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
    },
    conversation: {
      greeting: "Hello! I'm your museum booking assistant. I can help you book tickets, check museum timings, or answer any questions you have.",
      nameAsk: "To get started, may I know your name?",
      nameConfirm: "Nice to meet you, {{name}}! How can I assist you today?",
      emailAsk: "Could you please share your email address for the booking confirmation?",
      emailConfirm: "Thank you! I'll send the booking confirmation to {{email}}.",
      phoneAsk: "Could I have your phone number for important updates about your visit?",
      phoneConfirm: "Perfect! I'll send any important updates to {{phone}}.",
      museumSelect: "Which museum would you like to visit? I can help you choose based on your interests.",
      dateAsk: "When would you like to visit? I can show you available dates and peak times.",
      visitorAsk: "How many visitors will be joining? We have special rates for children and seniors.",
      confirmBooking: "Great! I've got all the details. Would you like to proceed with the booking?",
      paymentPrompt: "Please select your preferred payment method to complete the booking.",
      bookingSuccess: "Wonderful! Your booking is confirmed. I've sent the details to your email.",
      helpOffer: "Is there anything else you'd like to know about your visit?"
    },
    errors: {
      invalidName: "I didn't quite catch that. Could you please provide your full name?",
      invalidEmail: "That email address doesn't look quite right. Could you please check and try again?",
      invalidPhone: "I need a valid phone number to proceed. Please provide a number with country code.",
      bookingFailed: "I apologize, but I couldn't complete the booking. Shall we try again?"
    },
    buttons: {
      start: "Start Booking",
      continue: "Continue",
      modify: "Modify Details",
      confirm: "Confirm",
      cancel: "Cancel"
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
    lng: localStorage.getItem('museum-reservation_language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'museum-reservation_language'
    }
  });

export default i18n;
