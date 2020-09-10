"use strict";

module.exports = (sequelize, DataTypes) => {
  const CasePostCondition = sequelize.define(
    "CasePostCondition",
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
      tableName: "CasePostCondition"
    }
  );

  CasePostCondition.associate = function(models) {
    models.CasePostCondition.belongsTo(models.Case, { foreignKey: "idCase" });
  };
  return CasePostCondition;
};
