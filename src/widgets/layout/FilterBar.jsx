import React, { useState } from "react";
import { Button } from "@material-tailwind/react";

export function FilterBar({ onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState("sugeridos");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onFilterChange(filter); // Llama a la función del componente padre
  };

  return (
    <div className="flex gap-3 mb-6 sticky top-0 bg-white py-3 z-10">
      <Button
        variant={activeFilter === "sugeridos" ? "filled" : "text"}
        onClick={() => handleFilterClick("sugeridos")}
      >
        Sugeridos
      </Button>
      <Button
        variant={activeFilter === "localizacion" ? "filled" : "text"}
        onClick={() => handleFilterClick("localizacion")}
      >
        Localización
      </Button>
    </div>
  );
}

export default FilterBar;