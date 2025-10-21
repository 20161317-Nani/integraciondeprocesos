
import React, { useState } from "react";
import { Button } from "@material-tailwind/react";

export function FilterBar({ onFilterChange, darkMode }) {
  const [activeFilter, setActiveFilter] = useState("sugeridos");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  // Estilos de fondo y texto del div
  const backgroundColor = darkMode
    ? "bg-gray-900 border border-gray-800 shadow-lg shadow-gray-900/60"
    : "bg-white border border-blue-gray-100 shadow-md";

  return (
    <div className={`relative flex gap-3 mb-6 py-3 px-4 rounded-xl transition-all duration-300 ${backgroundColor}`}>

      {/* Botón Sugeridos */}
      <Button
        variant={activeFilter === "sugeridos" ? "filled" : "text"}
        className={`capitalize font-medium transition-all duration-200 ${activeFilter === "sugeridos"
            ? "bg-blue-600 text-white"
            : darkMode
              ? "text-white hover:bg-gray-800"
              : "text-blue-gray-900 hover:bg-blue-gray-50"
          }`}
        onClick={() => handleFilterClick("sugeridos")}
      >
        Sugeridos
      </Button>

      {/* Botón Localización */}
      <Button
        variant={activeFilter === "localizacion" ? "filled" : "text"}
        className={`capitalize font-medium transition-all duration-200 ${activeFilter === "localizacion"
            ? "bg-blue-600 text-white"
            : darkMode
              ? "text-white hover:bg-gray-800"
              : "text-blue-gray-900 hover:bg-blue-gray-50"
          }`}
        onClick={() => handleFilterClick("localizacion")}
      >
        Localización
      </Button>
    </div>
  );
}

export default FilterBar;
