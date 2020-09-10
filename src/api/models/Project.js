"use strict";

module.exports = (sequelize, DataTypes) => {
	const Project = sequelize.define(
		"Project",
		{
			name: {
				type: DataTypes.STRING,
				required: false,
			},
			url: {
				type: DataTypes.STRING,
				required: false,
			},
			prefix: {
				type: DataTypes.STRING,
				required: false,
			},
			duration: {
				type: DataTypes.INTEGER,
				required: false,
			},
			comentary: {
				type: DataTypes.STRING,
				required: false,
			},

			idUserDev: {
				type: DataTypes.INTEGER,
				required: false,
			},
			dateStart: {
				type: DataTypes.DATE,
				required: false,
			},
			dateFinish: {
				type: DataTypes.DATE,
				required: false,
			},
			idProjectStatus: {
				type: DataTypes.INTEGER,
				required: false,
			},
			status: {
				type: DataTypes.INTEGER,
				required: false,
			},
			idUser: {
				type: DataTypes.INTEGER,
				required: false,
			},
		},
		{
			freezeTableName: false,
			tableName: "Project",
		}
	);

	Project.associate = function (models) {
		models.Project.hasMany(models.Version, { foreignKey: "idProject" });
		models.Project.belongsTo(models.User, {
			foreignKey: "idUserDev",
			as: "UserDeveloper",
		});

		models.Project.belongsTo(models.ProjectStatus, {
			foreignKey: "idProjectStatus",
		});

		models.Project.hasMany(models.Case, { foreignKey: "idProject" });
	};

	return Project;
};
