import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { VideoCard } from "@/widgets/cards/VideoCard";
import { FilterBar } from "@/widgets/layout/FilterBar";


export function Home() {
  
  const [savedVideoIds, setSavedVideoIds] = useState(new Set());
  const [videos, setVideos] = useState([]);
  const [activeFilter, setActiveFilter] = useState("sugeridos");
  const [isLoading, setIsLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(''); // Estado para mensajes de error

  const [savedIdsSet, setSavedIdsSet] = useState(new Set()); // Usamos un Set para búsquedas rápidas

  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Solo para usuarios logueados
      try {
        const response = await fetch('/api/users/saved', {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) return;
        const data = await response.json();
        setSavedVideoIds(new Set(data.savedVideos || []));
      } catch (error) {
        console.error("Error al cargar videos guardados:", error);
      }
    };
    fetchSaved();
    // No añadimos dependencias para que solo se ejecute al montar el componente Home
  }, []);

  // Función para obtener los videos sugeridos
  const fetchSuggestedVideos = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/youtube/videos');
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setError('No se pudieron cargar los videos sugeridos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función principal para manejar el filtro de localización
  const handleLocationFilter = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para ver videos basados en tu ubicación guardada.');
      setVideos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Obtiene el perfil del usuario para leer su ubicación guardada
      const profileResponse = await fetch('/api/auth/me', {
        headers: { 'x-auth-token': token },
      });
      const profileData = await profileResponse.json();

      // 2. Revisa si tiene una ubicación guardada y válida
      if (profileData.location && profileData.location.coordinates[0] !== 0) {
        const lat = profileData.location.coordinates[1];
        const lon = profileData.location.coordinates[0];

        // 3. Pide los videos cercanos usando la ubicación de la BD
        const videoResponse = await fetch(`/api/youtube/combined-search?lat=${lat}&lon=${lon}`);
        const videoData = await videoResponse.json();
        setVideos(videoData);
      } else {
        // 4. Si no hay ubicación guardada, muestra un mensaje
        setError('No tienes una ubicación guardada. Por favor, configúrala en la página de Localización.');
        setVideos([]);
      }
    } catch (err) {
      setError('No se pudieron cargar los videos cercanos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Efecto que se dispara al cambiar de filtro
  useEffect(() => {
    if (activeFilter === "sugeridos") {
      fetchSuggestedVideos();
    } else if (activeFilter === "localizacion") {
      handleLocationFilter();
    }
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

    return (
    <div className="mt-12 px-5">
      <FilterBar onFilterChange={handleFilterChange} />
      {isLoading ? (
        <Typography>Cargando...</Typography>
      ) : error ? (
        <Typography color="red">{error}</Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.length > 0 ? (
            videos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                savedVideoIds={savedVideoIds}
              />
            ))
          ) : (
            <Typography>No hay videos para mostrar.</Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;