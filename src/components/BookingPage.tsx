import React from 'react';
import ChatInterface from './ChatInterface';

const BookingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Museum Visit</h1>
          <p className="mt-2 text-gray-600">
            Use our interactive booking assistant to plan your visit
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
};

export default BookingPage;