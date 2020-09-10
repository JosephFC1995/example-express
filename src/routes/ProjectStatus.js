// Users.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_projectstatus = require("../api/controllers/ProjectStatus.Controller");

	app.get("/", c_projectstatus.findAll);

	return app;
})();
