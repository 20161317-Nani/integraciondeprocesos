import React, { useState } from "react";
import { Button } from "@material-tailwind/react";

export function FilterBar({ onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState("sugeridos");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="relative flex gap-3 mb-6 py-3 px-4 rounded-xl transition-all duration-300
      bg-white border border-blue-gray-100 shadow-md
      dark:bg-gray-900 dark:border-gray-800 dark:shadow-lg dark:shadow-gray-900/60"
    >
      {/* Botón Sugeridos */}
      <Button
        variant={activeFilter === "sugeridos" ? "filled" : "text"}
        className={`capitalize font-medium transition-all duration-200
          ${activeFilter === "sugeridos" 
            ? "bg-blue-600 text-white" 
            : "text-blue-gray-900 hover:bg-blue-gray-50 dark:text-white dark:hover:bg-gray-800"}`}
        onClick={() => handleFilterClick("sugeridos")}
      >
        Sugeridos
      </Button>

      {/* Botón Localización */}
      <Button
        variant={activeFilter === "localizacion" ? "filled" : "text"}
        className={`capitalize font-medium transition-all duration-200
          ${activeFilter === "localizacion" 
            ? "bg-blue-600 text-white" 
            : "text-blue-gray-900 hover:bg-blue-gray-50 dark:text-white dark:hover:bg-gray-800"}`}
        onClick={() => handleFilterClick("localizacion")}
      >
        Localización
      </Button>
    </div>
  );
}

export default FilterBar;

