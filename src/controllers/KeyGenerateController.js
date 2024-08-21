const crypto = require("crypto");
const { Key } = require("../models");

// Función para generar una API Key
function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}

// Controlador para generar una nueva API Key
exports.generateApiKey = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const apiKey = generateApiKey();
  const newEntry = {
    userId,
    apiKey,
    createdAt: new Date(),
  };

  try {
    // Guardar la nueva API key en la base de datos
    await Key.create(newEntry);
    res.json({ apiKey });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating API key", error: error.message });
  }
};
