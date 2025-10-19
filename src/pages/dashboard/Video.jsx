import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { VideoCard } from "@/widgets/cards/videocard";

export function Video() {
  const { videoId } = useParams(); // Obtiene el ID del video desde la URL
  const [videoDetails, setVideoDetails] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Referencia para evitar doble guardado
  const hasLoggedHistory = useRef(false);

useEffect(() => {
  // 👇 1. Bandera para rastrear si el componente está montado
  let isMounted = true; 

  const logHistory = async () => {
    if (!isMounted) return; // Verifica si sigue montado

    const token = localStorage.getItem('token');
    console.log("(Video.jsx) Token leído de localStorage:", token);
    
    if (token && videoId) {
    console.log(`(Video.jsx) Intentando guardar historial para videoId: ${videoId}`); 
    try {
      // 👇 ASEGÚRATE DE QUE ESTE BLOQUE 'headers' ESTÉ COMPLETO 👇
      const response = await fetch('/api/users/history', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token, // Esta cabecera es esencial
          },
          body: JSON.stringify({ videoId: videoId }),
         });
      
      if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Error del servidor al guardar historial: ${response.status} - ${errorData}`);
      }

      if (isMounted) {
          console.log("(Video.jsx) Petición para guardar historial enviada con éxito."); 
      }
      // No necesitamos marcar hasLoggedHistory aquí con isMounted
      // porque la limpieza del useEffect ya maneja la lógica de StrictMode

    } catch (error) {
      if (isMounted) { 
          console.error("(Video.jsx) No se pudo guardar el historial:", error);
      }
    }
  } else {
     if (isMounted) {
        console.log("(Video.jsx) No hay token o videoId, no se guarda historial.");
     }
  }
};

  const fetchVideoData = async () => {
    setIsLoading(true);
    setVideoDetails(null); 
    setSuggestedVideos([]); 

    try {
      const detailsResponse = await fetch(`/api/youtube/video/${videoId}`);
      // ... (manejo de error si detailsResponse no es ok) ...
      const detailsData = await detailsResponse.json();
      
      if (!detailsData || detailsData.length === 0) { /* ... */ }
      
      // 👇 4. Verifica si sigue montado antes de actualizar estado y llamar a logHistory
      if (isMounted) {
          setVideoDetails(detailsData[0]); 
          await logHistory(); // Llama a guardar aquí
      }

      // ... (código para cargar videos sugeridos, también con check de isMounted si es async) ...
      const suggestedResponse = await fetch(`/api/youtube/videos`);
      // ... (manejo de error) ...
      const suggestedData = await suggestedResponse.json();
      if (isMounted) {
          setSuggestedVideos(suggestedData.filter(v => v.id !== videoId));
      }

    } catch (error) { 
        if (isMounted) {
            console.error("(Video.jsx) Error en fetchVideoData:", error);
            setVideoDetails(null);
        }
    } finally { 
        if (isMounted) {
            setIsLoading(false);
        }
    }
  };

  fetchVideoData();

  // 👇 5. LA FUNCIÓN DE LIMPIEZA 👇
  // Esta función se ejecuta automáticamente cuando el componente se desmonta
  // (o antes de que el efecto se ejecute de nuevo si las dependencias cambian)
  return () => {
    isMounted = false; // Marca el componente como desmontado
  };
    
}, [videoId]); // El array de dependencias no cambia
  if (isLoading) {
    return <Typography className="mt-12">Cargando video...</Typography>;
  }

  if (!videoDetails) {
    return <Typography className="mt-12">No se pudo cargar el video.</Typography>;
  }

  return (
   // Contenedor principal (flex row en pantallas grandes)
    <div className="mt-12 flex flex-col lg:flex-row gap-6">

      {/* --- INICIO: COLUMNA IZQUIERDA (VIDEO + SUGERIDOS) --- */}
      <div className="flex-[2] flex flex-col gap-6">
        {/* Reproductor de video */}
        <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={videoDetails.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Detalles del video */}
        <div className="p-2">
          <Typography variant="h4" color="blue-gray">{videoDetails.title}</Typography>
          <div className="flex items-center gap-4 mt-4">
            <Avatar src={videoDetails.channelAvatarUrl} alt={videoDetails.channelName} />
            <div>
              <Typography variant="h6">{videoDetails.channelName}</Typography>
              <Typography variant="small" color="gray">
                {videoDetails.views} de vistas • {videoDetails.publishedAt}
              </Typography>
            </div>
          </div>
        </div>
        
        {/* Videos sugeridos (AHORA AQUÍ) */}
        <div className="mt-6">
            <Typography variant="h6" className="mb-4">Sugeridos</Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedVideos.slice(0, 4).map((video) => ( // Mostramos solo 4 sugeridos
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
      </div>
      {/* --- FIN: COLUMNA IZQUIERDA --- */}


      {/* --- INICIO: COLUMNA DERECHA (COMENTARIOS) --- */}
      <div className="w-full lg:w-full lg:flex-[1]">
        <Card className="h-full">
          <CardBody>
            <Typography variant="h6" className="mb-4">Comentarios</Typography>
            {/* Aquí puedes mapear comentarios si los tuvieras */}
            <Typography>La sección de comentarios estará disponible próximamente.</Typography>
          </CardBody>
        </Card>
      </div>
      {/* --- FIN: COLUMNA DERECHA --- */}
      
    </div>
  );
}


export default Video;
