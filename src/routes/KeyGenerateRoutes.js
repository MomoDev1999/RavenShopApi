// src/routes/KeyGenerateRoutes.js
const express = require("express");
const router = express.Router();
const KeyGenerateController = require("../controllers/KeyGenerateController");

// Ruta para generar una nueva API Key
router.post("/", KeyGenerateController.generateApiKey);

module.exports = router;
