const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/usuarios'); // Importa el modelo
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth'); // Middleware para rutas protegidas

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

// LINEA PARA validación del LOGIN

// @ruta    POST /api/auth/login
// @desc    Autenticar un usuario y devolver un token
// @acceso  Público
router.post('/login', async (req, res) => {
  // 1. Extraer correo y password del cuerpo de la petición
  const { correo, password } = req.body;

  try {
    // 2. Buscar al usuario por su correo en la BD
    let user = await User.findOne({ correo });
    if (!user) {
      // Si el usuario no existe, enviamos un error genérico
      return res.status(400).json({ message: 'Credenciales no válidas' });
    }

    // 3. Comparar la contraseña enviada con la guardada (hasheada) en la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Si las contraseñas no coinciden, enviamos el mismo error genérico
      return res.status(400).json({ message: 'Credenciales no válidas' });
    }

    // 4. Si las credenciales son correctas, creamos el "pase de acceso" (Token)
    const payload = {
      user: {
        id: user.id, // Guardamos el ID del usuario en el token
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Usamos la palabra secreta del .env
      { expiresIn: '5h' },   // El token expira en 5 horas
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Enviamos el token al frontend
      }
    );
  } catch (error) {
    console.error('Error en el login:', error.message);
    res.status(500).send('Error en el servidor.');
  }
});

// --- RUTA PARA SOLICITAR EL RESETEO DE CONTRASEÑA ---
router.post('/forgot-password', async (req, res) => {
  const { correo } = req.body;
  try {
    const user = await User.findOne({ correo });
    if (!user) {
      // Por seguridad, no revelamos si el usuario existe o no
      return res.status(200).json({ message: 'Si el correo está registrado, recibirás un email con instrucciones.' });
    }

    // 1. Generar un token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // 2. Guardar el token (hasheado) y la fecha de expiración en la BD
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Expira en 10 minutos
    await user.save();

    // 3. Crear el link de reseteo
    const resetUrl = `http://localhost:5173/auth/ResetearContra/${resetToken}`;
    const message = `Has solicitado un reseteo de contraseña. Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña:\n\n${resetUrl}\n\nSi no has sido tú, ignora este correo.`;

    // 4. Configurar y enviar el correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',      
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Tu App" <${process.env.EMAIL_USER}>`,
      to: user.correo,
      subject: 'Reseteo de Contraseña',
      text: message,
    });
    
    res.status(200).json({ message: 'Si el correo está registrado, recibirás un email con instrucciones.' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});


// --- RUTA PARA REALIZAR EL RESETEO DE CONTRASEÑA ---
router.put('/ResetearContra/:resetToken', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    // Buscar al usuario por el token hasheado y que no haya expirado
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'El token es inválido o ha expirado.' });
    }

    // Establecer la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    // Limpiar los campos del token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});


// --- Ruta para obtener los datos del usuario logueado ---
// @ruta    GET /api/auth/me
// @desc    Obtener los datos del usuario logueado
// @acceso  Privado
router.get('/me', auth, async (req, res) => { // <-- 2. APLICA EL MIDDLEWARE 'auth'
  try {
    // El middleware 'auth' ya verificó el token y nos dio el 'req.user'
    const user = await User.findById(req.user.id).select('-password'); // Busca al usuario por ID y excluye la contraseña
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});


module.exports = router;