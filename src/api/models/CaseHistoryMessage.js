"use strict";

module.exports = (sequelize, DataTypes) => {
	const CaseHistoryMessage = sequelize.define(
		"CaseHistoryMessage",
		{
			message: {
				type: DataTypes.STRING,
				required: false,
			},
			idUser: {
				type: DataTypes.INTEGER,
				required: false,
			},
			idCaseHistory: {
				type: DataTypes.INTEGER,
				required: false,
			},
			status: {
				type: DataTypes.INTEGER,
				required: false,
			},
		},
		{
			freezeTableName: false,
			tableName: "CaseHistoryMessage",
		}
	);
	CaseHistoryMessage.associate = function (models) {
		// models.CaseHistoryMessage.hasMany(models.CaseHistory, {
		// 	foreignKey: "idCaseHistoryMessage",
		// });
		models.CaseHistoryMessage.belongsTo(models.CaseHistory, {
			foreignKey: "idCaseHistory",
		});
		models.CaseHistoryMessage.belongsTo(models.User, {
			foreignKey: "idUser",
		});
	};
	return CaseHistoryMessage;
};
