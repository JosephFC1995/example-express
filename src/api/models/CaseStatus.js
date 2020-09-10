"use strict";

module.exports = (sequelize, DataTypes) => {
  const CaseStatus = sequelize.define(
    "CaseStatus",
    {
      name: {
        type: DataTypes.STRING,
        required: false,
      },
    },
    {
      freezeTableName: false,
      tableName: "CaseStatus",
    }
  );
  CaseStatus.associate = function (models) {
    models.CaseStatus.hasMany(models.Case, { foreignKey: "idCaseStatus" });
    // models.CaseStatus.hasMany(models.CaseStatusExpResult, {
    //   foreignKey: "idCaseStatus",
    // });
    // models.CaseStatus.belongsTo(models.Case, { foreignKey: "idCase" });
  };
  return CaseStatus;
};
