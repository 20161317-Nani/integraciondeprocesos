const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  videoId: { // ID del video de YouTube al que pertenece
    type: String,
    required: true,
    index: true, // Índice para buscar rápido por videoId
  },
  userId: { // ID del usuario que comentó
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuario', // Referencia a tu modelo User
    required: true, // Solo usuarios logueados pueden comentar
  },
  userName: { // Guardamos el nombre para mostrarlo fácil
    type: String,
    required: true,
  },
  text: { // El texto del comentario
    type: String,
    required: true,
  },
  createdAt: { // Fecha para ordenar
    type: Date,
    default: Date.now,
  },
  userProfilePic: {
    type: String,
    default: 'https://res.cloudinary.com/dqrk93n3a/image/upload/v1717887348/profile_pictures/user-default-avatar.png'
  }
});

module.exports = mongoose.model('comment', CommentSchema);