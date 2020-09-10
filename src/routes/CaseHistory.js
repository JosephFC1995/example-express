// Case.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_case_history = require("../api/controllers/CaseHystory.Controller");
	require("dotenv").config();

	//   app.get("/", c_case_history.findAll);

	//   app.get("/projects/:id_project", c_case_history.caseByProject);

	//     app.get("/:id", c_case_history.findOne);

	app.get("/detail/:slug", c_case_history.findOneDetail);

	app.get("/slug/:slug", c_case_history.findOneBySlug);

	app.put("/finish/:slug", c_case_history.finishCase);

	app.put("/cancel/:slug", c_case_history.cancelCase);

	//   app.post("/", c_case_history.create);

	return app;
})();
