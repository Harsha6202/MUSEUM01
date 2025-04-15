import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import App from './App.tsx';
import './index.css';
import { initializeMuseums } from './firebase/museums';

// Initialize museum data in Firebase
initializeMuseums().catch(console.error);

// Initialize with saved language preference
const savedLanguage = localStorage.getItem('museum-reservation_language');
if (savedLanguage) {
  i18n.changeLanguage(savedLanguage);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>
);