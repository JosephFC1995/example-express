"use strict";

module.exports = (sequelize, DataTypes) => {
	const CaseStep = sequelize.define(
		"CaseStep",
		{
			position: {
				type: DataTypes.INTEGER,
				required: false,
			},
			description: {
				type: DataTypes.STRING,
				required: false,
			},
			expectedResult: {
				type: DataTypes.STRING,
				required: false,
			},
			idCase: {
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
			tableName: "CaseStep",
		}
	);
	CaseStep.associate = function (models) {
		models.CaseStep.hasMany(models.CaseStepExpResult, {
			foreignKey: "idCaseStep",
		});
		models.CaseStep.hasMany(models.CaseHistoryStep, {
			foreignKey: "idCaseStep",
		});
		models.CaseStep.belongsTo(models.Case, { foreignKey: "idCase" });
	};
	return CaseStep;
};
