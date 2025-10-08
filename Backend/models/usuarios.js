// Backend/models/usuarios.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },

  // Campos para recuperar la contraseña
  resetPasswordToken: String,
  resetPasswordExpire: Date,

});


module.exports = mongoose.model('usuario', UserSchema);










