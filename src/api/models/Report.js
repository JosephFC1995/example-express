"use strict";

module.exports = (sequelize, DataTypes) => {
	const Report = sequelize.define(
		"Report",
		{
			name: {
				type: DataTypes.STRING,
				required: false,
			},
			idFile: {
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
			tableName: "Report",
		}
	);

	Report.associate = function (models) {
		models.Report.belongsTo(models.File, { foreignKey: "idFile" });
		models.Report.belongsTo(models.User, {
			foreignKey: "idUser",
		});
	};

	return Report;
};
