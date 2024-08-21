const express = require("express");
const router = express.Router();
const subCategoriasController = require("../controllers/SubCategoriasController");

// Rutas para categorías
router.get("/", subCategoriasController.getAllSubCategorias); // Obtener todas las categorías
router.post("/", subCategoriasController.createSubCategoria); // Crear una nueva categoría
router.put("/:id", subCategoriasController.updateSubCategoria); // Actualizar una categoría por su ID
router.delete("/:id", subCategoriasController.deleteSubCategoria); // Eliminar una categoría por su ID

// Nueva ruta para buscar una categoría por ID
router.get("/:id", subCategoriasController.getSubCategoriaPorId);

module.exports = router;
