import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { VideoCard } from "@/widgets/cards/VideoCard";

export function ResultadosBusqueda() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // Lee el término de búsqueda de la URL (?q=...)
  
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query) return; // No hacer nada si no hay búsqueda

    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/youtube/search?q=${query}`);
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error al buscar videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // Se ejecuta cada vez que la búsqueda en la URL cambia

  return (
    <div className="mt-12">
      <Typography variant="h5" className="mb-6">
        Resultados para: "{query}"
      </Typography>

      {isLoading ? (
        <Typography>Buscando videos...</Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.length > 0 ? (
            videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))
          ) : (
            <Typography>No se encontraron videos para "{query}".</Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default ResultadosBusqueda;