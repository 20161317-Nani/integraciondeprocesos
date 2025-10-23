const express = require('express');
const router = express.Router();
const axios = require('axios');

// RUTA DE VIDEOS POPULARES
// @ruta    GET /api/youtube/videos
// @desc    Obtener videos populares de YouTube
// @acceso  Público
router.get('/videos', async (req, res) => {
  try {
    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';
    
    // Hacemos la petición a la API de YouTube desde el servidor
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet,statistics', // Trae detalles del video y estadísticas
        chart: 'mostPopular',       // Pide los videos más populares
        regionCode: 'MX',           // Filtra por región (México)
        maxResults: 24,             // Cantidad de videos a traer
        key: process.env.YOUTUBE_API_KEY, // Usa la clave de API segura
      },
    });

    // Transformamos los datos complejos de YouTube a un formato simple
    const videos = response.data.items.map(item => ({
      id: item.id,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatarUrl: 'https://yt3.ggpht.com/ytc/AIdro_k-3so22Fj9KMb52-323x2-A1Ww2d2s5a2x4A=s88-c-k-c0x00ffffff-no-rj', // 👈 AÑADE ESTA LÍNEA
      views: `${Math.round(item.statistics.viewCount / 1000)}k`,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-MX')
    }));

    res.json(videos);

  } catch (error) {
    console.error('Error al obtener videos de YouTube:', error.message);
    res.status(500).send('Error en el servidor al contactar con la API de YouTube');
  }
});

// RUTA DE DETALLES DE VIDEO
// @ruta    GET /api/youtube/video/:videoId
// @desc    Obtener los detalles de un video específico
// @acceso  Público
// RUTA DE DETALLES DE VIDEO
router.get('/video/:videoIds', async (req, res) => {
  try {
    const { videoIds } = req.params;
    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';
    
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet,statistics',
        id: videoIds, // La API de YouTube acepta IDs separados por coma
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const videoDetails = response.data.items.map(item => ({
        id: item.id,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        title: item.snippet.title,
        channelName: item.snippet.channelTitle,
        channelAvatarUrl: `https://picsum.photos/48?random=${item.id}`,
        views: `${Math.round(item.statistics.viewCount / 1000)}k`,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-MX'),
    }));
    
    res.json(videoDetails);

  } catch (error) {
    console.error('Error al obtener detalles del video:', error.message);
    res.status(500).send('Error en el servidor');
  }
});

// RUTA DE BÚSQUEDA
// @ruta    GET /api/youtube/search
// @desc    Buscar videos en YouTube por un término
// @acceso  Público
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query; // Obtiene el término de búsqueda de la URL (ej. ?q=react)
    if (!q) {
      return res.status(400).json({ message: 'Se requiere un término de búsqueda' });
    }

    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
    
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet',
        q: q,                       // El término a buscar
        type: 'video',              // Solo buscar videos
        maxResults: 24,           // Cantidad de resultados
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    // La respuesta de la búsqueda es diferente, debemos adaptarla
    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatarUrl: 'https://yt3.ggpht.com/ytc/AIdro_k-3so22Fj9KMb52-323x2-A1Ww2d2s5a2x4A=s88-c-k-c0x00ffffff-no-rj', // 👈 AÑADE ESTA LÍNEA
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-MX'),
      views: 'N/A',
    }));

    res.json(videos);

  } catch (error) {
    console.error('Error al buscar videos de YouTube:', error.message);
    res.status(500).send('Error en el servidor al buscar en YouTube');
  }
});

// RUTA DE BÚSQUEDA POR UBICACIÓN 
// @ruta    GET /api/youtube/location-search
// @desc    Buscar videos por coordenadas geográficas
// @acceso  Público
router.get('/location-search', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // --- 1. Obtener el código de país desde las coordenadas ---
    const geoResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: `${lat}+${lon}`,
        key: process.env.OPENCAGE_API_KEY,
      },
    });

    // Extraemos el código de país (ej. 'JP', 'ZA', 'MX')
    const regionCode = geoResponse.data.results[0]?.components.country_code.toUpperCase();

    if (!regionCode) {
      return res.json([]); // Si no se encuentra país, devuelve una lista vacía
    }

    // --- 2. Buscar los videos más populares para esa región en YouTube ---
    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';
    const youtubeResponse = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        regionCode: regionCode, // Usamos el código de país obtenido
        maxResults: 12,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const videos = youtubeResponse.data.items.map(item => ({
      // ... (misma transformación de siempre)
      id: item.id,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatarUrl: `https://picsum.photos/48?random=${item.id}`,
      views: `${Math.round(item.statistics.viewCount / 1000)}k`,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-MX'),
    }));

    res.json(videos);

  } catch (error) {
    console.error('Error al buscar videos por ubicación:', error.response ? error.response.data : error.message);
    // Si la API de YouTube falla para una región (ej. no hay 'mostPopular'), devuelve una lista vacía
    if (error.response && error.response.status === 400) {
      return res.json([]);
    }
    res.status(500).send('Error en el servidor');
  }
});

