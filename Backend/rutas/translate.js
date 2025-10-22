const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  // tu código de traducción
  res.json({ success: true });
});

module.exports = router;
