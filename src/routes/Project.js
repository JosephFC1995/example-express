// Projects.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_project = require("../api/controllers/Project.Controller");
	require("dotenv").config();

	app.get("/", c_project.findAll);

	app.get("/:id", c_project.findOne);

	app.put("/:id", c_project.update);

	app.post("/", c_project.create);

	app.delete("/:id", c_project.delete);

	app.post("/close/:id", c_project.closeProyect);

	app.post("/active/:id", c_project.activeProyect);

	return app;
})();
