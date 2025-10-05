import React, { useState } from "react";
import {
  Typography,
  Card,
  CardBody,
  Input,
} from "@material-tailwind/react";
import { BookmarkIcon } from "@heroicons/react/24/outline";

export function Guardados() {
  const [search, setSearch] = useState("");

  // Datos de ejemplo para los videos guardados
  const videosGuardados = [
    { id: 1, title: "Video Tutorial React", duration: "10:23" },
    { id: 2, title: "Material Tailwind Tips", duration: "5:12" },
    { id: 3, title: "Aprende JavaScript", duration: "8:45" },
    { id: 4, title: "Next.js para principiantes", duration: "12:30" },
  ];

  // Filtrar videos según búsqueda
  const filteredVideos = videosGuardados.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-12 flex flex-col gap-4">
      {/* Barra de búsqueda */}
      <div className="flex items-center gap-2 mb-4">
        <BookmarkIcon className="w-6 h-6 text-green-500" />
        <Input
          type="text"
          placeholder="Buscar en tus videos guardados..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Recuadros de videos guardados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
            >
              <div className="bg-gray-300 w-full aspect-video flex items-center justify-center text-gray-700 font-semibold">
                Miniatura
              </div>
              <CardBody>
                <Typography variant="h6" className="font-bold">
                  {video.title}
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  Duración: {video.duration}
                </Typography>
              </CardBody>
            </Card>
          ))
        ) : (
          <Typography className="col-span-full text-center text-gray-500 mt-4">
            No se encontraron videos guardados
          </Typography>
        )}
      </div>
    </div>
  );
}

export default Guardados;
