"use strict";

module.exports = (sequelize, DataTypes) => {
  const ErrorStatus = sequelize.define(
    "ErrorStatus",
    {
      name: {
        type: DataTypes.STRING,
        required: false,
      },
    },
    {
      freezeTableName: false,
      tableName: "ErrorStatus",
    }
  );
  ErrorStatus.associate = function (models) {
    models.ErrorStatus.hasMany(models.Error, { foreignKey: "idErrorStatus" });
    // models.ErrorStatus.hasMany(models.ErrorStatusExpResult, {
    //   foreignKey: "idErrorStatus",
    // });
    // models.ErrorStatus.belongsTo(models.Case, { foreignKey: "idCase" });
  };
  return ErrorStatus;
};
