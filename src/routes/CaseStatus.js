// Users.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_casesatus = require("../api/controllers/CaseStatus.Controller");

	app.get("/", c_casesatus.findAll);

	return app;
})();
