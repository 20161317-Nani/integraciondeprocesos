const express = require('express');
const router = express.Router();
const axios = require('axios');

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
        maxResults: 12,             // Cantidad de videos a traer
        key: process.env.YOUTUBE_API_KEY, // Usa la clave de API segura
      },
    });

    // Transformamos los datos complejos de YouTube a un formato simple
    const videos = response.data.items.map(item => ({
      id: item.id,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      views: `${Math.round(item.statistics.viewCount / 1000)}k`, // Simplifica el número de vistas
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-MX'), // Formatea la fecha
    }));

    res.json(videos);

  } catch (error) {
    console.error('Error al obtener videos de YouTube:', error.message);
    res.status(500).send('Error en el servidor al contactar con la API de YouTube');
  }
});

module.exports = router;