// Users.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_version = require("../api/controllers/Version.Controller");

	app.post("/", c_version.create);

	app.get("/", c_version.findAllByProject);

	app.get("/:id", c_version.findOneByProyect);

	return app;
})();
