// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext } from "react";

// ✅ Exportamos el contexto directamente
export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("es");

  const handleTranslate = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, handleTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useLanguage = () => useContext(LanguageContext);
