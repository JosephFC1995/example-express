"use strict";

module.exports = (sequelize, DataTypes) => {
  const CasePreCondition = sequelize.define(
    "CasePreCondition",
    {
      description: {
        type: DataTypes.STRING,
        required: false
      },
      idCase: {
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
      tableName: "CasePreCondition"
    }
  );

  CasePreCondition.associate = function(models) {
    models.CasePreCondition.belongsTo(models.Case, { foreignKey: "idCase" });
  };
  return CasePreCondition;
};
