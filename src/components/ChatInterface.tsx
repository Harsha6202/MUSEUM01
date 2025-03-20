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
  IndianRupee
} from 'lucide-react';
import Calendar from './Calendar';
import LanguageSelector from './LanguageSelector';
import PaymentDetailsComponent from './PaymentDetailsComponent';
import { Message, Museum, TimeSlot, BookingDetails } from '../types';
import { museums } from '../data/museums';
import { getAvailableTimeSlots, addBooking } from '../utils/bookingService';

interface ChatInterfaceProps {
  onBookingComplete?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBookingComplete }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingState, setBookingState] = useState<{
    userName: string;
    visitors: {
      adult: number;
      child: number;
      senior: number;
      tourist: number;
    };
    stage: 'initial' | 'name' | 'museum' | 'date' | 'time' | 'visitors' | 'payment' | 'complete';
  }>({
    userName: '',
    visitors: { adult: 0, child: 0, senior: 0, tourist: 0 },
    stage: 'initial'
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
          content: t('welcome'),
          component: 'initial'
        }
      ]);
      setIsTyping(false);
    }, 1000);
  }, [t, i18n.language]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (content: string, component?: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: generateMessageId(),
        type: 'bot',
        content,
        component: component as any
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, Math.random() * 500 + 500);
  };

  const handleUserInput = (input: string) => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, {
      id: generateMessageId(),
      type: 'user',
      content: input
    }]);
    setInputValue('');

    switch (bookingState.stage) {
      case 'initial':
        handleNameSubmit(input);
        break;
      case 'name':
        setBookingState(prev => ({ ...prev, stage: 'museum' }));
        addBotMessage(t('chatbot.museumPrompt'), 'museumSelection');
        break;
      default:
        addBotMessage(t('chatbot.unhandledResponse'));
    }
  };

  const handleNameSubmit = (name: string) => {
    setBookingState(prev => ({ ...prev, userName: name, stage: 'museum' }));
    addBotMessage(t('greetUser', { name }));
    addBotMessage(t('chatbot.museumPrompt'), 'museumSelection');
  };

  const handleMuseumSelect = async (museum: Museum) => {
    setSelectedMuseum(museum);
    setBookingState(prev => ({ ...prev, stage: 'date' }));
    addBotMessage(t('dateQuestion'), 'dateSelection');
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
      setBookingState(prev => ({ ...prev, stage: 'time' }));
      addBotMessage(t('Please select your preferred time:'), 'timeSelection');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
    setBookingState(prev => ({ ...prev, stage: 'visitors' }));
    addBotMessage(t('Select number of visitors:'), 'visitorSelection');
  };

  const handleVisitorCountUpdate = (type: keyof typeof bookingState.visitors, count: number) => {
    setBookingState(prev => ({
      ...prev,
      visitors: {
        ...prev.visitors,
        [type]: count
      }
    }));
  };

  const handleVisitorConfirm = () => {
    const totalVisitors = Object.values(bookingState.visitors).reduce((a, b) => a + b, 0);
    if (totalVisitors > 0) {
      setBookingState(prev => ({ ...prev, stage: 'payment' }));
      const total = calculateTotal(bookingState.visitors);
      addBotMessage(`Total amount: ₹${total}`, 'payment');
    } else {
      addBotMessage('Please select at least one visitor', 'visitorSelection');
    }
  };

  const calculateTotal = (visitors: typeof bookingState.visitors) => {
    if (!selectedMuseum) return 0;
    return Object.entries(visitors).reduce((total, [type, count]) => {
      return total + (selectedMuseum.pricing[type as keyof typeof selectedMuseum.pricing] * count);
    }, 0);
  };

  const handlePaymentComplete = async () => {
    if (selectedMuseum && selectedDate && selectedTimeSlot) {
      try {
        const booking: BookingDetails = {
          name: bookingState.userName,
          museum: selectedMuseum,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTimeSlot,
          visitors: bookingState.visitors,
          totalAmount: calculateTotal(bookingState.visitors),
          paymentStatus: 'completed',
          ticketNumber: `TKT${Date.now()}`,
          createdAt: new Date().toISOString()
        };

        await addBooking(booking);
        setBookingState(prev => ({ ...prev, stage: 'complete' }));
        addBotMessage('Payment successful! Your booking is confirmed.', 'bookingConfirmation');
        
        if (onBookingComplete) {
          onBookingComplete();
        }
      } catch (error) {
        console.error('Error processing booking:', error);
        addBotMessage('Sorry, there was an error processing your booking. Please try again.');
      }
    }
  };

  const renderComponent = (component: string) => {
    switch (component) {
      case 'initial':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => handleNameSubmit('Guest')}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Book Tickets</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact Support</span>
            </button>
          </div>
        );

      case 'museumSelection':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {museums.map(museum => (
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
            <span>Open Calendar</span>
          </button>
        );

      case 'timeSelection':
        return (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {availableTimeSlots.map(slot => (
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
                <span className="text-sm">
                  {slot.available} spots
                </span>
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
                  <span className="capitalize font-medium">{type}</span>
                  {selectedMuseum && (
                    <span className="text-sm text-gray-600 block">
                      ₹{selectedMuseum.pricing[type as keyof typeof selectedMuseum.pricing]} per person
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVisitorCountUpdate(type as keyof typeof bookingState.visitors, Math.max(0, count - 1))}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{count}</span>
                  <button
                    onClick={() => handleVisitorCountUpdate(type as keyof typeof bookingState.visitors, count + 1)}
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
                  <span>Total Amount:</span>
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
              Proceed to Payment
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
              <span className="font-medium">Booking Confirmed!</span>
            </div>
            <p className="text-green-600 mt-2">
              Thank you for booking with us. Your visit has been confirmed.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b p-4 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {t('chatbot.title')}
          </h2>
          <LanguageSelector />
        </div>

        <div 
          ref={chatContainerRef}
          className="h-[600px] overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          <AnimatePresence>
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.component && renderComponent(message.component)}
                </div>
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
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserInput(inputValue)}
              placeholder={t('chatbot.inputPlaceholder')}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
};

export default ChatInterface;