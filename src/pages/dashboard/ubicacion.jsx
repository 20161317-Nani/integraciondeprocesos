import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Typography, Button, Card, CardBody, Input, IconButton} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { VideoCard } from "@/widgets/cards";
import ProtectedContent from '@/components/ProtectedContent';

// Función para normalizar latitud y longitud
const normalizeLatLng = (latLng) => {
  let { lat, lng } = latLng;
  // Normaliza la longitud para que siempre esté entre -180 y 180
  while (lng < -180) lng += 360;
  while (lng > 180) lng -= 360;
  return { lat, lng };
};

// Componente para el marcador móvil (modificado para usar la normalización)
function DraggableMarker({ position, setPosition }) {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          // 👇 2. USA LA FUNCIÓN DE NORMALIZACIÓN ANTES DE ACTUALIZAR EL ESTADO 👇
          const normalizedPosition = normalizeLatLng(marker.getLatLng());
          setPosition(normalizedPosition);
        }
      },
    }),
    [setPosition],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup>Puedes mover este marcador.</Popup>
    </Marker>
  );
}


export function Ubicacion() {
  // Estados para la posición, videos, carga y mensajes
  const [currentPosition, setCurrentPosition] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [displayMode, setDisplayMode] = useState("sugeridos");

  // 1. Obtiene la ubicación inicial del navegador al cargar la página
 useEffect(() => {
    const getInitialLocation = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // 1. Intenta obtener el perfil del usuario desde la BD
        const profileResponse = await fetch('/api/users/profile', {
          headers: { 'x-auth-token': token },
        });
        const profileData = await profileResponse.json();

        // 2. Revisa si tiene una ubicación guardada y válida
        if (profileData.location && profileData.location.coordinates[0] !== 0) {
          setCurrentPosition({
            lat: profileData.location.coordinates[1], // Ojo: en GeoJSON es [long, lat]
            lng: profileData.location.coordinates[0],
          });
        } else {
          // 3. Si no hay ubicación guardada, pide permiso al navegador
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentPosition({ lat: latitude, lng: longitude });
            },
            () => { // Si falla, usa una ubicación por defecto
              setCurrentPosition({ lat: 19.4326, lng: -99.1332 });
            }
          );
        }
      } catch (error) {
        console.error("Error al obtener ubicación inicial", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialLocation();
  }, []); // Se ejecuta solo una vez al cargar

  // 2. Carga videos sugeridos o de búsqueda cuando cambia la posición o el término de búsqueda
  const fetchVideosForCurrentLocation = useCallback(async (position, currentSearchTerm) => {
    if (!position) return;
    setIsLoading(true);
    setMessage('');
    
    try {
      const { lat, lng } = position;
      let response;

      if (currentSearchTerm.trim() !== "") {
        // A. Si hay un término de búsqueda, refresca la búsqueda
        console.log(`Refrescando búsqueda de "${currentSearchTerm}" en [${lat}, ${lng}]`);
        response = await fetch(`/api/youtube/location-query-search?q=${currentSearchTerm}&lat=${lat}&lon=${lng}`);
        setDisplayMode(`"${currentSearchTerm}"`);
      } else {
        // B. Si no hay término de búsqueda, trae sugerencias
        console.log(`Cargando sugerencias en [${lat}, ${lng}]`);
        response = await fetch(`/api/youtube/combined-search?lat=${lat}&lon=${lng}`);
        setDisplayMode("sugeridos");
      }

      if (!response.ok) throw new Error("No se pudieron cargar los videos.");
      const data = await response.json();
      setSuggestedVideos(data);

    } catch (error) {
      console.error("Error al cargar videos por ubicación:", error);
      setMessage("No se pudieron cargar los videos para esta área.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Depende de 'useCallback', no de estados

  // 3. useEffect para cargar videos cuando cambia la posición o el término de búsqueda
  useEffect(() => {
    // Cuando la posición cambia, vuelve a cargar los videos
    // leyendo el estado 'searchTerm' actual.
    fetchVideosForCurrentLocation(currentPosition, searchTerm);
  }, [currentPosition, fetchVideosForCurrentLocation]); // Depende de la posición

  // 3. Guarda la ubicación en la base de datos
  const handleSaveLocation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setMessage('Debes iniciar sesión para guardar tu ubicación.');
        return;
    }

    // LÓGICA DE NORMALIZACIÓN 👇
    let longitude = currentPosition.lng;
    // Normaliza la longitud para que esté entre -180 y 180
    while (longitude < -180) longitude += 360;
    while (longitude > 180) longitude -= 360;

    try {
        await fetch('/api/users/location', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token,
            },
            // LONGITUD NORMALIZADA
            body: JSON.stringify({ latitude: currentPosition.lat, longitude: longitude }),
        });
        setMessage('¡Ubicación guardada exitosamente!');
        setTimeout(() => setMessage(''), 3000);
    } catch (error) {
        setMessage('Error al guardar la ubicación.');
    }
};
// 4. Maneja la búsqueda por ubicación y término
const handleLocationQuerySearch = async () => {
    fetchVideosForCurrentLocation(currentPosition, searchTerm);
  };

return (
  <div className="mt-12">
    <ProtectedContent message="Para usar la función de localización, debes iniciar sesión.">
      {/* 👇 CORRECCIÓN: Se eliminó 'lg:flex-row' para que siempre sea una columna 👇 */}
      <div className="flex flex-col gap-8">

        {/* --- SECCIÓN SUPERIOR: MAPA --- */}
        <div className="w-full flex flex-col gap-4">
          <Typography variant="h5">Personaliza tu Ubicación</Typography>
          <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
            {isLoading || !currentPosition ? (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <Typography>Cargando mapa...</Typography>
              </div>
            ) : (
              <MapContainer worldCopyJump={true} center={currentPosition} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker position={currentPosition} setPosition={setCurrentPosition} />
              </MapContainer>
            )}
          </div>
          <Button onClick={handleSaveLocation} color="blue">Confirmar Ubicación</Button>
          {message && <Typography color="blue-gray" className="text-center mt-2">{message}</Typography>}
        </div>
            {/* --- SECCIÓN BÚSQUEDA --- */}
         <div className="relative w-full max-w-md">
                <Input
                  label="Buscar en esta área..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLocationQuerySearch()}
                  className="pr-10"
                />
                <IconButton
                  size="sm"
                  className="!absolute right-1 top-1/2 -translate-y-1/2 rounded"
                  onClick={handleLocationQuerySearch}
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </IconButton>
              </div>

        {/* --- SECCIÓN INFERIOR: VIDEOS--- */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Typography variant="h5">
                {displayMode === "sugeridos" ? "Sugerencias Cercanas" : `Resultados para: ${displayMode}`}
              </Typography>
            </div>

            {/* --- CUADRÍCULA DE VIDEOS --- */}
            {isLoading ? (
                <Typography>Cargando...</Typography>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {suggestedVideos.length > 0 ? (
                    suggestedVideos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))
                ) : (
                    <Typography className="col-span-full text-center">
                        No se encontraron videos.
                    </Typography>
                )}
                </div>
            )}
          </div>

        </div>
    </ProtectedContent>
  </div>
);
}

export default Ubicacion;