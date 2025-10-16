const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importamos el guardia de seguridad
const User = require('../models/usuarios');

// @ruta    PUT /api/users/location
// @desc    Actualizar la ubicación del usuario logueado
// @acceso  Privado
router.put('/location', auth, async (req, res) => {
  try {
    const { longitude, latitude } = req.body;

    // Busca al usuario por el ID que viene en el token y actualiza su ubicación
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      { new: true } // Devuelve el documento actualizado
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Ubicación actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// @ruta    POST /api/users/history
// @desc    Añadir un video al historial del usuario
// @acceso  Privado
router.post('/history', auth, async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ message: 'Se requiere el ID del video' });
    }
    
    // Busca al usuario y añade el video a su historial
    // $push añade un elemento al array 'history'
    await User.findByIdAndUpdate(req.user.id, {
      $push: { history: { videoId: videoId, watchedAt: new Date() } }
    });
    
    res.status(200).json({ message: 'Video añadido al historial' });
  } catch (error) {
    console.error('Error al guardar en historial:', error);
    res.status(500).send('Error en el servidor');
  }
});


// @ruta    GET /api/users/history
// @desc    Obtener el historial del usuario con filtros
// @acceso  Privado
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let history = user.history.reverse(); // Muestra los más recientes primero

    const { period } = req.query; // Obtiene el filtro de la URL (day, week, etc.)
    const now = new Date();
    
    if (period) {
      let startDate;
      switch (period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          break;
      }
      if (startDate) {
        history = history.filter(item => new Date(item.watchedAt) >= startDate);
      }
    }

    res.json(history);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).send('Error en el servidor');
  }
});



module.exports = router;