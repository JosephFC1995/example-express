"use strict";

module.exports = (sequelize, DataTypes) => {
  const CaseStepExpResult = sequelize.define(
    "CaseStepExpResult",
    {
      description: {
        type: DataTypes.STRING,
        required: false
      },
      idCaseStep: {
        type: DataTypes.INTEGER,
        required: false
      },
      status: {
        type: DataTypes.INTEGER,
        required: false
      },
      idUser: {
        type: DataTypes.INTEGER,
        required: false
      }
    },
    {
      freezeTableName: false,
      tableName: "CaseStepExpResult"
    }
  );
  CaseStepExpResult.associate = function(models) {
    models.CaseStepExpResult.belongsTo(models.CaseStep, {
      foreignKey: "idCaseStep"
    });
  };
  return CaseStepExpResult;
};
