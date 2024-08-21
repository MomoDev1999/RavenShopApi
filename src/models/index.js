"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize"); // Usa destructuring para importar Sequelize
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "../config/config.js"))[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    // Agrega cualquier otra opción aquí si es necesario
  });
}

// Cargar todos los modelos
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // Ignorar archivos ocultos
      file !== basename && // Ignorar este archivo
      file.slice(-3) === ".js" && // Solo archivos .js
      !file.includes(".test.js") // Ignorar archivos de prueba
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Establecer asociaciones
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
