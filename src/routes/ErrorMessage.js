// Error.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_errorMessage = require("../api/controllers/ErrorMessage.Controller");
	require("dotenv").config();

	//   app.get("/", c_errorMessage.findAll);

	//   app.get("/:id", c_errorMessage.findOne);

	app.put("/:id", c_errorMessage.update);

	//   app.post("/steps", c_errorMessage.updateMultiple);

	app.post("/", c_errorMessage.create);

	app.delete("/:id", c_errorMessage.delete);

	return app;
})();
