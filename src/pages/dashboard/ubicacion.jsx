/*import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { MapPinIcon } from "@heroicons/react/24/solid";

export function ubicacion() {
  // Configurar el centro del mapa (por ejemplo Ciudad de México)
  const center = { lat: 19.4326, lng: -99.1332 };

  // Tamaño del mapa
  const containerStyle = {
    width: "100%",
    height: "600px",
    borderRadius: "0.75rem",
  };

  // Cargar la API de Google Maps
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "TU_API_KEY_AQUI", // Reemplaza con tu clave de Google Maps
  });

  return (
    <div className="mt-12 flex flex-col md:flex-row gap-6">
      {/* Mapa grande *//*}/*
      <div className="flex-1 bg-white rounded-xl shadow-lg p-4">
        <Typography variant="h6" color="blue-gray" className="mb-4 font-bold flex items-center gap-2">
          <MapPinIcon className="h-6 w-6 text-blue-500" />
          Mapa de Ubicación
        </Typography>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
          >
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-[600px] text-gray-500">
            Cargando mapa...
          </div>
        )}
      </div>

      {/* Recuadros pequeños tipo video *//*}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        {[1, 2, 3, 4].map((video) => (
          <Card key={video} className="shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-300 h-40 flex items-center justify-center text-gray-700">
              Video {video}
            </div>
            <CardBody className="p-2">
              <Typography variant="small" className="font-semibold">
                Video sugerido {video}
              </Typography>
              <Typography variant="paragraph" className="text-gray-600 text-sm">
                Descripción breve del video sugerido {video}.
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ubicacion;*/
