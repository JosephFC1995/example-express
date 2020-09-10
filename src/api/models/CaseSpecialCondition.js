"use strict";

module.exports = (sequelize, DataTypes) => {
  const CaseSpecialCondition = sequelize.define(
    "CaseSpecialCondition",
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
      tableName: "CaseSpecialCondition"
    }
  );

  CaseSpecialCondition.associate = function(models) {
    models.CaseSpecialCondition.belongsTo(models.Case, {
      foreignKey: "idCase"
    });
  };
  return CaseSpecialCondition;
};
