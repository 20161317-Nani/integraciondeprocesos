// Backend/models/usuarios.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' debe ser 'Point'
      default: 'Point'
    },
    coordinates: {
      type: [Number], // Un array de números [longitud, latitud]
      default: [0, 0]
    }
  },

  historial: [
    {
      videoId: { type: String, required: true },
      watchedAt: { type: Date, default: Date.now },
    }
  ],

  savedVideos: {
    type: [String], // Un array de IDs de video (Strings)
    default: [],
  },

  // Campos para recuperar la contraseña
  resetPasswordToken: String,
  resetPasswordExpire: Date,

});


UserSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('usuario', UserSchema);










