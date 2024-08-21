"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Rating extends Model {
    static associate(models) {
      // Define la relación muchos a uno entre Rating y Product
      Rating.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }

  Rating.init(
    {
      rate: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "products", // Nombre de la tabla referenciada
          key: "id",
        },
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Rating",
      tableName: "ratings", // Nombre de la tabla en la base de datos
      timestamps: true, // Para que Sequelize maneje createdAt y updatedAt automáticamente
    }
  );

  return Rating;
};
