import React from 'react';
import { Clock, MapPin, Phone, Globe, AlertCircle } from 'lucide-react';
import { museums } from '../data/museums';
import { useTranslation } from 'react-i18next';

const MuseumTimings = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('timings.title')}</h1>
          <p className="text-lg text-gray-600">
            {t('timings.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {museums.map((museum) => (
            <div
              key={museum.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={museum.imageUrl}
                alt={museum.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {museum.name}
                </h2>
                <p className="text-gray-600 mb-4">{museum.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    <span>{museum.openingHours}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    <span>{museum.location}, {museum.state}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    <span>+91 11 2345 6789</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-5 w-5 mr-2 text-blue-600" />
                    <span>www.{museum.name.toLowerCase().replace(/\s+/g, '')}.gov.in</span>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-semibold text-blue-900">{t('timings.importantNotice')}</h3>
                      <p className="text-sm text-blue-800">
                        {t('timings.holidayNotice')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('timings.entryFees')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <p className="text-gray-600">{t('ageGroups.adult')}</p>
                      <p className="font-semibold">₹{museum.pricing.adult}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">{t('ageGroups.child')}</p>
                      <p className="font-semibold">₹{museum.pricing.child}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">{t('ageGroups.senior')}</p>
                      <p className="font-semibold">₹{museum.pricing.senior}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">{t('ageGroups.tourist')}</p>
                      <p className="font-semibold">₹{museum.pricing.tourist}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MuseumTimings;