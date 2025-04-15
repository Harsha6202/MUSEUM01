import React from 'react';
import { History, Users, Award, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[400px]"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1584037618503-6140c67e9edc?auto=format&fit=crop&w=2000)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about.title')}</h1>
            <p className="text-xl max-w-2xl">{t('about.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission.title')}</h2>
              <p className="text-gray-600 text-lg">{t('about.mission.description')}</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.vision.title')}</h2>
              <p className="text-gray-600 text-lg">{t('about.vision.description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('about.features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <History className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('about.features.history.title')}</h3>
              <p className="text-gray-600">{t('about.features.history.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('about.features.curators.title')}</h3>
              <p className="text-gray-600">{t('about.features.curators.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('about.features.awards.title')}</h3>
              <p className="text-gray-600">{t('about.features.awards.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('about.features.facilities.title')}</h3>
              <p className="text-gray-600">{t('about.features.facilities.description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-lg">{t('about.stats.visitors')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-lg">{t('about.stats.artifacts')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-lg">{t('about.stats.staff')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-lg">{t('about.stats.years')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('about.team.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              
            ].map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;