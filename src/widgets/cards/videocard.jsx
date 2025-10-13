import React from "react";
import { Typography, Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function VideoCard({ video }) {
  return (
      <Link to={`/dashboard/video/${video.id}`}>
    <div className="flex flex-col gap-2 cursor-pointer">
      {/* Miniatura del video */}
      <img 
        src={video.thumbnailUrl} 
        alt={video.title} 
        className="w-full aspect-video object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
      />
      
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
  );
}

export default VideoCard;