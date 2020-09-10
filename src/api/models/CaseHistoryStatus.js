"use strict";

module.exports = (sequelize, DataTypes) => {
	const CaseHistoryStatus = sequelize.define(
		"CaseHistoryStatus",
		{
			name: {
				type: DataTypes.STRING,
				required: false,
			},
		},
		{
			freezeTableName: false,
			tableName: "CaseHistoryStatus",
		}
	);
	CaseHistoryStatus.associate = function (models) {
		models.CaseHistoryStatus.hasMany(models.CaseHistory, {
			foreignKey: "idCaseHistoryStatus",
		});
	};
	return CaseHistoryStatus;
};
