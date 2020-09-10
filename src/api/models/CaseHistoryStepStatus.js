"use strict";

module.exports = (sequelize, DataTypes) => {
  const CaseHistoryStepStatus = sequelize.define(
    "CaseHistoryStepStatus",
    {
      name: {
        type: DataTypes.STRING,
        required: false,
      },
    },
    {
      freezeTableName: false,
      tableName: "CaseHistoryStepStatus",
    }
  );
  CaseHistoryStepStatus.associate = function (models) {
    models.CaseHistoryStepStatus.hasMany(models.CaseHistoryStep, {
      foreignKey: "idCaseHistoryStepStatus",
    });
  };
  return CaseHistoryStepStatus;
};
