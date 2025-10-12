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
import { useEffect, useState } from "react";
import { VideoCard } from "@/widgets/cards/videocard";

export function Video() {
  const { videoId } = useParams(); // Obtiene el ID del video desde la URL
  const [videoDetails, setVideoDetails] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Esta función se ejecuta cada vez que el videoId cambia
    const fetchVideoData = async () => {
      setIsLoading(true);
      try {
        // Petición para obtener los detalles del video principal
        const detailsResponse = await fetch(`/api/youtube/video/${videoId}`);
        const detailsData = await detailsResponse.json();
        setVideoDetails(detailsData);

        // Petición para obtener videos sugeridos (reusamos la de videos populares por ahora)
        const suggestedResponse = await fetch(`/api/youtube/videos`);
        const suggestedData = await suggestedResponse.json();
        setSuggestedVideos(suggestedData.filter(v => v.id !== videoId)); // Excluimos el video actual de las sugerencias

      } catch (error) {
        console.error("Error al cargar los datos del video:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

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
            <Avatar src={videoDetails.channelAvatarUrl || ''} alt={videoDetails.channelName} />
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
