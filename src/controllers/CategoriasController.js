const { Category } = require("../models");

// Obtener todas las categorías
exports.getAllCategorias = async (req, res) => {
  try {
    const categorias = await Category.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva categoría
exports.createCategoria = async (req, res) => {
  try {
    const nuevaCategoria = req.body;

    // Validar los datos de la nueva categoría
    if (!nuevaCategoria.name) {
      return res
        .status(400)
        .json({ message: "El nombre de la categoría es requerido" });
    }

    // Validar la nueva categoría
    if (typeof nuevaCategoria.name !== "string") {
      return res
        .status(400)
        .json({ message: "Datos de categoría incorrectos" });
    }

    // Crear la nueva categoría
    const categoriaCreada = await Category.create(nuevaCategoria);

    res.status(201).json(categoriaCreada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una categoría
exports.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoriaActualizada = req.body;

    // Validar los datos de la categoría actualizada
    if (!categoriaActualizada.name) {
      return res
        .status(400)
        .json({ message: "El nombre de la categoría es requerido" });
    }

    const categoria = await Category.findByPk(id);

    if (categoria) {
      // Actualizar la categoría
      await categoria.update(categoriaActualizada);
      res.json(categoria);
    } else {
      res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una categoría
exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Category.findByPk(id);

    if (categoria) {
      await categoria.destroy();
      res.json({ message: "Categoría eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una categoría específica por ID
exports.getCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Category.findByPk(id);

    if (categoria) {
      res.json(categoria);
    } else {
      res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
