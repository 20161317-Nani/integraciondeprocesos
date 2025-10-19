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
    if (!videoId) return res.status(400).json({ message: 'Se requiere el ID del video' });
    
    console.log(`Intentando guardar video ${videoId} para usuario ${req.user.id}`); 
    
    const user = await User.findById(req.user.id);
    if (!user) {
        console.log("Usuario no encontrado al intentar guardar historial.");
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 👇 CAMBIO: Usa 'historial' 👇
    if (!Array.isArray(user.historial)) { 
        user.historial = [];           
    }
    
    // 👇 CAMBIO: Usa 'historial' 👇
    user.historial.push({ videoId: videoId, watchedAt: new Date() }); 
    
    const updatedUser = await user.save();
    
    // 👇 CAMBIO: Usa 'historial' 👇
    console.log(
      'Usuario actualizado (últimos 5 historial):', 
      updatedUser && updatedUser.historial ? updatedUser.historial.slice(-5) : 'Historial no disponible o error'
    ); 
    
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
    console.log(`--- GET /history ---`);
    console.log(`Buscando historial para usuario ID: ${req.user.id}`);

    // 👇 CAMBIO: Pide el usuario completo SIN NINGÚN .select() 👇
    const user = await User.findById(req.user.id); 

    // LOG: Muestra el objeto user completo que devuelve Mongoose
    console.log("Objeto User recuperado de BD:", user); 

    if (!user) {
      console.log('Usuario NO encontrado.');
      return res.json([]);
    }
    console.log('Usuario encontrado.');

    // Ahora accedemos a user.history
    // 👇 CAMBIO: Usa 'historial' 👇
    console.log(`Campo 'historial' existe: ${user.historial !== undefined}, Es array: ${Array.isArray(user.historial)}`);
    
    // 👇 CAMBIO: Usa 'historial' 👇
    const historyArray = Array.isArray(user.historial) ? user.historial : []; 
    
    console.log(`Historial crudo recuperado: ${historyArray.length} elementos.`);
    console.log(`Primeros 5 elementos (si existen):`, historyArray.slice(0, 5));

    let finalHistory = [...historyArray].reverse();

    // --- Tu lógica de filtrado (sin cambios) ---
    const { period } = req.query;
    const now = new Date();
    if (period && period !== 'all') { // Añadido check para 'all'
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
        finalHistory = finalHistory.filter(item => new Date(item.watchedAt) >= startDate);
      }
    }
    // --- Fin lógica de filtrado ---

console.log(`Enviando historial filtrado (${period || 'all'}): ${finalHistory.length} elementos.`);
    res.json(finalHistory);

  } catch (error) {
    console.error('Error GRAVE al obtener historial:', error); 
    res.status(500).send('Error en el servidor');
  }
});


module.exports = router;