"use strict";

module.exports = (sequelize, DataTypes) => {
  const Complexity = sequelize.define(
    "Complexity",
    {
      name: {
        type: DataTypes.STRING,
        required: false,
      },
      status: {
        type: DataTypes.INTEGER,
        required: false,
      },
    },
    {
      freezeTableName: false,
      tableName: "Complexity",
    }
  );
  Complexity.associate = function (models) {
    models.Complexity.hasMany(models.Error, { foreignKey: "idComplexity" });
    models.Complexity.hasMany(models.Case, { foreignKey: "idComplexity" });
  };
  return Complexity;
};
