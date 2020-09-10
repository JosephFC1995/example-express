// Case.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_case_history_step = require("../api/controllers/CaseHistoryStep.Controller");
	require("dotenv").config();

	//   app.get("/", c_case_history.findAll);

	//   app.get("/projects/:id_project", c_case_history.caseByProject);

	//     app.get("/:id", c_case_history.findOne);

	// app.get("/step/:id", c_case_history_step.findOneBySlug);

	app.put("/:id", c_case_history_step.update);

	//   app.post("/", c_case_history.create);

	return app;
})();
