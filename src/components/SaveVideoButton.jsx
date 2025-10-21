import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from "@material-tailwind/react";
import { BookmarkIcon as BookmarkSolid, BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkOutlineEmpty } from "@heroicons/react/24/outline"; // Icono vacío

export function SaveVideoButton({ videoId, initialSavedStatus }) {
  const [isSaved, setIsSaved] = useState(initialSavedStatus);
  const [isLoading, setIsLoading] = useState(false);

  // Sincroniza el estado si el prop inicial cambia
  useEffect(() => {
    setIsSaved(initialSavedStatus);
  }, [initialSavedStatus]);

  const handleSaveToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para guardar videos.');
      return;
    }
    setIsLoading(true);
    
    // Actualización optimista (cambia el icono antes de la respuesta)
    const previousState = isSaved;
    setIsSaved(!isSaved); 

    try {
      const response = await fetch('/api/users/save-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado guardado');
      }
      // La API fue exitosa, el estado optimista era correcto
      
    } catch (error) {
      console.error(error);
      setIsSaved(previousState); // Revierte el cambio si la API falla
      alert('No se pudo guardar/quitar el video.');
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isSaved ? BookmarkSolid : BookmarkOutlineEmpty;
  const tooltipContent = isSaved ? "Quitar de guardados" : "Guardar video";

  return (
    <Tooltip content={tooltipContent}>
      <IconButton 
        variant="text" 
        color="blue-gray" 
        onClick={handleSaveToggle} 
        disabled={isLoading}
      >
        <Icon className="h-5 w-5" />
      </IconButton>
    </Tooltip>
  );
}

export default SaveVideoButton;