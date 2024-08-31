const { Key, AllowedIp } = require("../models");

module.exports = () => {
  return async (req, res, next) => {
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

    try {
      // Leer las IPs permitidas desde la base de datos
      const allowedIps = await AllowedIp.findAll();
      const allowedIpAddresses = allowedIps.map((ip) => ip.ipAddress);

      // Verificar si la IP del cliente está en la lista de IPs permitidas
      if (!allowedIpAddresses.includes(clientIp)) {
        return res
          .status(403)
          .json({ message: "Unauthorized IP: " + clientIp });
      }

      // Leer las API keys válidas desde la base de datos
      const validApiKey = await Key.findOne({ where: { apiKey } });

      // Verificar si la API Key es válida
      if (!validApiKey) {
        return res.status(403).json({ message: "Invalid API Key" });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: "Error checking API key or IP",
        error: error.message,
      });
    }
  };
};
