// Error.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_error = require("../api/controllers/Error.Controller");
	require("dotenv").config();

	app.get("/", c_error.findAll);

	app.get("/getbydev/:id", c_error.findAllByDeveloper);

	app.get("/:id", c_error.findOne);

	app.put("/:id", c_error.update);

	app.put("/resolver/:id", c_error.resolver);

	//   app.post("/steps", c_error.updateMultiple);

	app.post("/", c_error.create);

	app.delete("/:id", c_error.delete);

	return app;
})();
