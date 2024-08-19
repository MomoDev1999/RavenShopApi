const fs = require("fs");
const path = require("path");

const usuariosPath = path.join(__dirname, "../data/usuarios.json");

// Leer datos del archivo JSON
const leerUsuarios = () => {
  try {
    const data = fs.readFileSync(usuariosPath);
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error al leer el archivo de usuarios");
  }
};

// Escribir datos en el archivo JSON
const escribirUsuarios = (usuarios) => {
  try {
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
  } catch (error) {
    throw new Error("Error al escribir en el archivo de usuarios");
  }
};

// Validación de teléfono
const esTelefonoValido = (telefono) => /^[0-9]{8}$/.test(telefono);

// Validación de email
const esEmailValido = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

exports.getAllUsuarios = (req, res) => {
  try {
    const usuarios = leerUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUsuario = (req, res) => {
  try {
    const usuarios = leerUsuarios();
    const nuevoUsuario = req.body;

    // Validación de datos
    const errores = [];
    if (!nuevoUsuario.usuario || nuevoUsuario.usuario.length < 3) {
      errores.push("Usuario es requerido y debe tener al menos 3 caracteres.");
    }
    if (!esTelefonoValido(nuevoUsuario.telefono)) {
      errores.push("Teléfono es requerido y debe tener exactamente 8 dígitos.");
    }
    if (!nuevoUsuario.nombre) {
      errores.push("Nombre es requerido.");
    }
    if (!nuevoUsuario.apellido) {
      errores.push("Apellido es requerido.");
    }
    if (!nuevoUsuario.fecha_nacimiento) {
      errores.push("Fecha de nacimiento es requerida.");
    }
    if (!esEmailValido(nuevoUsuario.correo)) {
      errores.push("Correo electrónico es requerido y debe ser válido.");
    }
    if (!nuevoUsuario.direccion) {
      errores.push("Dirección es requerida.");
    }
    if (!nuevoUsuario.password || nuevoUsuario.password.length < 6) {
      errores.push(
        "Contraseña es requerida y debe tener al menos 6 caracteres."
      );
    }
    if (errores.length > 0) {
      return res.status(400).json({ message: errores.join(" ") });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(
      (u) =>
        u.correo === nuevoUsuario.correo || u.usuario === nuevoUsuario.usuario
    );
    if (usuarioExistente) {
      return res
        .status(400)
        .json({
          message: "El usuario o el correo electrónico ya están registrados.",
        });
    }

    usuarios.push(nuevoUsuario);
    escribirUsuarios(usuarios);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUsuario = (req, res) => {
  try {
    const usuarios = leerUsuarios();
    const { id } = req.params;
    const usuarioActualizado = req.body;

    const errores = [];
    if (
      usuarioActualizado.telefono &&
      !esTelefonoValido(usuarioActualizado.telefono)
    ) {
      errores.push("Teléfono es requerido y debe tener exactamente 8 dígitos.");
    }
    if (
      usuarioActualizado.correo &&
      !esEmailValido(usuarioActualizado.correo)
    ) {
      errores.push("Correo electrónico debe ser válido.");
    }
    if (usuarioActualizado.password && usuarioActualizado.password.length < 6) {
      errores.push("Contraseña debe tener al menos 6 caracteres.");
    }
    if (errores.length > 0) {
      return res.status(400).json({ message: errores.join(" ") });
    }

    const indiceUsuario = usuarios.findIndex(
      (usuario) => usuario.id === parseInt(id)
    );

    if (indiceUsuario !== -1) {
      usuarios[indiceUsuario] = {
        ...usuarios[indiceUsuario],
        ...usuarioActualizado,
      };
      escribirUsuarios(usuarios);
      res.json(usuarios[indiceUsuario]);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUsuario = (req, res) => {
  try {
    const usuarios = leerUsuarios();
    const { id } = req.params;

    const usuariosActualizados = usuarios.filter(
      (usuario) => usuario.id !== parseInt(id)
    );

    if (usuarios.length !== usuariosActualizados.length) {
      escribirUsuarios(usuariosActualizados);
      res.json({ message: "Usuario eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario específico por ID
exports.getUsuarioPorId = (req, res) => {
  try {
    const usuarios = leerUsuarios();
    const { id } = req.params;
    const usuario = usuarios.find((usuario) => usuario.id === parseInt(id));

    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
