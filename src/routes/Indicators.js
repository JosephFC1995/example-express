// Indicator.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_indicators = require("../api/controllers/Indicators.Controller");
	require("dotenv").config();

	app.get("/principal", c_indicators.indicatorCoverage);

	app.get("/reports", c_indicators.reports);

	app.get("/dashboard", c_indicators.indicatorCoverageDashboard);

	app.post("/generate", c_indicators.generateReport);

	return app;
})();
