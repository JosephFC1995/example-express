// Projects.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_caseDesign = require("../api/controllers/CaseDesign.Controller");
	require("dotenv").config();

	app.get("/", c_caseDesign.findAll);

	//   app.get("/:id", c_complexity.findOne);

	//   app.put("/:id", c_complexity.update);

	//   app.post("/", c_complexity.create);

	//   app.delete("/:id", c_complexity.delete);

	return app;
})();
