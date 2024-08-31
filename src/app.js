const express = require("express");
const cors = require("cors"); // Importar el paquete cors
const app = express();
const port = 3000;

// Importar la configuración de la base de datos
const db = require("./config/database");

// Importar el middleware
const authMiddleware = require("./middleware/authMiddleware");

// Importar las rutas
const productoRoutes = require("./routes/productoRoutes");
const categoriasRoutes = require("./routes/categoriasRoutes");
const subCategoriasRoutes = require("./routes/SubCategoriasRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const keyGenerateRoutes = require("./routes/KeyGenerateRoutes");

// Configurar CORS para permitir solo peticiones desde tu frontend
const corsOptions = {
  origin: "http://localhost:4200", // Reemplaza esto con la URL de tu frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Esta opción se usa si necesitas enviar cookies o headers de autenticación
};

app.use(cors(corsOptions)); // Usar el middleware cors con las opciones definidas

// Configurar el motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Middleware para parsear JSON
app.use(express.json());

// Hello World
app.get("/", (req, res) => {
  res.render("index");
});

// Usar el middleware para proteger las rutas con API
app.use("/api", authMiddleware());

// Rutas
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/subcategorias", subCategoriasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/generate-apikey", keyGenerateRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
