import React, { useState, useEffect } from "react";
import { Typography, Input } from "@material-tailwind/react";
import { VideoCard } from "@/widgets/cards";
import ProtectedContent from '@/components/ProtectedContent';
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { set } from "mongoose";

export function Guardados() {
  const [savedVideoIds, setSavedVideoIds] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savedIdsSet, setSavedIdsSet] = useState(new Set()); // Para pasar al VideoCard

  useEffect(() => {
    const fetchSavedData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) return;

      try {
        // 1. Obtener IDs de videos guardados
      const idsResponse = await fetch('/api/users/saved', { 
        headers: { 'x-auth-token': token },
      });
      
      // Verifica si la respuesta fue exitosa (NO fue 404)
      if (!idsResponse.ok) {
        console.error('Error del backend al pedir IDs guardados:', idsResponse.status);
        throw new Error('Error al obtener IDs guardados');
      }
        const idsData = await idsResponse.json();

      if (!idsData || !Array.isArray(idsData.savedVideos)) {
          console.error('Formato inesperado de IDs guardados:', idsData);
          throw new Error('Formato inesperado de IDs guardados');
      }
        const savedIds = idsData.savedVideos || [];
        setSavedVideoIds(savedIds);
        setSavedIdsSet(new Set(savedIds)); // Guarda el Set para el botón

        if (savedIds.length === 0) {
          setVideos([]);
          setIsLoading(false);
          return;
        }

        // 2. Obtener detalles de esos videos
        const videoIdsString = savedIds.join(',');
        const videosResponse = await fetch(`/api/youtube/video/${videoIdsString}`);

        if (!videosResponse.ok) {
          console.error('Error del backend al pedir detalles:', videosResponse.status);
          throw new Error('Error al obtener detalles de videos');
      }

        const videosData = await videosResponse.json();
        setVideos(videosData);

      } catch (error) {
        console.error("Error al cargar videos guardados:", error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedData();
  }, []); // Solo se ejecuta al montar

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedContent message="Para ver tus videos guardados, debes iniciar sesión.">
      <div className="mt-12 flex flex-col gap-4 gx-6 px-5">
        <div className="flex items-center gap-2 mb-4">
          <BookmarkIcon className="w-6 h-6 text-blue-500" />
          <Input /* ... props de búsqueda ... */ />
        </div>

        {isLoading ? (
          <Typography>Cargando videos guardados...</Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                // Pasa el Set de IDs guardados al VideoCard
                <VideoCard key={video.id} video={video} savedVideoIds={savedIdsSet} /> 
              ))
            ) : (
              <Typography className="col-span-full text-center text-gray-500 mt-4">
                {search ? 'No se encontraron videos guardados con ese título.' : 'Aún no has guardado ningún video.'}
              </Typography>
            )}
          </div>
        )}
      </div>
    </ProtectedContent>
  );
}

export default Guardados;