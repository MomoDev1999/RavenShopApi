const { Subcategory } = require("../models"); // Asegúrate de que esta ruta sea correcta
const Sequelize = require("sequelize");

// Obtener todas las subcategorías
exports.getAllSubCategorias = async (req, res) => {
  try {
    const subcategorias = await Subcategory.findAll();
    res.json(subcategorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva subcategoría
exports.createSubCategoria = async (req, res) => {
  try {
    const nuevaSubcategoria = req.body;

    // Validar datos
    if (!nuevaSubcategoria.name || nuevaSubcategoria.name.length < 3) {
      return res.status(400).json({
        message:
          "Nombre de la subcategoría es requerido y debe tener al menos 3 caracteres.",
      });
    }

    const subcategoriaCreada = await Subcategory.create(nuevaSubcategoria);
    res.status(201).json(subcategoriaCreada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una subcategoría por su ID
exports.updateSubCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategoriaActualizada = req.body;

    // Validar datos
    if (
      subcategoriaActualizada.name &&
      subcategoriaActualizada.name.length < 3
    ) {
      return res.status(400).json({
        message: "Nombre de la subcategoría debe tener al menos 3 caracteres.",
      });
    }

    const subcategoria = await Subcategory.findByPk(id);

    if (subcategoria) {
      await subcategoria.update(subcategoriaActualizada);
      res.json(subcategoria);
    } else {
      res.status(404).json({ message: "Subcategoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una subcategoría por su ID
exports.deleteSubCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategoria = await Subcategory.findByPk(id);

    if (subcategoria) {
      await subcategoria.destroy();
      res.json({ message: "Subcategoría eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Subcategoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una subcategoría específica por ID
exports.getSubCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategoria = await Subcategory.findByPk(id);

    if (subcategoria) {
      res.json(subcategoria);
    } else {
      res.status(404).json({ message: "Subcategoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
