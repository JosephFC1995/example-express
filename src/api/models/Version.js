"use strict";

module.exports = (sequelize, DataTypes) => {
	const Version = sequelize.define(
		"Version",
		{
			numberVersion: {
				type: DataTypes.STRING,
				required: false,
			},
			codeRegister: {
				type: DataTypes.STRING,
				required: false,
			},
			description: {
				type: DataTypes.STRING,
				required: false,
			},
			idProject: {
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
			tableName: "Version",
		}
	);

	Version.associate = function (models) {
		models.Version.belongsTo(models.Project, { foreignKey: "idProject" });
		models.Version.belongsTo(models.User, {
			foreignKey: "idUser",
		});
	};

	return Version;
};
