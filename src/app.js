const express = require("express");
const app = express();
const port = 3000;

// Importar la configuración de la base de datos
const db = require("./config/database");

// Importar el middleware
const authMiddleware = require("./middleware/authMiddleware");

// Importar las rutas
const productoRoutes = require("./routes/productoRoutes");
const categoriasRoutes = require("./routes/categoriasRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const keyGenerateRoutes = require("./routes/KeyGenerateRoutes");

// Configurar el motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Middleware para parsear JSON
app.use(express.json());

// Hello World
app.get("/", (req, res) => {
  res.render("index");
});

// Usar el middleware para proteger las rutas
app.use("/api", authMiddleware());

// Rutas
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/generate-apikey", keyGenerateRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
