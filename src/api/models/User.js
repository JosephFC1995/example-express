"use strict";

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			email: {
				type: DataTypes.STRING,
			},
			username: {
				type: DataTypes.STRING,
			},
			password: {
				type: DataTypes.STRING,
				required: false,
			},
			idFile: {
				type: DataTypes.INTEGER,
				required: false,
			},
			name: {
				type: DataTypes.STRING,
				required: false,
			},
			lastName: {
				type: DataTypes.STRING,
				required: false,
			},
			phone: {
				type: DataTypes.INTEGER,
				required: false,
			},
			birthday: {
				type: DataTypes.DATE,
				required: false,
			},
			idUserRole: {
				type: DataTypes.INTEGER,
			},
			idUserStatus: {
				type: DataTypes.INTEGER,
				required: false,
			},
			isActive: {
				type: DataTypes.INTEGER,
				required: false,
			},
		},
		{
			freezeTableName: false,
			tableName: "User",
		}
	);

	User.associate = function (models) {
		models.User.hasMany(models.Project, { foreignKey: "idUserDev" });
		models.User.hasMany(models.Case, { foreignKey: "idUserTester" });
		models.User.hasMany(models.ErrorMessage, { foreignKey: "idUser" });
		models.User.hasMany(models.CaseHistoryMessage, { foreignKey: "idUser" });
		models.User.hasMany(models.Version, { foreignKey: "idUser" });
		models.User.hasMany(models.Report, { foreignKey: "idUser" });
		models.User.belongsTo(models.File, { foreignKey: "idFile" });
		models.User.belongsTo(models.UserRole, { foreignKey: "idUserRole" });
	};
	return User;
};
