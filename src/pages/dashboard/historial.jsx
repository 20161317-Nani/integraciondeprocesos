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
    setVideos([]); // Limpia videos anteriores al iniciar la carga
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false); 
      return; 
    }

    try {
      // 1. Obtiene la lista COMPLETA de IDs del historial (objetos {videoId, watchedAt})
      const historyResponse = await fetch(`/api/users/history?period=${filter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, 
        },
      });

      if (!historyResponse.ok) {
        throw new Error('Error al obtener el historial del servidor');
      }
      
      const historyData = await historyResponse.json();
      console.log('Historial recibido (objetos completos):', historyData);

      if (!Array.isArray(historyData)) {
         throw new Error('Formato de historial inesperado');
      }

      if (historyData.length === 0) {
        console.log('El historial está vacío.');
        setIsLoading(false);
        return;
      }

      // 👇 2. EXTRAE IDs ÚNICOS y LIMITA la cantidad 👇
      const uniqueVideoIds = [...new Set(historyData.map(item => item.videoId))]; // Obtiene IDs únicos
      const limitedVideoIds = uniqueVideoIds.slice(0, 50); // Limita a 50 (límite de la API)
      
      console.log('IDs únicos a pedir detalles:', limitedVideoIds);

      // 3. Pide detalles SÓLO para esos IDs limitados y únicos
      const videoIdsString = limitedVideoIds.join(',');
      const videosResponse = await fetch(`/api/youtube/video/${videoIdsString}`);
      
      if (!videosResponse.ok) {
        throw new Error('Error al obtener detalles de videos');
      }

      const videosData = await videosResponse.json();
      console.log('Detalles de videos recibidos:', videosData);
      
      // 4. (Opcional pero recomendado) Ordena los videos según el historial original
      // Crea un mapa para buscar detalles rápido por ID
      const videoDetailsMap = new Map(videosData.map(video => [video.id, video]));
      // Mapea el historial original para obtener los videos ordenados y con duplicados si es necesario
      const orderedVideos = historyData
                              .map(historyItem => videoDetailsMap.get(historyItem.videoId))
                              .filter(Boolean); // Filtra por si algún video ya no existe en YouTube

      setVideos(orderedVideos); // Muestra los videos en orden de visualización

    } catch (error) {
      console.error("Error final en fetchHistory:", error); 
      setVideos([]); // Limpia videos en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  fetchHistory();
}, [filter]); // Se ejecuta cada vez que el filtro cambia


  return (
    <div className="mt-12 px-5">
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