// --- AÑADE ESTA NUEVA RUTA COMBINADA ---
// @ruta    GET /api/youtube/combined-search
// @desc    Combina búsqueda local y regional de YouTube
// @acceso  Público
router.get('/combined-search', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
    const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

    let localVideos = [];
    let regionalVideos = [];

    // --- 1. Búsqueda Local (Geotagged) ---
    try {
      const localResponse = await axios.get(YOUTUBE_SEARCH_URL, {
        params: {
          part: 'snippet',
          location: `${lat},${lon}`,
          locationRadius: '20km', // Aumentamos un poco el radio
          type: 'video',
          maxResults: 8,
          key: process.env.YOUTUBE_API_KEY,
        },
      });
      localVideos = localResponse.data.items.map(item => ({
        id: item.id.videoId,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        title: item.snippet.title,
        channelName: item.snippet.channelTitle,
        channelAvatarUrl: `https://picsum.photos/48?random=${item.id.videoId}`,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-MX'),
        views: 'N/A',
      }));
    } catch (e) {
      console.log("No se encontraron videos locales o hubo un error en la búsqueda local.");
    }

    // --- 2. Búsqueda Regional (Populares por País) ---
    const geoResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: { q: `${lat}+${lon}`, key: process.env.OPENCAGE_API_KEY },
    });
    const regionCode = geoResponse.data.results[0]?.components.country_code.toUpperCase();

    if (regionCode) {
      const regionalResponse = await axios.get(YOUTUBE_VIDEOS_URL, {
        params: {
          part: 'snippet,statistics',
          chart: 'mostPopular',
          regionCode: regionCode,
          maxResults: 24, // Pedimos más para tener de dónde rellenar
          key: process.env.YOUTUBE_API_KEY,
        },
      });
      regionalVideos = regionalResponse.data.items.map(item => ({
        id: item.id,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        title: item.snippet.title,
        channelName: item.snippet.channelTitle,
        channelAvatarUrl: `https://picsum.photos/48?random=${item.id}`,
        views: `${Math.round(item.statistics.viewCount / 1000)}k`,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-MX'),
      }));
    }

    // --- 3. Combinar y Eliminar Duplicados ---
    const combinedVideos = [...localVideos, ...regionalVideos];
    const uniqueVideoIds = new Set();
    const uniqueVideos = combinedVideos.filter(video => {
      if (!uniqueVideoIds.has(video.id)) {
        uniqueVideoIds.add(video.id);
        return true;
      }
      return false;
    });

    res.json(uniqueVideos.slice(0, 24)); // Enviamos hasta 24 videos únicos

  } catch (error) {
    console.error('Error en la búsqueda combinada:', error.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- AÑADE ESTA NUEVA RUTA ---
// @ruta    GET /api/youtube/location-query-search
// @desc    Buscar videos con un query (q) y una ubicación (lat/lon)
// @acceso  Público
router.get('/location-query-search', async (req, res) => {
  try {
    const { q, lat, lon } = req.query; // Obtiene los 3 parámetros

    if (!q || !lat || !lon) {
      return res.status(400).json({ message: 'Se requieren término de búsqueda y coordenadas.' });
    }

    const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
    
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: 'snippet',
        q: q,                       // El término a buscar (ej. "platillos típicos")
        location: `${lat},${lon}`,  // Las coordenadas del mapa
        locationRadius: '50km',     // Un radio de 50km
        type: 'video',
        maxResults: 12,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    // Mapeamos la respuesta (igual que en la ruta /search)
    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatarUrl: `https://picsum.photos/48?random=${item.id.videoId}`,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-MX'),
      views: 'N/A',
    }));

    res.json(videos);

  } catch (error) {
    console.error('Error en la búsqueda por ubicación y query:', error.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;