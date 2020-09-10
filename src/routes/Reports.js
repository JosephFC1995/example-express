// Users.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_report = require("../api/controllers/Report.Controller");

	app.get("/", c_report.findAll);

	app.post("/generatecasesbyproject", c_report.generateCasesByProject);

	app.post("/generatecasesbycaseid", c_report.generateCasesByCaseID);

	return app;
})();
