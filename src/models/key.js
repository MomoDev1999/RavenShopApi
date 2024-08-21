"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Key extends Model {
    static associate(models) {
      // define association here if needed
    }
  }

  Key.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apiKey: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "Key",
      timestamps: true,
    }
  );

  return Key;
};
