// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    // El código 'es' es el código del idioma por defecto
    lng: 'es', 
    fallbackLng: 'es', 
    supportedLngs: ['es', 'en', 'pt', 'zh', 'ja', 'fr'], 
    
    backend: {
      // Ruta donde se encuentran tus archivos JSON
      loadPath: '/locales/{{lng}}/translation.json', 
    },
    
    // Configuración estándar
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;