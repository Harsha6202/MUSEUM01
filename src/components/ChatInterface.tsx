import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Calendar as CalendarIcon,
  MessageCircle,
  Clock,
  Check,
  Loader,
  IndianRupee,
  User,
  Mail,
  Phone,
  Printer,
  Bot,
  Sparkles,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import Calendar from './Calendar';
import LanguageSelector from './LanguageSelector';
import PaymentDetailsComponent from './PaymentDetailsComponent';
import { Message, Museum, TimeSlot, BookingDetails } from '../types';
import { museums } from '../data/museums';
import { getAvailableTimeSlots, addBooking } from '../utils/bookingService';

const typingConfig = {
  initialDelay: 500,
  characterDelay: 20,
  lineDelay: 500,
};

interface ChatInterfaceProps {
  onBookingComplete?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBookingComplete }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingState, setBookingState] = useState<{
    userName: string;
    userEmail: string;
    userPhone: string;
    visitors: {
      adult: number;
      child: number;
      senior: number;
      tourist: number;
    };
    stage:
      | 'initial'
      | 'name'
      | 'email'
      | 'phone'
      | 'museum'
      | 'date'
      | 'time'
      | 'visitors'
      | 'payment'
      | 'complete';
  }>({
    userName: '',
    userEmail: '',
    userPhone: '',
    visitors: { adult: 0, child: 0, senior: 0, tourist: 0 },
    stage: 'initial',
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `msg_${Date.now()}_${messageIdCounter.current}`;
  };

  useEffect(() => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages([
        {
          id: generateMessageId(),
          type: 'bot',
          content: t('chatbot.conversation.greeting'),
          component: 'initial',
        },
        {
          id: generateMessageId(),
          type: 'bot',
          content: t('chatbot.conversation.nameAsk'),
        },
      ]);
      setIsTyping(false);
      setBookingState(prev => ({ ...prev, stage: 'name' }));
    }, 1000);
  }, [t, i18n.language]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateTyping = async (content: string, onComplete: () => void) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, typingConfig.initialDelay));

    const lines = content.split('\n');
    let currentText = '';

    for (let line of lines) {
      for (let char of line) {
        currentText += char;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.type === 'bot') {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: currentText }
            ];
          }
          return prev;
        });
        await new Promise(resolve => setTimeout(resolve, typingConfig.characterDelay));
      }
      currentText += '\n';
      await new Promise(resolve => setTimeout(resolve, typingConfig.lineDelay));
    }

    setIsTyping(false);
    onComplete();
  };

  const addBotMessage = (content: string, component?: string, delay: number = 500) => {
    setTimeout(() => {
      const messageId = generateMessageId();
      setMessages(prev => [
        ...prev,
        { id: messageId, type: 'bot', content: '', component: component as any }
      ]);

      simulateTyping(content, () => {
        // Add any post-message animations or effects here
      });
    }, delay);
  };

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;

    // Handle post-booking options
    if (input === t('chatbot.buttons.bookAgain')) {
      // Reset booking state
      setBookingState({
        userName: '',
        userEmail: '',
        userPhone: '',
        visitors: { adult: 0, child: 0, senior: 0, tourist: 0 },
        stage: 'initial'
      });

      // Restart conversation
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: generateMessageId(),
            type: 'bot',
            content: t('chatbot.conversation.greeting'),
            component: 'initial',
          },
          {
            id: generateMessageId(),
            type: 'bot',
            content: t('chatbot.conversation.nameAsk'),
          },
        ]);
        setIsTyping(false);
        setBookingState(prev => ({ ...prev, stage: 'name' }));
      }, 1000);
      return;
    } else if (input === t('chatbot.buttons.returnHome')) {
      if (onBookingComplete) {
        onBookingComplete();
      }
      return;
    }

    const userMessageId = generateMessageId();
    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        type: 'user',
        content: input,
      }
    ]);
    setInputValue('');

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (bookingState.stage) {
      case 'name':
        handleNameSubmit(input);
        break;
      case 'email':
        handleEmailStep(input);
        break;
      case 'phone':
        handlePhoneStep(input);
        break;
      default:
        addBotMessage(t('chatbot.unhandledResponse'));
    }
  };

  const handleNameSubmit = (name: string) => {
    if (name.trim().length < 2) {
      setInputError(t('chatbot.errors.invalidName'));
      addBotMessage(t('chatbot.errors.invalidName'));
      return;
    }

    setBookingState((prev) => ({ ...prev, userName: name, stage: 'email' }));
    setInputError('');
    addBotMessage(t('chatbot.conversation.nameConfirm', { name }));
    setTimeout(() => {
      addBotMessage(t('chatbot.conversation.emailAsk'), 'emailInput');
    }, 1000);
  };

  const handleEmailStep = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setInputError(t('chatbot.errors.invalidEmail'));
      addBotMessage(t('chatbot.errors.invalidEmail'));
      return;
    }

    setBookingState((prev) => ({ ...prev, userEmail: email, stage: 'phone' }));
    setInputError('');
    addBotMessage(t('chatbot.conversation.emailConfirm', { email }));
    setTimeout(() => {
      addBotMessage(t('chatbot.conversation.phoneAsk'), 'phoneInput');
    }, 1000);
  };

  const handlePhoneStep = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(phone)) {
      setInputError(t('chatbot.errors.invalidPhone'));
      addBotMessage(t('chatbot.errors.invalidPhone'));
      return;
    }

    setBookingState((prev) => ({ ...prev, userPhone: phone, stage: 'museum' }));
    setInputError('');
    addBotMessage(t('chatbot.conversation.phoneConfirm', { phone }));
    setTimeout(() => {
      addBotMessage(t('chatbot.conversation.museumSelect'), 'museumSelection');
    }, 1000);
  };

  const handleMuseumSelect = async (museum: Museum) => {
    setSelectedMuseum(museum);
    setBookingState((prev) => ({ ...prev, stage: 'date' }));
    addBotMessage(t('chatbot.conversation.dateAsk'), 'dateSelection');
    setShowCalendar(true);
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);

    if (selectedMuseum) {
      const slots = await getAvailableTimeSlots(
        date.toISOString().split('T')[0],
        selectedMuseum
      );
      setAvailableTimeSlots(slots);
      setBookingState((prev) => ({ ...prev, stage: 'time' }));
      addBotMessage(t('Please select your preferred time:'), 'timeSelection');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
    setBookingState((prev) => ({ ...prev, stage: 'visitors' }));
    addBotMessage(t('chatbot.conversation.visitorAsk'), 'visitorSelection');
  };

  const handleVisitorCountUpdate = (
    type: keyof typeof bookingState.visitors,
    count: number
  ) => {
    setBookingState((prev) => ({
      ...prev,
      visitors: {
        ...prev.visitors,
        [type]: count,
      },
    }));
  };

  const handleVisitorConfirm = () => {
    const totalVisitors = Object.values(bookingState.visitors).reduce(
      (a, b) => a + b,
      0
    );
    if (totalVisitors > 0) {
      setBookingState((prev) => ({ ...prev, stage: 'payment' }));
      const total = calculateTotal(bookingState.visitors);
      addBotMessage(t('chatbot.conversation.confirmBooking'));
      addBotMessage(`${t('payment.amount')}: ₹${total}`, 'payment');
    } else {
      addBotMessage(t('Please select at least one visitor'), 'visitorSelection');
    }
  };

  const calculateTotal = (visitors: typeof bookingState.visitors) => {
    if (!selectedMuseum) return 0;
    return Object.entries(visitors).reduce((total, [type, count]) => {
      return (
        total +
        selectedMuseum.pricing[type as keyof typeof selectedMuseum.pricing] *
          count
      );
    }, 0);
  };

  const handlePaymentComplete = async () => {
    if (selectedMuseum && selectedDate && selectedTimeSlot) {
      try {
        const booking: BookingDetails = {
          name: bookingState.userName,
          email: bookingState.userEmail,
          phone: bookingState.userPhone,
          museum: selectedMuseum,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTimeSlot,
          visitors: bookingState.visitors,
          totalAmount: calculateTotal(bookingState.visitors),
          paymentStatus: 'completed',
          ticketNumber: `TKT${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        await addBooking(booking);
        setBookingState((prev) => ({ ...prev, stage: 'complete' }));
        addBotMessage(t('chatbot.conversation.bookingSuccess'), 'bookingConfirmation');

        if (onBookingComplete) {
          onBookingComplete();
        }
      } catch (error) {
        console.error('Error processing booking:', error);
        addBotMessage(t('chatbot.errors.bookingFailed'));
      }
    }
  };

  const handlePrintTicket = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && selectedMuseum && selectedDate && selectedTimeSlot) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${t('ticket.title')} - ${selectedMuseum.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
              }
              .ticket {
                border: 2px dashed #333;
                padding: 20px;
                border-radius: 10px;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .details {
                margin: 10px 0;
                line-height: 1.5;
              }
              .barcode {
                text-align: center;
                margin-top: 20px;
                font-size: 24px;
              }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="header">
                <h1>${selectedMuseum.name}</h1>
                <p>${t('ticket.title')}</p>
              </div>
              <div class="details">
                <p><strong>${t('ticket.visitors')}:</strong> ${bookingState.userName}</p>
                <p><strong>${t('ticket.email')}:</strong> ${bookingState.userEmail}</p>
                <p><strong>${t('ticket.phone')}:</strong> ${bookingState.userPhone}</p>
                <p><strong>${t('ticket.date')}:</strong> ${selectedDate.toLocaleDateString()}</p>
                <p><strong>${t('ticket.time')}:</strong> ${selectedTimeSlot}</p>
                <p><strong>${t('ticket.visitors')}:</strong></p>
                <ul>
                  ${Object.entries(bookingState.visitors)
                    .filter(([_, count]) => count > 0)
                    .map(([type, count]) => `<li>${t(`ageGroups.${type}`)}: ${count}</li>`)
                    .join('')}
                </ul>
                <p><strong>${t('ticket.amount')}:</strong> ₹${calculateTotal(
                  bookingState.visitors
                )}</p>
                <p><strong>${t('ticket.number')}:</strong> TKT${Date.now()}</p>
              </div>
              <div class="barcode">
                <span>🎟️ ${Math.random().toString(36).substring(2, 15)}</span>
              </div>
            </div>
            <script>
              window.print();
              setTimeout(() => window.close(), 1000);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const renderMessage = (message: Message) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] rounded-lg p-4 flex items-start gap-3 ${
        message.type === 'user'
          ? 'bg-blue-600 text-white'
          : 'bg-white shadow-sm'
      }`}>
        {message.type === 'bot' && (
          <Bot className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        )}
        <div>
          <p className="whitespace-pre-wrap">{message.content}</p>
          {message.component && renderComponent(message.component)}
        </div>
      </div>
    </motion.div>
  );

  const showSuccessAnimation = () => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white rounded-lg p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-12 h-12 text-green-500 mx-auto" />
        </motion.div>
        <p className="mt-4 text-lg font-medium">{t('chatbot.conversation.bookingSuccess')}</p>
      </div>
    </motion.div>
  );

  const renderComponent = (component: string) => {
    switch (component) {
      case 'initial':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => {
                addBotMessage(t('chatbot.conversation.nameAsk'));
                setBookingState((prev) => ({ ...prev, stage: 'name' }));
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>{t('chatbot.buttons.start')}</span>
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t('quickReplies.contactSupport')}</span>
            </button>
          </div>
        );

      case 'emailInput':
        return null; // Removed email help text

      case 'phoneInput':
        return null; // Removed phone help text

      case 'museumSelection':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {museums.map((museum) => (
              <button
                key={museum.id}
                onClick={() => handleMuseumSelect(museum)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all text-left"
              >
                <img
                  src={museum.imageUrl}
                  alt={museum.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-gray-900">{museum.name}</h3>
                <p className="text-sm text-gray-600">{museum.location}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{museum.openingHours}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'dateSelection':
        return showCalendar ? (
          <div className="mt-4 relative">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onClose={() => setShowCalendar(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowCalendar(true)}
            className="mt-4 w-full bg-blue-50 text-blue-600 p-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>{t('chatbot.buttons.continue')}</span>
          </button>
        );

      case 'timeSelection':
        return (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {availableTimeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => handleTimeSelect(slot.time)}
                disabled={!slot.isAvailable}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  slot.isAvailable
                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {slot.time}
                </span>
                <span className="text-sm">{slot.available} spots</span>
              </button>
            ))}
          </div>
        );

      case 'visitorSelection':
        return (
          <div className="bg-white rounded-lg p-4 mt-4 space-y-4">
            {Object.entries(bookingState.visitors).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div>
                  <span className="capitalize font-medium">{t(`ageGroups.${type}`)}</span>
                  {selectedMuseum && (
                    <span className="text-sm text-gray-600 block">
                      ₹
                      {
                        selectedMuseum.pricing[
                          type as keyof typeof selectedMuseum.pricing
                        ]
                      }{' '}
                      {t('ticket.perPerson')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleVisitorCountUpdate(
                        type as keyof typeof bookingState.visitors,
                        Math.max(0, count - 1)
                      )
                    }
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{count}</span>
                  <button
                    onClick={() =>
                      handleVisitorCountUpdate(
                        type as keyof typeof bookingState.visitors,
                        count + 1
                      )
                    }
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            {selectedMuseum && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('payment.amount')}:</span>
                  <span className="flex items-center">
                    <IndianRupee className="w-5 h-5 mr-1" />
                    {calculateTotal(bookingState.visitors)}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={handleVisitorConfirm}
              className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition-colors"
            >
              {t('options.proceed')}
            </button>
          </div>
        );

      case 'payment':
        if (!selectedMuseum) return null;
        const total = calculateTotal(bookingState.visitors);
        return (
          <div className="mt-4">
            <PaymentDetailsComponent
              subtotal={total}
              visitors={bookingState.visitors}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        );

      case 'bookingConfirmation':
        return (
          <div className="bg-green-50 p-4 rounded-lg mt-4">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">{t('payment.success')}</span>
            </div>
            <div className="text-green-600 mt-2 space-y-2">
              <p>{t('chatbot.conversation.bookingSuccess')}</p>
              <div className="bg-white p-3 rounded-lg mt-2">
                <h3 className="font-medium text-gray-800 mb-2">
                  {t('ticket.title')}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {bookingState.userName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {bookingState.userEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {bookingState.userPhone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {selectedDate?.toLocaleDateString()} at {selectedTimeSlot}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <span className="font-medium">{t('payment.amount')}:</span>
                    <span className="float-right">
                      ₹{calculateTotal(bookingState.visitors)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePrintTicket}
                className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-5 h-5" />
                <span>{t('ticket.print')}</span>
              </button>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setMessages([]);
                    setBookingState({
                      userName: '',
                      userEmail: '',
                      userPhone: '',
                      visitors: { adult: 0, child: 0, senior: 0, tourist: 0 },
                      stage: 'initial'
                    });
                    addBotMessage(t('chatbot.conversation.greeting'));
                    addBotMessage(t('chatbot.conversation.nameAsk'));
                  }}
                  className="flex-1 flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>{t('chatbot.conversation.postBookingOptions.bookAnother')}</span>
                </button>
                <button
                  onClick={() => onBookingComplete && onBookingComplete()}
                  className="flex-1 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>{t('chatbot.conversation.postBookingOptions.home')}</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Define default placeholders directly
  const inputPlaceholders = {
    initial: t('chatbot.inputPlaceholder'),
    name: t('chatbot.conversation.nameAsk'),
    email: t('chatbot.conversation.emailAsk'),
    phone: t('chatbot.conversation.phoneAsk'),
    museum: t('chatbot.conversation.museumSelect'),
    date: t('chatbot.conversation.dateAsk'),
    time: t('chatbot.conversation.visitorAsk'),
    visitors: t('chatbot.conversation.visitorAsk'),
    payment: t('chatbot.conversation.confirmBooking'),
    complete: t('chatbot.conversation.bookingSuccess')
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b p-4 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="flex items-center gap-2 text-white">
            <Bot className="w-6 h-6" />
            <h2 className="text-lg font-semibold">{t('chatbot.title')}</h2>
          </div>
          <LanguageSelector />
        </div>

        <div
          ref={chatContainerRef}
          className="h-[600px] overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderMessage(message)}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-gray-500"
              >
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">{t('chatbot.typing')}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t p-4 bg-white">
          <div className="space-y-2">
            {inputError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {inputError}
              </motion.p>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setInputError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleUserInput(inputValue)}
                placeholder={inputPlaceholders[bookingState.stage]}
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  inputError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-blue-500'
                }`}
              />
              <button
                onClick={() => handleUserInput(inputValue)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
