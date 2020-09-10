"use strict";
const Sequelize = require("sequelize");
var fs = require("fs");
var path = require("path");
var basename = path.basename(__filename);
const mysql2 = require("mysql2");
var sequelizeLogger = require("sequelize-log-syntax-colors");
require("dotenv").config();
var db = {};
const colors = require("sequelize-log-syntax-colors");

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER,
	process.env.DATAUSER_PASSWORD,
	{
		host: process.env.DATABASE_IP,
		dialect: "mysql",
		timezone: "-05:00",
		dialectModule: mysql2,
		dialectOptions: {
			dateStrings: true,
			typeCast: true,
		},
		...sequelizeLogger,
		logging: function (text) {
			console.log("-----------------------------------------");
			console.log(colors(text));
			console.log("-----------------------------------------");
		},
	}
);

sequelize
	.authenticate()
	.then(() => {
		console.log("Se ha conectado correctamente con la base de datos");
		console.log("-----------------------------------------");
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

fs.readdirSync(__dirname + "/../models")
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 && file.slice(-3) === ".js" && file !== "index.js"
		);
	})
	.forEach((file) => {
		var model = sequelize["import"](path.join(__dirname + "/../models", file));
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
