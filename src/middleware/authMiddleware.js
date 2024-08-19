const fs = require("fs");
const path = require("path");

// Rutas de los archivos JSON
const validApiKeyFilePath = path.join(__dirname, "../data/validApiKey.json");
const allowedIpFilePath = path.join(__dirname, "../data/allowedIp.json");

// Función para leer las API keys desde el archivo JSON
function readValidApiKeys() {
  const data = fs.readFileSync(validApiKeyFilePath, "utf-8");
  const parsedData = JSON.parse(data);
  return parsedData.keys;
}

// Función para leer las IPs permitidas desde el archivo JSON
function readAllowedIps() {
  const data = fs.readFileSync(allowedIpFilePath, "utf-8");
  const parsedData = JSON.parse(data);
  return parsedData.allowedIps;
}

// Middleware para verificar la API Key y la IP del cliente
module.exports = () => {
  return (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    let clientIp = req.ip;

    // Normalizar la IP para eliminar el prefijo ::ffff: si está presente
    if (clientIp.startsWith("::ffff:")) {
      clientIp = clientIp.replace("::ffff:", "");
    }

    // Comprobar si la IP es localhost
    if (clientIp === "::1") {
      clientIp = "127.0.0.1";
    }

    // Leer las IPs permitidas y las API keys válidas
    const allowedIps = readAllowedIps();
    const validApiKeys = readValidApiKeys();

    // Verificar si la IP del cliente está en la lista de IPs permitidas
    if (!allowedIps.includes(clientIp)) {
      return res.status(403).json({ message: "Unauthorized IP: " + clientIp });
    }

    // Verificar si la API Key es válida
    const apiKeyIsValid = validApiKeys.some((key) => key.apiKey === apiKey);
    if (!apiKeyIsValid) {
      return res.status(403).json({ message: "Invalid API Key" });
    }

    next();
  };
};
