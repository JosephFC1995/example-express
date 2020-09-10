"use strict";

module.exports = (sequelize, DataTypes) => {
  const ErrorMessage = sequelize.define(
    "ErrorMessage",
    {
      message: {
        type: DataTypes.STRING,
        required: false,
      },
      idError: {
        type: DataTypes.INTEGER,
        required: false,
      },
      idUser: {
        type: DataTypes.INTEGER,
        required: false,
      },
      status: {
        type: DataTypes.INTEGER,
        required: false,
      },
    },
    {
      freezeTableName: false,
      tableName: "ErrorMessage",
    }
  );
  ErrorMessage.associate = function (models) {
    models.ErrorMessage.belongsTo(models.Error, { foreignKey: "idError" });
    models.ErrorMessage.belongsTo(models.User, { foreignKey: "idUser" });
  };
  return ErrorMessage;
};
