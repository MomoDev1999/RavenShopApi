"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class ProductSubcategory extends Model {
    static associate(models) {
      // Definir asociaciones aquí
      ProductSubcategory.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      ProductSubcategory.belongsTo(models.Subcategory, {
        foreignKey: "subcategory_id",
        as: "subcategory",
      });
    }
  }

  ProductSubcategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "subcategories",
          key: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ProductSubcategory",
      tableName: "product_subcategories",
      timestamps: true, // Esto manejará los campos createdAt y updatedAt
    }
  );

  return ProductSubcategory;
};
