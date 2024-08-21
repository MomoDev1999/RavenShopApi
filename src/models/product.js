"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      // Define la relación uno a muchos entre Product y Rating
      Product.hasMany(models.Rating, {
        foreignKey: "product_id",
        as: "ratings",
      });

      // Relación muchos a muchos con Subcategory a través de ProductSubcategory
      Product.belongsToMany(models.Subcategory, {
        through: models.ProductSubcategory,
        foreignKey: "product_id",
        as: "subcategories",
      });
    }
  }

  Product.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products", // Nombre de la tabla en la base de datos
      timestamps: true, // Para que Sequelize maneje createdAt y updatedAt automáticamente
    }
  );

  return Product;
};
