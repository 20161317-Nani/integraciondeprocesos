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
    if (!token) {
      setIsLoading(false);
      setVideos([]);
      return;
    }

    try {
      const historyResponse = await fetch(`/api/users/history?period=${filter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (!historyResponse.ok) {
        // Log específico si la petición al backend falla
        console.error('Error del backend al pedir historial:', historyResponse.status, await historyResponse.text());
        throw new Error('Error al obtener el historial del servidor');
      }

      const historyData = await historyResponse.json();
      // 👇 LOG 1: ¿Llegan los IDs del historial? 👇
      console.log('Historial recibido del backend (IDs):', historyData);

      if (!Array.isArray(historyData)) {
         console.error('La respuesta del historial no es un array:', historyData);
         throw new Error('Formato de historial inesperado');
      }

      if (historyData.length === 0) {
        console.log('El historial está vacío para este período.');
        setVideos([]);
        setIsLoading(false);
        return;
      }

      const videoIds = historyData.map(item => item.videoId).join(',');
      // 👇 LOG 2: ¿Se están formando bien los IDs para YouTube? 👇
      console.log('Pidiendo detalles para los IDs:', videoIds);

      const videosResponse = await fetch(`/api/youtube/video/${videoIds}`);

      if (!videosResponse.ok) {
        // Log si la petición a YouTube falla
        console.error('Error del backend al pedir detalles a YouTube:', videosResponse.status, await videosResponse.text());
        throw new Error('Error al obtener detalles de videos');
      }

      const videosData = await videosResponse.json();
      // 👇 LOG 3: ¿Llegan los detalles de los videos? 👇
      console.log('Detalles de videos recibidos:', videosData);
      setVideos(videosData);

    } catch (error) {
      console.error("Error final en fetchHistory:", error); // Muestra cualquier error capturado
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchHistory();
}, [filter]);

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