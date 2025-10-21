const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); // si Node >= 18 no necesitas instalar

// Tu API Key de Google Translate desde .env
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

// POST /api/translate
router.post("/", async (req, res) => {
  const { text, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({ error: "Se requiere text y target" });
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({ q: text, target, format: "text" }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    res.json({ translatedText: data.data.translations[0].translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la traducción" });
  }
});

module.exports = router;
