// Error.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_historymessage = require("../api/controllers/CaseHistoryMessage.Controller");
	require("dotenv").config();

	//   app.get("/", c_errorMessage.findAll);

	//   app.get("/:id", c_errorMessage.findOne);

	app.put("/:id", c_historymessage.update);

	//   app.post("/steps", c_errorMessage.updateMultiple);

	app.post("/", c_historymessage.create);

	app.delete("/:id", c_historymessage.delete);

	return app;
})();
