"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    static associate(models) {
      // Relación muchos a muchos con Product a través de ProductSubcategory
      Subcategory.belongsToMany(models.Product, {
        through: models.ProductSubcategory,
        foreignKey: "subcategory_id",
        as: "products",
      });
      // Relación de pertenencia con Category
      Subcategory.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }
  Subcategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Subcategory",
    }
  );
  return Subcategory;
};
