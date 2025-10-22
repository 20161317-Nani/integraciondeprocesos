// src/components/LanguageSelector.jsx
import React, { useEffect, useState } from "react";

export default function LanguageSelector({ handleTranslate }) {
  const languages = [
    { code: "es", label: "Español" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "ja", label: "日本語" },       // Japonés
    { code: "zh", label: "中文" },         // Chino
  ];

  const [selectedLang, setSelectedLang] = useState("es");

  // Al montar, lee el idioma guardado en localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "es";
    setSelectedLang(savedLang);
  }, []);

  const handleChange = (e) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    handleTranslate(newLang); // llama a la función de traducción
  };

  return (
    <select
      value={selectedLang}
      onChange={handleChange}
      className="border rounded px-2 py-1 text-sm"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
