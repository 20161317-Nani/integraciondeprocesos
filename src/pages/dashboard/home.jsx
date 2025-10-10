import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { VideoCard } from "@/widgets/cards/VideoCard";
import { FilterBar } from "@/widgets/layout/FilterBar";

export function Home() {
  const [videos, setVideos] = useState([]);
  const [activeFilter, setActiveFilter] = useState("sugeridos");
  const [isLoading, setIsLoading] = useState(true); // Estado para la carga

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      let endpoint = '';

      if (activeFilter === "sugeridos") {
        endpoint = '/api/youtube/videos'; // Llama a tu backend
      } else if (activeFilter === "localizacion") {
        // Aquí iría la lógica para la geolocalización en el futuro
        console.log("Cargando videos por localización...");
        // Por ahora, lo dejamos vacío o con un mensaje
        setVideos([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error al cargar videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="mt-12">
      <FilterBar onFilterChange={handleFilterChange} />

      {isLoading ? (
        <Typography>Cargando videos...</Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.length > 0 ? (
            videos.map((video) => (
              <VideoCard key={video.id} video={video} />
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