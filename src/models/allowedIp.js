"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AllowedIp extends Model {
    static associate(models) {
      // define association here if needed
    }
  }

  AllowedIp.init(
    {
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AllowedIp",
      timestamps: true,
    }
  );

  return AllowedIp;
};
