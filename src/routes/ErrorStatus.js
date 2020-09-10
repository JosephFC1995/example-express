// Users.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_errorstatus = require("../api/controllers/ErrorStatus.Controller");

	app.get("/", c_errorstatus.findAll);

	return app;
})();
