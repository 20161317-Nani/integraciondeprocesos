const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importamos el guardia de seguridad
const User = require('../models/usuarios');
const axios = require('axios'); // Para geocodificación inversa
const { upload } = require('../config/cloudinaryConfig'); // Importa la config de subida

// --- RUTA PARA SUBIR FOTO DE PERFIL ---
// @ruta    PUT /api/users/profile-picture/upload
// @desc    Subir una nueva foto de perfil
// @acceso  Privado
router.put('/profile-picture/upload', auth, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo.' });
    }
    
    // req.file.path contiene la URL de la imagen en Cloudinary
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePictureUrl: req.file.path },
      { new: true }
    ).select('profilePictureUrl');

    res.json({ profilePictureUrl: updatedUser.profilePictureUrl });

  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).send('Error en el servidor');
  }
});


// --- RUTA PARA ACTUALIZAR DATOS DEL PERFIL (Nombre, Apellido, Teléfono) ---
// @ruta    PUT /api/users/profile
// @desc    Actualizar nombre, apellido, teléfono
// @acceso  Privado
router.put('/profile', auth, async (req, res) => {
    try {
        const { nombre, apellido, telefono } = req.body;
        const fieldsToUpdate = {};
        if (nombre) fieldsToUpdate.nombre = nombre;
        if (apellido) fieldsToUpdate.apellido = apellido;
        if (telefono) fieldsToUpdate.telefono = telefono; // Asume que tienes 'telefono' en tu Schema

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: fieldsToUpdate },
            { new: true }
        ).select('nombre apellido telefono'); // Devuelve los campos actualizados

        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).send('Error en el servidor');
    }

});
// --- RUTA PARA OBTENER EL PERFIL COMPLETO (Incluye país derivado) ---
// @ruta    GET /api/users/profile
// @desc    Obtener datos del perfil del usuario logueado
// @acceso  Privado
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        let country = 'Desconocido';
        // Intenta obtener el país si hay coordenadas válidas
        if (user.location && user.location.coordinates && user.location.coordinates[0] !== 0) {
            try {
                const [lon, lat] = user.location.coordinates;
                const geoResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                    params: { q: `${lat}+${lon}`, key: process.env.OPENCAGE_API_KEY },
                });
                country = geoResponse.data.results[0]?.components.country || 'Desconocido';
            } catch (geoError) {
                console.error("Error de geocodificación:", geoError.message);
            }
        }
        
        // Convierte a objeto simple para añadir el país
        const userProfile = user.toObject(); 
        userProfile.country = country; // Añade el país

        res.json(userProfile);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).send('Error en el servidor');
    }
});

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


// @ruta    POST /api/users/save-video
// @desc    Añadir o quitar un video de la lista de guardados (toggle)
// @acceso  Privado
router.post('/save-video', auth, async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ message: 'Se requiere el ID del video' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Asegúrate de que savedVideos sea un array
    if (!Array.isArray(user.savedVideos)) {
      user.savedVideos = [];
    }

    const savedIndex = user.savedVideos.indexOf(videoId);
    let updatedUser;

    if (savedIndex > -1) {
      // Si ya está guardado, quitarlo
      user.savedVideos.splice(savedIndex, 1);
      updatedUser = await user.save();
      res.json({ message: 'Video quitado de guardados', savedVideos: updatedUser.savedVideos });
    } else {
      // Si no está guardado, añadirlo
      user.savedVideos.push(videoId);
      updatedUser = await user.save();
      res.json({ message: 'Video guardado', savedVideos: updatedUser.savedVideos });
    }
  } catch (error) {
    console.error('Error al guardar/quitar video:', error);
    res.status(500).send('Error en el servidor');
  }
});


// @ruta    GET /api/users/saved
// @desc    Obtener la lista de IDs de videos guardados del usuario
// @acceso  Privado
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('savedVideos');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Devuelve el objeto con la propiedad 'savedVideos'
    res.json({ savedVideos: user.savedVideos || [] }); 
  } catch (error) {
    console.error('Error al obtener videos guardados:', error);
    res.status(500).send('Error en el servidor');
  }
});



module.exports = router;