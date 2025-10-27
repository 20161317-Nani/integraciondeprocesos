import React from "react";
import {  Typography,  Card,  CardHeader,  CardBody,  IconButton,  Menu,  
  MenuHandler,  MenuList,  MenuItem,  Avatar,  Tooltip,  Progress,  
  Input,  Button,} from "@material-tailwind/react";import {
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
import { SaveVideoButton } from '@/components/SaveVideoButton';
import ProtectedContent from '@/components/ProtectedContent'; // Importa ProtectedContent

export function Video() {
  const { videoId } = useParams(); // Obtiene el ID del video desde la URL
  const [videoDetails, setVideoDetails] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedVideoIds, setSavedVideoIds] = useState(new Set());
  const [isCurrentVideoSaved, setIsCurrentVideoSaved] = useState(false);

  // const para comentarios
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Para desactivar botón mientras envía

  // Referencia para evitar doble guardado
  const hasLoggedHistory = useRef(false);

useEffect(() => {
  
  // Bandera para rastrear si el componente está montado
  let isMounted = true; 

  const logHistory = async () => {
    if (!isMounted) return; // Verifica si sigue montado

    const token = localStorage.getItem('token');
    console.log("(Video.jsx) Token leído de localStorage:", token);
    
    if (token && videoId) {
    console.log(`(Video.jsx) Intentando guardar historial para videoId: ${videoId}`); 
    try {
    
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

    const fetchComments = async () => {
    console.log("(Video.jsx) Iniciando fetchComments para videoId:", videoId); // LOG 1
    try {
        const response = await fetch(`/api/comments/${videoId}`);
        
        // LOG 2: ¿La petición fue exitosa?
        console.log("(Video.jsx) Respuesta fetchComments status:", response.status); 

        if (!response.ok) {
            const errorText = await response.text();
            console.error("(Video.jsx) Error en respuesta fetchComments:", errorText);
            throw new Error(`Error ${response.status} al obtener comentarios`);
        }
        
        const data = await response.json();
        // LOG 3: ¿Qué datos llegaron? ¿Es un array?
        console.log("(Video.jsx) Datos recibidos de fetchComments:", data); 
        console.log("(Video.jsx) ¿Es un array?", Array.isArray(data));

        if (isMounted) {
            setComments(data);
             // LOG 4: Verifica el estado DESPUÉS de actualizarlo (usando un setTimeout corto)
             setTimeout(() => console.log("(Video.jsx) Estado 'comments' después de setComments:", comments), 0);
        }
    } catch (error) {
        if (isMounted) {
            console.error("(Video.jsx) Error CATCH en fetchComments:", error);
        }
    }
};



  const fetchVideoData = async () => {
    console.log("(Video.jsx) Iniciando fetchVideoData..."); // LOG 1
    setIsLoading(true);
    setVideoDetails(null);
    setSuggestedVideos([]);
    setComments([]); // Limpia comentarios también
    hasLoggedHistory.current = false;

    try {
      console.log("(Video.jsx) Pidiendo detalles del video..."); // LOG 2
      const detailsResponse = await fetch(`/api/youtube/video/${videoId}`);
      if (!detailsResponse.ok) {
        throw new Error(`Error ${detailsResponse.status} al obtener detalles`);
      }
      const detailsData = await detailsResponse.json();
      if (!detailsData || detailsData.length === 0) {
        throw new Error('No se recibieron detalles válidos del video');
      }
      console.log("(Video.jsx) Detalles recibidos:", detailsData[0]); // LOG 3

      if (isMounted) {
        setVideoDetails(detailsData[0]);
        await logHistory();
      }

      console.log("(Video.jsx) Pidiendo videos sugeridos..."); // LOG 4
      const suggestedResponse = await fetch(`/api/youtube/videos`);
      if (!suggestedResponse.ok) {
        throw new Error(`Error ${suggestedResponse.status} al obtener sugeridos`);
      }
      const suggestedData = await suggestedResponse.json();
      console.log("(Video.jsx) Sugeridos recibidos:", suggestedData.length, "videos"); // LOG 5
      if (isMounted) {
        setSuggestedVideos(suggestedData.filter(v => v.id !== videoId));
      }

      console.log("(Video.jsx) Llamando a fetchComments..."); // LOG 6
      if (isMounted) {
        await fetchComments();
      }
      console.log("(Video.jsx) fetchComments llamado."); // LOG 7

    } catch (error) {
      if (isMounted) {
        console.error("(Video.jsx) Error CATCH en fetchVideoData:", error); // LOG 8: ¿Hay error?
        setVideoDetails(null);
      }
    } finally {
      if (isMounted) {
        console.log("(Video.jsx) Finalizando fetchVideoData (finally)."); // LOG 9
        setIsLoading(false);
      }
    }
  };

  // 👇 2. FUNCIÓN PARA OBTENER VIDEOS GUARDADOS (NUEVA)
    const fetchSavedVideos = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Solo para usuarios logueados

      try {
        // ASUME que tienes una ruta GET /api/users/saved que devuelve { savedVideos: [id1, id2...] }
        // Necesitarás crear esta ruta en tu backend (users.js)
        const response = await fetch('/api/users/saved', {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) throw new Error('Error al obtener guardados');
        const data = await response.json();
        if (isMounted) {
          setSavedVideoIds(new Set(data.savedVideos || []));
        }
      } catch (error) {
        console.error("Error al cargar videos guardados:", error);
      }
    };

  fetchVideoData();
  fetchSavedVideos();

  // Esta función se ejecuta automáticamente cuando el componente se desmonta
  // (o antes de que el efecto se ejecute de nuevo si las dependencias cambian)
  return () => {
    isMounted = false; // Marca el componente como desmontado
  };
    
}, [videoId]); // El array de dependencias no cambia
 
useEffect(() => {
    if (videoDetails) {
      setIsCurrentVideoSaved(savedVideoIds.has(videoDetails.id));
    }
  }, [videoDetails, savedVideoIds]);

if (isLoading) {
    return <Typography className="mt-12">Cargando video...</Typography>;
  }

  if (!videoDetails) {
    return <Typography className="mt-12">No se pudo cargar el video.</Typography>;
  }

  // 👇 NUEVA FUNCIÓN PARA ENVIAR COMENTARIO 👇
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!newComment.trim() || !token) return; // Se necesita texto y estar logueado

    setIsSubmitting(true);
    try {
        const response = await fetch(`/api/comments/${videoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify({ text: newComment }),
        });
        
        if (!response.ok) {
            throw new Error('Falló al publicar comentario');
        }

        const savedComment = await response.json();
        setComments([savedComment, ...comments]); // Añade el nuevo comentario al inicio
        setNewComment(""); // Limpia el campo

    } catch (error) {
        console.error("Error al publicar comentario:", error);
        // Opcional: mostrar mensaje de error al usuario
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
   // Contenedor principal (flex row en pantallas grandes)
    <div className="mt-12 flex flex-col lg:flex-row gap-6 gx-6 px-5">

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
          <div className="flex justify-between items-start"> {/* Contenedor para título y botón */}
            <Typography variant="h4" color="blue-gray">{videoDetails.title}</Typography>
            {/* Botón de guardar al lado del título */}
            <SaveVideoButton 
              videoId={videoId} 
              initialSavedStatus={isCurrentVideoSaved} 
              // Opcional: Función para actualizar el Set cuando se guarda/desguarda
              onSaveChange={(id, isSaved) => {
                  setSavedVideoIds(prevSet => {
                      const newSet = new Set(prevSet);
                      if (isSaved) newSet.add(id);
                      else newSet.delete(id);
                      return newSet;
                  });
              }}
            />
          </div>
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
                   <VideoCard key={video.id} video={video} savedVideoIds={savedVideoIds} />
                ))}
            </div>
        </div>
      </div>
      {/* --- FIN: COLUMNA IZQUIERDA --- */}


      {/* --- INICIO: COLUMNA DERECHA (FORMULARIO + COMENTARIOS) --- */}
    <div className="w-full lg:flex-[1] flex flex-col gap-6"> {/* Se añade flex-col y gap */}
      
      {/* --- FORMULARIO PARA AÑADIR COMENTARIO (AHORA AQUÍ ARRIBA) --- */}
      <Card>
        <CardBody>
          <Typography variant="h6" className="mb-4">Añadir Comentario</Typography>
          <ProtectedContent message="Inicia sesión para dejar un comentario.">
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
              <Input
                label="Escribe tu comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? "Enviando..." : "Comentar"}
              </Button>
            </form>
          </ProtectedContent>
        </CardBody>
      </Card>

      {/* --- LISTA DE COMENTARIOS (DEBAJO DEL FORMULARIO) --- */}
     <Card className="flex-1 max-h-[calc(100vh-250px)] overflow-y-auto">
    <CardBody>
      <Typography variant="h6" className="mb-4">Comentarios</Typography>
      {/* 👇 AQUÍ ESTÁ LA LÓGICA 👇 */}
      {comments.length > 0 ? (
          comments.map((comment) => ( // ¿Estás seguro de que 'comment' tiene '_id', 'userName', etc.?
              <div key={comment._id} className="mb-4 border-b pb-2">
                  <div className="flex items-center gap-2 mb-1">
                      <Avatar 
                        src={comment.userProfilePic || `https://i.pravatar.cc/40?u=${comment.userId}`} 
                        size="lg" 
                        />
                      <Typography variant="medium" className="font-semibold">
                          {comment.userName}
                      </Typography>
                      <Typography variant="large" color="gray" className="text-xs">
                          {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                  </div>
                  <Typography variant="paragraph" className="text-lg">
                      {comment.text}
                  </Typography>
              </div>
          ))
      ) : (
          <Typography>Sé el primero en comentar.</Typography>
      )}
    </CardBody>
  </Card>
</div>
      {/* --- FIN: COLUMNA DERECHA --- */}
      
    </div>
  );
}


export default Video;
