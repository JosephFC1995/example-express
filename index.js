"use strict";

require("dotenv").config();
const express = require("express"),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	morgan = require("morgan"),
	app = express(),
	router = express.Router(),
	jwt = require("express-jwt"),
	consola = require("consola"),
	cors = require("cors"),
	fs = require("fs");
var unless = require("express-unless");

const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 5000;

app.disable("x-powered-by");
app.use(morgan("combined"));
app.use(
	bodyParser.urlencoded({
		limit: "10mb",
		extended: true,
		parameterLimit: 50000,
	})
);
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors());

const TOKEN_ROUTE = process.env.TOKEN_ROUTE;
var publicFolder = express.static(__dirname + "/public");
publicFolder.unless = unless;
app.use(publicFolder.unless({ method: "OPTIONS" }));

app.use(
	jwt({
		secret: TOKEN_ROUTE,
	}).unless({
		path: [
			"/",
			"/uploads/*",
			"/robots.txt",
			"/favicon.ico",
			"/api/v1/user/login",
			"/api/v1/user/recover",
			"/api/v1/auth/login",
		],
	})
);

fs.readdirSync(__dirname + "/src/routes")
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 && file.slice(-3) === ".js" && file !== "index.js"
		);
	})
	.forEach((file) => {
		router.use(
			"/" + file.slice(0, -3).toLowerCase(),
			require(__dirname + "/src/routes/" + file)
		);
	});

app.get("/", (req, res) => {
	return res.json({
		error: true,
		code: 403,
		detail: "No cuentas con los accesos requeridos",
	});
});

app.use("/api/v1", router);

app.listen(port, () => {
	consola.ready({
		message: `🚀 El servidor está corriendo en el puerto 5000. Visita http://localhost:${port}`,
		badge: true,
	});
});

module.exports = app;
