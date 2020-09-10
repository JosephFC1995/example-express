"use strict";

module.exports = (sequelize, DataTypes) => {
  const ProjectFile = sequelize.define(
    "ProjectFile",
    {
      idFile: {
        type: DataTypes.INTEGER,
        required: false
      },
      idProject: {
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
      tableName: "ProjectFile"
    }
  );
  ProjectFile.associate = function(models) {
    models.ProjectFile.belongsTo(models.File, { foreignKey: "idFile" });
    models.ProjectFile.belongsTo(models.Project, { foreignKey: "idProject" });
  };
  return ProjectFile;
};
