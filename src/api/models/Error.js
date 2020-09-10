"use strict";

module.exports = (sequelize, DataTypes) => {
	const Error = sequelize.define(
		"Error",
		{
			detail: {
				type: DataTypes.STRING,
				required: false,
			},
			idComplexity: {
				type: DataTypes.INTEGER,
				required: false,
			},
			idCaseHistory: {
				type: DataTypes.INTEGER,
				required: false,
			},
			idErrorStatus: {
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
			tableName: "Error",
		}
	);
	Error.associate = function (models) {
		models.Error.hasMany(models.ErrorMessage, {
			foreignKey: "idError",
		});
		models.Error.belongsTo(models.Complexity, {
			foreignKey: "idComplexity",
		});
		models.Error.belongsTo(models.ErrorStatus, {
			foreignKey: "idErrorStatus",
		});
		models.Error.belongsTo(models.CaseHistory, {
			foreignKey: "idCaseHistory",
		});
	};
	return Error;
};
