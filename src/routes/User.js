module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_user = require("../api/controllers/User.Controller");
	require("dotenv").config();

	app.post("/login", c_user.login);

	app.post("/recover", c_user.recover);

	app.post("/", c_user.create);

	app.get("/", c_user.findAll);

	app.get("/:id", c_user.findOne);

	app.put("/:id", c_user.update);

	app.post("/changepassowrd", c_user.changepassowrd);

	app.delete("/:id", c_user.delete);

	app.get("/role/:nameRole", c_user.roleUser);

	return app;
})();
