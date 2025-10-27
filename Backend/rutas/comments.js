const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware para rutas protegidas
const Comment = require('../models/comentarios');
const User = require('../models/usuarios'); // Para obtener el nombre

// @ruta    GET /api/comments/:videoId
// @desc    Obtener comentarios para un video
// @acceso  Público
router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
                                  .sort({ createdAt: -1 }); // Más recientes primero
    res.json(comments);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).send('Error en el servidor');
  }
});

// @ruta    POST /api/comments/:videoId
// @desc    Añadir un nuevo comentario a un video
// @acceso  Privado
router.post('/:videoId', auth, async (req, res) => {

  
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'El texto del comentario es requerido' });
    }
// 👇 SE DECLARA 'user' UNA SOLA VEZ, OBTENIENDO TODOS LOS DATOS
    const user = await User.findById(req.user.id).select('nombre apellido profilePictureUrl');
    
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const userName = `${user.nombre} ${user.apellido}`;

    const newComment = new Comment({
      videoId: req.params.videoId,
      userId: req.user.id,
      userName: userName,
      userProfilePic: user.profilePictureUrl,
      text: text,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment); // Devuelve el comentario guardado

  } catch (error) {
    console.error('Error al añadir comentario:', error);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;