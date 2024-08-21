const { Product, Rating, sequelize } = require("../models");

// Validación de producto
const validarProducto = (producto) => {
  if (
    !producto.title ||
    typeof producto.title !== "string" ||
    producto.title.length > 100
  ) {
    return "El campo 'title' es obligatorio, debe ser una cadena de texto y no debe exceder 100 caracteres";
  }
  if (!producto.price || isNaN(producto.price) || producto.price <= 0) {
    return "El campo 'price' es obligatorio, debe ser un número mayor que 0";
  }
  if (producto.description && typeof producto.description !== "string") {
    return "El campo 'description' debe ser una cadena de texto";
  }
  if (
    producto.image &&
    (typeof producto.image !== "string" ||
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(producto.image))
  ) {
    return "El campo 'image' debe ser una URL válida de imagen (jpg, jpeg, png, gif)";
  }
  return null;
};

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Product.findAll({
      attributes: [
        "id",
        "title",
        "price",
        "description",
        "image",
        [
          sequelize.literal(
            "(SELECT AVG(`rate`) FROM `Ratings` WHERE `product_id` = `Product`.`id`)"
          ),
          "rate",
        ],
      ],
      include: [
        {
          model: Rating,
          as: "ratings",
          attributes: [], // No traer columnas de Rating, solo el AVG
        },
      ],
      group: ["Product.id"], // Agrupar por ID del producto
      order: [["title", "ASC"]], // Ordenar alfabéticamente por título, puedes ajustar esto si lo prefieres
    });

    // Enviar la respuesta
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
  try {
    const nuevoProducto = req.body;
    console.log(nuevoProducto);
    // Validación del producto
    const error = validarProducto(nuevoProducto);
    if (error) {
      return res.status(400).json({ message: error });
    }

    // Crear el nuevo producto
    const productoCreado = await Product.create(nuevoProducto);

    res.status(201).json(productoCreado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un producto
exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoActualizado = req.body;

    // Validación del producto actualizado
    const error = validarProducto(productoActualizado);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const producto = await Product.findByPk(id);

    if (producto) {
      // Actualizar el producto
      await producto.update(productoActualizado);
      res.json(producto);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un producto
exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Product.findByPk(id);

    if (producto) {
      await producto.destroy();
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar un producto por ID
exports.getProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Product.findByPk(id);

    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar los 10 productos con mejor rating
exports.getTop10ProductosPorRating = async (req, res) => {
  try {
    // Usar Sequelize para realizar la consulta
    const productos = await Product.findAll({
      attributes: [
        "id",
        "title",
        "price",
        "description",
        "image",
        [
          sequelize.literal(
            "(SELECT AVG(`rate`) FROM `Ratings` WHERE `product_id` = `Product`.`id`)"
          ),
          "rate",
        ],
      ],
      include: [
        {
          model: Rating,
          as: "ratings",
          attributes: [], // No queremos traer columnas de Rating, solo el AVG
        },
      ],
      group: ["Product.id"], // Agrupar por ID del producto
      order: [[sequelize.literal("rate"), "DESC"]], // Ordenar por el promedio de rating
      limit: 10, // Limitar a los 10 mejores
    });

    // Enviar la respuesta
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener los productos por rating:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los productos por rating" });
  }
};

// Buscar productos por subcategoría
exports.getProductosPorSubcategoria = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const productos = await Product.findAll({
      attributes: [
        "id",
        "title",
        "price",
        "description",
        "image",
        [
          sequelize.literal(
            "(SELECT AVG(`rate`) FROM `Ratings` WHERE `product_id` = `Product`.`id`)"
          ),
          "rate",
        ],
      ],
      include: [
        {
          model: Rating,
          as: "ratings",
          attributes: [], // No traer columnas de Rating, solo el AVG
        },
        {
          model: sequelize.models.Subcategory,
          as: "subcategories",
          through: {
            attributes: [], // No traer columnas de la tabla intermedia
          },
          where: { id: subcategoryId },
          attributes: [], // Solo necesitamos verificar la existencia de la subcategoría
        },
      ],
      group: ["Product.id"], // Asegúrate de que todas las columnas estén agrupadas
      order: [["title", "ASC"]], // Ordenar alfabéticamente por título
    });

    // Enviar la respuesta
    res.json(productos);
  } catch (error) {
    console.error("Error al buscar productos por subcategoría:", error);
    res
      .status(500)
      .json({ message: "Error al buscar productos por subcategoría" });
  }
};
