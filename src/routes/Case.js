// Case.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_case = require("../api/controllers/Case.Controller");
	require("dotenv").config();

	app.get("/", c_case.findAll);

	app.post("/", c_case.create);

	app.post("/reprograming", c_case.reprograming);

	app.put("/reprograming/:id", c_case.reprogramingCase);

	app.get("/tester/:id_tester", c_case.findAllByTester);

	app.get("/projects/:id_project", c_case.caseByProject);

	app.post("/start-case", c_case.startCaseTester);

	app.get("/:id", c_case.findOne);

	app.put("/asigntester/:id", c_case.asignTesterToCase);

	app.put("/:id", c_case.update);

	app.delete("/:id", c_case.delete);

	return app;
})();
