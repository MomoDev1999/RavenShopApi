const fs = require("fs");
const path = require("path");

const productosPath = path.join(__dirname, "../data/productos.json");

// Leer datos del archivo JSON
const leerProductos = () => {
  try {
    const data = fs.readFileSync(productosPath);
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error al leer el archivo de productos");
  }
};

// Escribir datos en el archivo JSON
const escribirProductos = (productos) => {
  try {
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
  } catch (error) {
    throw new Error("Error al escribir en el archivo de productos");
  }
};

// Validación de producto
const validarProducto = (producto) => {
  if (!producto.id || typeof producto.id !== "number") {
    return "El campo 'id' es obligatorio y debe ser un número";
  }
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
  if (!producto.description || typeof producto.description !== "string") {
    return "El campo 'description' es obligatorio y debe ser una cadena de texto";
  }
  if (!producto.category || typeof producto.category !== "string") {
    return "El campo 'category' es obligatorio y debe ser una cadena de texto";
  }
  if (
    !producto.image ||
    typeof producto.image !== "string" ||
    !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(producto.image)
  ) {
    return "El campo 'image' es obligatorio, debe ser una URL válida de imagen (jpg, jpeg, png, gif)";
  }
  if (
    !producto.rating ||
    typeof producto.rating.rate !== "number" ||
    producto.rating.rate < 0 ||
    producto.rating.rate > 5
  ) {
    return "El campo 'rating.rate' es obligatorio, debe ser un número entre 0 y 5";
  }
  if (
    !producto.rating.count ||
    typeof producto.rating.count !== "number" ||
    producto.rating.count < 0
  ) {
    return "El campo 'rating.count' es obligatorio, debe ser un número mayor o igual a 0";
  }
  return null;
};

// Obtener todos los productos
exports.getAllProductos = (req, res) => {
  try {
    const productos = leerProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo producto
exports.createProducto = (req, res) => {
  try {
    const productos = leerProductos();
    const nuevoProducto = req.body;

    // Validación del producto
    const error = validarProducto(nuevoProducto);
    if (error) {
      return res.status(400).json({ message: error });
    }

    productos.push(nuevoProducto);
    escribirProductos(productos);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un producto
exports.updateProducto = (req, res) => {
  try {
    const productos = leerProductos();
    const { id } = req.params;
    const productoActualizado = req.body;

    // Validación del producto actualizado
    const error = validarProducto(productoActualizado);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const indiceProducto = productos.findIndex(
      (producto) => producto.id === parseInt(id)
    );

    if (indiceProducto !== -1) {
      productos[indiceProducto] = {
        ...productos[indiceProducto],
        ...productoActualizado,
      };
      escribirProductos(productos);
      res.json(productos[indiceProducto]);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un producto
exports.deleteProducto = (req, res) => {
  try {
    const productos = leerProductos();
    const { id } = req.params;

    const productosActualizados = productos.filter(
      (producto) => producto.id !== parseInt(id)
    );

    if (productos.length !== productosActualizados.length) {
      escribirProductos(productosActualizados);
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar un producto por ID
exports.getProductoPorId = (req, res) => {
  try {
    const productos = leerProductos();
    const { id } = req.params;
    const producto = productos.find((producto) => producto.id === parseInt(id));

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
exports.getTop10ProductosPorRating = (req, res) => {
  try {
    const productos = leerProductos();
    // Ordenar por rating (de mayor a menor)
    const productosOrdenados = productos.sort(
      (a, b) => b.rating.rate - a.rating.rate
    );
    // Obtener los primeros 10
    const top10Productos = productosOrdenados.slice(0, 10);
    res.json(top10Productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
