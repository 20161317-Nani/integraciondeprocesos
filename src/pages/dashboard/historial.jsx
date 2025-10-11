import React, { useState } from "react";
import {
  Typography,
  Card,
  CardBody,
  Input,
} from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import ProtectedContent from '@/components/ProtectedContent'; // Importar el contenido protegido

export function Historial() {
  const [search, setSearch] = useState("");

  // Datos de ejemplo para el historial
  const historialVideos = [
    { id: 1, title: "Video Tutorial React", duration: "10:23" },
    { id: 2, title: "Material Tailwind Tips", duration: "5:12" },
    { id: 3, title: "Aprende JavaScript", duration: "8:45" },
    { id: 4, title: "Next.js para principiantes", duration: "12:30" },
  ];

  // Filtrar videos según búsqueda
  const filteredVideos = historialVideos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
     <ProtectedContent message="Para configurar tu perfil personal, debes iniciar sesión.">
      {/* Todo lo que está aquí adentro solo se mostrará si el usuario ha iniciado sesión 
        // Una vez que los datos llegan, muestra el perfil*/}
    <div className="mt-12 flex flex-col gap-4">
      {/* Barra de búsqueda */}
      <div className="flex items-center gap-2 mb-4">
        <ClockIcon className="w-6 h-6 text-blue-500" />
        <Input
          type="text"
          placeholder="Buscar en tu historial..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Recuadros de historial */}
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
            No se encontraron videos
          </Typography>
        )}
      </div>
    </div>
        </ProtectedContent>
  );
}

export default Historial;
