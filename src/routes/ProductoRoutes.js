const express = require("express");
const router = express.Router();
const productoController = require("../controllers/ProductoController");

// Rutas para productos
router.get("/", productoController.getAllProductos); // Obtener todos los productos
router.post("/", productoController.createProducto); // Crear un nuevo producto
router.put("/:id", productoController.updateProducto); // Actualizar un producto por su ID
router.delete("/:id", productoController.deleteProducto); // Eliminar un producto por su ID

// Ruta para buscar un producto por ID
router.get("/:id", productoController.getProductoPorId); // Buscar un producto por ID

// Ruta para obtener los 10 productos con mejor rating
router.get("/top10", productoController.getTop10ProductosPorRating); // Obtener los 10 productos con mejor rating

module.exports = router;
