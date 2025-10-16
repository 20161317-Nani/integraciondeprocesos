import React, { useState, useEffect } from "react";
import { Typography, Button } from "@material-tailwind/react";
import { VideoCard } from "@/widgets/cards/VideoCard";
import ProtectedContent from '@/components/ProtectedContent';

export function Historial() {
  const [history, setHistory] = useState([]);
  const [videos, setVideos] = useState([]); // Estado para los detalles de los videos
  const [filter, setFilter] = useState('all'); // Filtro por defecto
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // 1. Obtiene la lista de IDs de video del historial
        const historyResponse = await fetch(`/api/users/history?period=${filter}`);
        const historyData = await historyResponse.json();
        
        if (historyData.length === 0) {
            setVideos([]);
            setIsLoading(false);
            return;
        }

        // 2. Convierte la lista de IDs a una cadena para la API de YouTube
        const videoIds = historyData.map(item => item.videoId).join(',');

        // 3. Pide a tu backend los detalles de todos esos videos en una sola llamada
        const videosResponse = await fetch(`/api/youtube/video/${videoIds}`);
        const videosData = await videosResponse.json();
        setVideos(videosData);

      } catch (error) {
        console.error("Error al cargar el historial:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [filter]); // Se ejecuta cada vez que el filtro cambia

  return (
    <div className="mt-12">
      <ProtectedContent message="Para ver tu historial, debes iniciar sesión.">
        <Typography variant="h4" className="mb-6">Historial de Reproducción</Typography>
        
        {/* Barra de Filtros */}
        <div className="flex gap-3 mb-8">
          <Button variant={filter === 'all' ? 'filled' : 'text'} onClick={() => setFilter('all')}>Todo</Button>
          <Button variant={filter === 'day' ? 'filled' : 'text'} onClick={() => setFilter('day')}>Hoy</Button>
          <Button variant={filter === 'week' ? 'filled' : 'text'} onClick={() => setFilter('week')}>Semana</Button>
          <Button variant={filter === 'month' ? 'filled' : 'text'} onClick={() => setFilter('month')}>Mes</Button>
          <Button variant={filter === 'year' ? 'filled' : 'text'} onClick={() => setFilter('year')}>Año</Button>
        </div>

        {isLoading ? (
          <Typography>Cargando historial...</Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {videos.length > 0 ? (
              videos.map((video) => (
                <VideoCard key={`${video.id}-${Math.random()}`} video={video} />
              ))
            ) : (
              <Typography>No hay videos en tu historial para este período.</Typography>
            )}
          </div>
        )}
      </ProtectedContent>
    </div>
  );
}

export default Historial;