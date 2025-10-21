const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API funcionando!'));

// --- DEFINIR RUTAS ---
app.use('/api/auth', require('./rutas/auth')); // <-- Rutas
app.use('/api/youtube', require('./rutas/youtube')); // <-- Ruta de Youtube
app.use("/api/translate", require("./rutas/translate")); // <-- Ruta de traducción
app.use("/api/users", require("./rutas/users")); // <-- Ruta de usuarios
app.use("/api/comments", require("./rutas/comments")); // <-- Ruta de comentarios

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
