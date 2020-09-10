// Aux.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_project = require("../api/controllers/Project.Controller");
	require("dotenv").config();

	app.get("/projects", c_project.findAllForSelects);

	return app;
})();
