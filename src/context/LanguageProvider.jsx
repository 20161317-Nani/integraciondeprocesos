import React, { useState, useContext } from "react";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("es");

  const handleTranslate = (lang) => setLanguage(lang);

  return (
    <LanguageContext.Provider value={{ language, handleTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
