module.exports = (function () {
	"use strict";
	require("dotenv").config();
	const app = require("express").Router();
	const jsonwebtoken = require("jsonwebtoken");
	const TOKEN_ROUTE = process.env.TOKEN_ROUTE;

	app.post("/login", (req, res, next) => {
		const { user } = req.body;
		if (!user) {
			res.send(401, "Error al logearse");
		}

		const accessToken = jsonwebtoken.sign(
			{
				id: user.id,
				username: user.username,
				name: user.name,
				lastName: user.lastName,
				phone: user.phone,
				email: user.email,
				avatar: user.File ? user.File.path : null,
				scope: [user.UserRole.name],
			},
			TOKEN_ROUTE
		);
		res.json({
			token: {
				accessToken,
			},
		});
	});

	app.get("/user", (req, res, next) => {
		res.json({ user: req.user });
	});

	app.post("/logout", (req, res, next) => {
		res.json({ status: "OK" });
	});

	app.use((err, req, res, next) => {
		console.error(err); // eslint-disable-line no-console
		res.status(401).send(err + "a");
	});

	return app;
})();
