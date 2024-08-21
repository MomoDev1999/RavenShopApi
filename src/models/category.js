"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Relación uno a muchos con Subcategory
      Category.hasMany(models.Subcategory, {
        foreignKey: "category_id",
        as: "subcategories",
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
