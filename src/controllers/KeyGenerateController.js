const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const apiKeyFilePath = path.join(__dirname, "../data/validApiKey.json");

// Función para generar una API Key
function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}

// Función para leer el archivo JSON
function readApiKeys() {
  const data = fs.readFileSync(apiKeyFilePath, "utf-8");
  return JSON.parse(data);
}

// Función para escribir en el archivo JSON
function writeApiKeys(apiKeys) {
  fs.writeFileSync(apiKeyFilePath, JSON.stringify(apiKeys, null, 2), "utf-8");
}

// Controlador para generar una nueva API Key
exports.generateApiKey = (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const apiKey = generateApiKey();
  const newEntry = {
    userId,
    apiKey,
    createdAt: new Date().toISOString(),
  };

  // Leer las API keys existentes
  const apiKeys = readApiKeys();

  // Agregar la nueva API key
  apiKeys.keys.push(newEntry);

  // Escribir el archivo actualizado
  writeApiKeys(apiKeys);

  res.json({ apiKey });
};
