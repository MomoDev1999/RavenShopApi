const { User } = require("../models");
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

// Validación de teléfono
const esTelefonoValido = (telefono) => /^[0-9]{8}$/.test(telefono);

// Validación de email
const esEmailValido = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

// Salts para bcrypt
const saltRounds = 10;

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
  try {
    const nuevoUsuario = req.body;

    // Validación de datos
    const errores = [];
    if (!nuevoUsuario.user || nuevoUsuario.user.length < 3) {
      errores.push("Usuario es requerido y debe tener al menos 3 caracteres.");
    }
    if (!esTelefonoValido(nuevoUsuario.phone)) {
      errores.push("Teléfono es requerido y debe tener exactamente 8 dígitos.");
    }
    if (!nuevoUsuario.name) {
      errores.push("Nombre es requerido.");
    }
    if (!nuevoUsuario.birthdate) {
      errores.push("Fecha de nacimiento es requerida.");
    }
    if (!esEmailValido(nuevoUsuario.email)) {
      errores.push("Correo electrónico es requerido y debe ser válido.");
    }
    if (!nuevoUsuario.address) {
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
    const usuarioExistente = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          { email: nuevoUsuario.email },
          { user: nuevoUsuario.user },
        ],
      },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        message: "El usuario o el correo electrónico ya están registrados.",
      });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(nuevoUsuario.password, saltRounds);
    nuevoUsuario.password = hashedPassword;

    const usuarioCreado = await User.create(nuevoUsuario);
    res.status(201).json(usuarioCreado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un usuario existente
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioActualizado = req.body;

    const errores = [];
    if (
      usuarioActualizado.phone &&
      !esTelefonoValido(usuarioActualizado.phone)
    ) {
      errores.push("Teléfono es requerido y debe tener exactamente 8 dígitos.");
    }
    if (usuarioActualizado.email && !esEmailValido(usuarioActualizado.email)) {
      errores.push("Correo electrónico debe ser válido.");
    }
    if (usuarioActualizado.password && usuarioActualizado.password.length < 6) {
      errores.push("Contraseña debe tener al menos 6 caracteres.");
    }
    if (errores.length > 0) {
      return res.status(400).json({ message: errores.join(" ") });
    }

    const usuario = await User.findByPk(id);

    if (usuario) {
      // Cifrar la nueva contraseña si se proporciona
      if (usuarioActualizado.password) {
        const hashedPassword = await bcrypt.hash(
          usuarioActualizado.password,
          saltRounds
        );
        usuarioActualizado.password = hashedPassword;
      }

      await usuario.update(usuarioActualizado);
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id);

    if (usuario) {
      await usuario.destroy();
      res.json({ message: "Usuario eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario específico por ID
exports.getUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findByPk(id);

    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login de usuario
exports.loginUsuario = async (req, res) => {
  try {
    const { userOrEmail, password } = req.body;

    if (!userOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuario o correo electrónico y contraseña son requeridos.",
      });
    }

    const usuario = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email: userOrEmail }, { user: userOrEmail }],
      },
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario o correo electrónico no encontradododo.",
      });
    }

    const coincide = await bcrypt.compare(password, usuario.password);

    if (!coincide) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta.",
      });
    }

    res.json({
      success: true,
      user: usuario,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verificar si un usuario o correo electrónico ya existe
exports.userExists = async (req, res) => {
  try {
    const { email, user } = req.body;

    const usuarioExistente = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }, { user }],
      },
    });

    res.status(200).json({ exists: !!usuarioExistente }); // Se asegura de devolver un booleano
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
