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

module.exports = router;