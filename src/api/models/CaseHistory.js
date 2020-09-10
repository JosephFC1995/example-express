"use strict";

module.exports = (sequelize, DataTypes) => {
	const CaseHistory = sequelize.define(
		"CaseHistory",
		{
			slug: {
				type: DataTypes.STRING,
				required: false,
			},
			timeFinish: {
				type: DataTypes.STRING,
				required: false,
			},
			idCase: {
				type: DataTypes.INTEGER,
				required: false,
			},
			idCaseHistoryStatus: {
				type: DataTypes.INTEGER,
				required: false,
			},
			dateCreate: {
				type: DataTypes.STRING,
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
			tableName: "CaseHistory",
		}
	);

	CaseHistory.associate = function (models) {
		models.CaseHistory.hasOne(models.Error, { foreignKey: "idCaseHistory" });
		models.CaseHistory.belongsTo(models.Case, { foreignKey: "idCase" });
		models.CaseHistory.belongsTo(models.CaseHistoryStatus, {
			foreignKey: "idCaseHistoryStatus",
		});
		models.CaseHistory.hasMany(models.CaseHistoryStep, {
			foreignKey: "idCaseHistory",
		});
		models.CaseHistory.hasMany(models.CaseHistoryMessage, {
			foreignKey: "idCaseHistory",
		});
	};
	return CaseHistory;
};
