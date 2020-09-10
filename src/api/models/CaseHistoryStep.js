"use strict";

module.exports = (sequelize, DataTypes) => {
	const CaseHistoryStep = sequelize.define(
		"CaseHistoryStep",
		{
			idCaseHistory: {
				type: DataTypes.INTEGER,
				required: false,
			},
			idCaseStep: {
				type: DataTypes.INTEGER,
				required: false,
			},
			timeStep: {
				type: DataTypes.STRING,
				required: false,
			},
			idCaseHistoryStepStatus: {
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
			tableName: "CaseHistoryStep",
		}
	);

	CaseHistoryStep.associate = function (models) {
		models.CaseHistoryStep.belongsTo(models.CaseStep, {
			foreignKey: "idCaseStep",
		});
		models.CaseHistoryStep.belongsTo(models.CaseHistoryStepStatus, {
			foreignKey: "idCaseHistoryStepStatus",
		});
		models.CaseHistoryStep.belongsTo(models.CaseHistory, {
			foreignKey: "idCaseHistory",
		});
	};
	return CaseHistoryStep;
};
