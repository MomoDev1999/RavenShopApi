const fs = require("fs");
const path = require("path");

const categoriasPath = path.join(__dirname, "../data/categorias.json");

// Leer datos del archivo JSON
const leerCategorias = () => {
  try {
    const data = fs.readFileSync(categoriasPath);
    const categorias = JSON.parse(data);

    // Validar la estructura del JSON
    if (!Array.isArray(categorias.categories)) {
      throw new Error("El formato del archivo de categorías es incorrecto");
    }

    return categorias;
  } catch (error) {
    throw new Error("Error al leer el archivo de categorías: " + error.message);
  }
};

// Escribir datos en el archivo JSON
const escribirCategorias = (categorias) => {
  try {
    // Validar la estructura del JSON antes de escribir
    if (!Array.isArray(categorias.categories)) {
      throw new Error("El formato de las categorías es incorrecto");
    }
    fs.writeFileSync(categoriasPath, JSON.stringify(categorias, null, 2));
  } catch (error) {
    throw new Error(
      "Error al escribir en el archivo de categorías: " + error.message
    );
  }
};

// Validar una categoría
const validarCategoria = (categoria) => {
  if (typeof categoria.id !== "number" || typeof categoria.name !== "string") {
    throw new Error("Datos de categoría incorrectos");
  }

  if (categoria.subcategories) {
    if (!Array.isArray(categoria.subcategories)) {
      throw new Error("El formato de subcategorías es incorrecto");
    }
    categoria.subcategories.forEach((subcategoria) => {
      if (
        typeof subcategoria.id !== "number" ||
        typeof subcategoria.name !== "string"
      ) {
        throw new Error("Datos de subcategoría incorrectos");
      }
    });
  }
};

// Verificar si la categoría existe
const categoriaExiste = (categorias, id) => {
  return categorias.categories.some((categoria) => categoria.id === id);
};

// Obtener todas las categorías
exports.getAllCategorias = (req, res) => {
  try {
    const categorias = leerCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva categoría
exports.createCategoria = (req, res) => {
  try {
    const categorias = leerCategorias();
    const nuevaCategoria = req.body;

    // Validar los datos de la nueva categoría
    if (!nuevaCategoria.id || !nuevaCategoria.name) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Validar la nueva categoría
    validarCategoria(nuevaCategoria);

    // Verificar si la categoría ya existe
    if (categoriaExiste(categorias, nuevaCategoria.id)) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    categorias.categories.push(nuevaCategoria);
    escribirCategorias(categorias);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una categoría
exports.updateCategoria = (req, res) => {
  try {
    const categorias = leerCategorias();
    const { id } = req.params;
    const categoriaActualizada = req.body;

    // Validar los datos de la categoría actualizada
    if (!categoriaActualizada.id || !categoriaActualizada.name) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    validarCategoria(categoriaActualizada);

    const indiceCategoria = categorias.categories.findIndex(
      (categoria) => categoria.id === parseInt(id)
    );

    if (indiceCategoria !== -1) {
      // Verificar si la categoría con el nuevo ID ya existe
      if (
        categoriaActualizada.id !== parseInt(id) &&
        categoriaExiste(categorias, categoriaActualizada.id)
      ) {
        return res
          .status(400)
          .json({ message: "La categoría con el nuevo ID ya existe" });
      }

      categorias.categories[indiceCategoria] = {
        ...categorias.categories[indiceCategoria],
        ...categoriaActualizada,
      };
      escribirCategorias(categorias);
      res.json(categorias.categories[indiceCategoria]);
    } else {
      res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una categoría
exports.deleteCategoria = (req, res) => {
  try {
    const categorias = leerCategorias();
    const { id } = req.params;

    const categoriasActualizadas = categorias.categories.filter(
      (categoria) => categoria.id !== parseInt(id)
    );

    if (categorias.categories.length !== categoriasActualizadas.length) {
      escribirCategorias({ categories: categoriasActualizadas });
      res.json({ message: "Categoría eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una categoría específica por ID
exports.getCategoriaPorId = (req, res) => {
  try {
    const categorias = leerCategorias();
    const { id } = req.params;
    const categoria = categorias.categories.find(
      (categoria) => categoria.id === parseInt(id)
    );

    if (categoria) {
      res.json(categoria);
    } else {
      res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
