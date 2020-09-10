"use strict";

module.exports = (sequelize, DataTypes) => {
	const Case = sequelize.define(
		"Case",
		{
			name: {
				type: DataTypes.STRING,
				required: false,
			},
			idProject: {
				type: DataTypes.INTEGER,
				required: false,
			},
			identification: {
				type: DataTypes.STRING,
				required: false,
			},
			description: {
				type: DataTypes.STRING,
				required: false,
			},
			objetive: {
				type: DataTypes.STRING,
				required: false,
			},
			idComplexity: {
				type: DataTypes.STRING,
				required: false,
			},
			dateCreate: {
				type: DataTypes.STRING,
				required: false,
			},
			idUserTester: {
				type: DataTypes.INTEGER,
				required: false,
			},
			idCaseStatus: {
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
			tableName: "Case",
		}
	);
	Case.associate = function (models) {
		models.Case.belongsTo(models.User, { foreignKey: "idUserTester" });
		models.Case.belongsTo(models.CaseStatus, { foreignKey: "idCaseStatus" });
		models.Case.hasMany(models.CaseStep, { foreignKey: "idCase" });
		models.Case.hasMany(models.CaseSpecialCondition, { foreignKey: "idCase" });
		models.Case.hasMany(models.CasePreCondition, { foreignKey: "idCase" });
		models.Case.hasMany(models.CasePostCondition, { foreignKey: "idCase" });
		models.Case.hasMany(models.CaseHistory, { foreignKey: "idCase" });
		models.Case.belongsTo(models.Project, { foreignKey: "idProject" });
		models.Case.belongsTo(models.Complexity, {
			foreignKey: "idComplexity",
		});
		models.Case.belongsTo(models.CaseDesign, {
			foreignKey: "idCaseDesign",
		});
	};
	return Case;
};
