import React from "react";
import { Typography, Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { SaveVideoButton } from '@/components/SaveVideoButton';

export function VideoCard({ video, savedVideoIds: initialSavedVideoIds }) {
    const savedVideoIds = initialSavedVideoIds || new Set(); 
    const isInitiallySaved = savedVideoIds.has(video.id);

    // Detiene la propagación del evento click para no navegar al video
  const handleSaveButtonClick = (event) => {
    event.preventDefault(); 
    event.stopPropagation();
    // La lógica de guardar/quitar la maneja el componente SaveVideoButton internamente
  };
  return (
    <div className="relative"> {/* Añadido relative para posicionar el botón */}
      <Link to={`/dashboard/video/${video.id}`} className="block relative">
        <div className="flex flex-col gap-2 cursor-pointer">
          <div className="relative"> {/* Div para la miniatura */}
            <img 
            src={video.thumbnailUrl} // Asegura que se use thumbnailUrl
            alt={video.title}
            className="h-full w-full object-cover"
            />
            {/* 👇 Botón de guardar sobre la miniatura 👇 */}
            <div onClick={handleSaveButtonClick} className="absolute top-1 right-1 bg-white/100 rounded-full">
              <SaveVideoButton 
                videoId={video.id} 
                initialSavedStatus={isInitiallySaved} 
              />
            </div>
          </div>
          <div className="flex gap-3 mt-2">
        {/* Avatar del canal */}
        <Avatar src={video.channelAvatarUrl} alt={video.channelName} size="sm" />        
        {/* Información del video */}
        <div className="flex flex-col">
          <Typography variant="h6" color="blue-gray" className="font-semibold text-base leading-snug">
            {video.title}
          </Typography>
          <Typography variant="small" className="text-gray-600">
            {video.channelName}
          </Typography>
          <Typography variant="small" className="text-gray-600">
            {video.views} de vistas • {video.publishedAt}
          </Typography>
        </div>
      </div>
    </div>
    </Link>
    </div>
  );
}

export default VideoCard;