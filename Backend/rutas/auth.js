const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/usuarios'); // Importa el modelo

// @ruta    POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @acceso  Público
router.post('/register', async (req, res) => {
  // 1. Extraer los datos del cuerpo de la petición
  const { nombre, apellido, correo, password } = req.body;

  try {
    // 2. Verificar si el usuario ya existe
    let user = await User.findOne({ correo });
    if (user) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // 3. Si el usuario no existe, creamos una nueva instancia
    user = new User({
      nombre,
      apellido,
      correo,
      password,
    });

    // 4. Hashear (encriptar) la contraseña ANTES de guardarla
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Guardar el usuario en la base de datos
    await user.save();

    // 6. Enviar una respuesta de éxito
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });

  } catch (error) {
    console.error('Error en el registro:', error.message);
    res.status(500).send('Error en el servidor.');
  }
});

module.exports = router;