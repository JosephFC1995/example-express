"use strict";

module.exports = (sequelize, DataTypes) => {
	const CaseDesign = sequelize.define(
		"CaseDesign",
		{
			name: {
				type: DataTypes.STRING,
				required: false,
			},
			url: {
				type: DataTypes.STRING,
				required: false,
			},
		},
		{
			freezeTableName: false,
			tableName: "CaseDesign",
		}
	);
	CaseDesign.associate = function (models) {
		models.CaseDesign.hasMany(models.Case, { foreignKey: "idCaseDesign" });
	};
	return CaseDesign;
};
