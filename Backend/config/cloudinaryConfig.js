// Backend/config/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura el almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures',
    format: async (req, file) => 'png',
    // Genera un nombre único.
    public_id: (req, file) => `user-${req.user.id}-${Date.now()}`, 
  },
});

// Configura Multer para usar el almacenamiento de Cloudinary
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };