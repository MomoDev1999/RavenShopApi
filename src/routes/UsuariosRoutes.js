const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/UsuariosController");

// Rutas para usuarios
router.get("/", usuariosController.getAllUsuarios); // Obtener todos los usuarios
router.post("/", usuariosController.createUsuario); // Crear un nuevo usuario
router.put("/:id", usuariosController.updateUsuario); // Actualizar un usuario por su ID
router.delete("/:id", usuariosController.deleteUsuario); // Eliminar un usuario por su ID

// Nueva ruta para buscar un usuario por ID
router.get("/:id", usuariosController.getUsuarioPorId);

// Nueva ruta para verificar si un usuario o correo ya existe
router.post("/existe", usuariosController.userExists);

// Nueva ruta para login de usuario
router.post("/login", usuariosController.loginUsuario);

module.exports = router;
