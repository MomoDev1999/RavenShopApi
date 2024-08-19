const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/CategoriasController");

// Rutas para categorías
router.get("/", categoriasController.getAllCategorias); // Obtener todas las categorías
router.post("/", categoriasController.createCategoria); // Crear una nueva categoría
router.put("/:id", categoriasController.updateCategoria); // Actualizar una categoría por su ID
router.delete("/:id", categoriasController.deleteCategoria); // Eliminar una categoría por su ID

// Nueva ruta para buscar una categoría por ID
router.get("/:id", categoriasController.getCategoriaPorId);

module.exports = router;
