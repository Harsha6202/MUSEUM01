import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mouse as Museum } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/book');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[600px]" 
        style={{ 
          backgroundImage: 'url(https://media.istockphoto.com/id/466240080/photo/victoria-memorial-landmark-in-calcutta-india.jpg?s=612x612&w=0&k=20&c=908J0rxwTyUBivotass3lCizKrsE5gGYQ5UpHP3V6zY=)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('homepage.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              {t('homepage.hero.subtitle')}
            </p>
            <div className="flex justify-center">
              <button 
                onClick={handleBookNow}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
              >
                {t('homepage.hero.bookTickets')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Opening Hours */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Museum className="w-6 h-6 mr-2 text-blue-600" />
              {t('homepage.info.openingHours.title')}
            </h2>
            <p className="text-gray-600">
              {t('homepage.info.openingHours.weekdays')}
            </p>
            <p className="text-gray-600">
              {t('homepage.info.openingHours.monday')}
            </p>
          </div>

          {/* Ticket Prices */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Museum className="w-6 h-6 mr-2 text-blue-600" />
              {t('homepage.info.ticketPrices.title')}
            </h2>
            <p className="text-gray-600">
              {t('homepage.info.ticketPrices.adult')}
            </p>
            <p className="text-gray-600">
              {t('homepage.info.ticketPrices.student')}
            </p>
            <p className="text-gray-600">
              {t('homepage.info.ticketPrices.children')}
            </p>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Museum className="w-6 h-6 mr-2 text-blue-600" />
              {t('homepage.info.location.title')}
            </h2>
            <p className="text-gray-600">
              {t('homepage.info.location.address')}
            </p>
            <p className="text-gray-600">
              {t('homepage.info.location.city')}
            </p>
            <p className="text-gray-600">
              {t('homepage.info.location.country')}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleAdminClick}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {t('navigation.admin')}
        </button>
      </div>
    </div>
  );
};

export default HomePage;