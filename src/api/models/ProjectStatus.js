"use strict";

module.exports = (sequelize, DataTypes) => {
	const ProjectStatus = sequelize.define(
		"ProjectStatus",
		{
			name: {
				type: DataTypes.STRING,
				required: false,
			},
		},
		{
			freezeTableName: false,
			tableName: "ProjectStatus",
		}
	);
	ProjectStatus.associate = function (models) {
		models.ProjectStatus.hasOne(models.Project, {
			foreignKey: "idProjectStatus",
		});
	};

	return ProjectStatus;
};
