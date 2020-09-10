const db = require("../config/index");
require("dotenv").config();
const {
	hasUser,
	getUser,
	randomString,
	sendEmailCustomMessage,
} = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const { User, UserRole, File } = db;
var nodemailer = require("nodemailer");

const exp = {};

/**
 * Crear un nuevo usuario
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.create = async (req, res) => {
	const {
		name,
		lastName,
		email,
		birthday,
		phone,
		idUserRole,
		password,
	} = req.body;

	const passwordHash = hashSync(password, 10);
	const resulthasUser = await hasUser(email);

	if (resulthasUser)
		return res.status(203).json({
			status: 203,
			message: "Este correo ya esta registrado",
		});

	User.create({
		name: name,
		lastName: lastName,
		email: email,
		birthday: birthday,
		phone: phone,
		idUserRole: idUserRole,
		password: passwordHash,
	})
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			res.status(500).json({
				status: 500,
				message: "Hubo un problema para realizar la consulta",
				messageDeveloper: err,
			});
		});
};

/**
 * Obtener todos los usuarios
 *
 * @param {*} req
 * @param {*} res
 * @returns {Array} users
 */
exp.findAll = async (req, res) => {
	const users = await User.findAll({
		where: {
			idUserStatus: 1,
		},
		attributes: [
			"id",
			"name",
			"lastName",
			"phone",
			"email",
			"birthday",
			"idFile",
			"idUserStatus",
			"isActive",
			"createdAt",
			"updatedAt",
		],
		include: [
			{
				model: UserRole,
				required: true,
			},
			{
				model: File,
				required: false,
			},
		],
		returning: true,
	});

	return res.json(users);
};

/**
 * Obtener un usuario en base a su id
 *
 * @param {*} req
 * @param {*} res
 * @returns {Object} user
 */
exp.findOne = async (req, res) => {
	const { id } = req.params;
	if (!id)
		return res.status(500).json({
			error: true,
			message: "No se puede realizar la consulta por falta de datos",
		});

	const user = await User.findOne({
		where: {
			idUserStatus: 1,
			id: id,
		},
		attributes: [
			"id",
			"name",
			"lastName",
			"phone",
			"email",
			"birthday",
			"idUserStatus",
			"idUserRole",
			"idFile",
			"isActive",
			"createdAt",
			"updatedAt",
		],
		include: [
			{
				model: UserRole,
				required: true,
			},
			{
				model: File,
				required: false,
			},
		],
		returning: true,
	});

	if (user) {
		return res.json(user);
	} else {
		return res.send(404);
	}
};

/**
 * !Actualizar datos de un usuario
 *
 * @param {*} req
 * @param {*} res
 */
exp.update = (req, res) => {
	const { id } = req.params;
	if (!id)
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper: "No se esta enviando el parametro id del usuario",
		});

	const { body } = req;
	if (!body)
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper:
				"No se esta enviando los datos para actualizar del usuario",
		});

	User.update(body, {
		where: {
			id: id,
		},
		plain: true,
	})
		.then((numberOfAffectedRows, affectedRows) => {
			if (numberOfAffectedRows > 0) {
				res.json({
					status: 200,
					error: false,
					message: "Datos actualizados del usuario",
				});
			} else {
				res.json({
					status: 200,
					error: true,
					message: "No se logro actualizar los datos del usuario",
				});
			}
		})
		.catch((err) =>
			res.status(500).send({
				status: 500,
				message: "No se pudo actualizar los datos del usuario",
				messageDeveloper: err,
			})
		);
};

/**
 * !Eliminar un usuario (cambia de estado a un usuario)
 *
 * @param {*} req
 * @param {*} res
 */
exp.delete = (req, res) => {
	const { id } = req.params;
	if (!id)
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper: "No se esta enviando el parametro id del usuario",
		});

	User.update(
		{
			idUserStatus: 4,
		},
		{
			where: {
				id: id,
			},
		}
	)
		.then((numberOfAffectedRows, affectedRows) => {
			if (numberOfAffectedRows > 0) {
				res.json({
					status: 200,
					error: false,
					message: "Usuario eliminado",
				});
			} else {
				res.json({
					status: 200,
					error: true,
					message: "No se pudo lograr eliminar usuario",
				});
			}
		})
		.catch((err) =>
			res.status(500).send({
				status: 500,
				message: "No se pudo lograr eliminar usuario",
				messageDeveloper: err,
			})
		);
};

// exp.deleteAll = (req, res) => {};

/**
 * !Todos los usuarios en base a su rol
 *
 * @param {*} req
 * @param {*} res
 * @returns users
 */
exp.roleUser = async (req, res) => {
	const nameRole = req.params.nameRole;

	if (!nameRole)
		res.status(500).json({
			error: true,
			message: "No se ha enviado un valor para el tipo de usuario",
		});

	if (nameRole == "administrator")
		res.status(500).json({
			error: true,
			message: "No se ha enviado un valor para el tipo de usuario",
		});

	const usersByRole = await User.findAll({
		where: {
			idUserStatus: 1,
		},
		attributes: ["id", "name", "lastName", "phone", "email", "birthday"],
		include: [
			{
				model: UserRole,
				where: {
					name: nameRole,
				},
			},
			{
				model: File,
				required: false,
			},
		],
		returning: true,
	});

	return res.json(usersByRole);
};

/**
 * Logeo del usuario
 *
 * @param {*} req
 * @param {*} res
 * @returns {Object} user
 */
exp.login = async (req, res) => {
	if (Object.keys(req.body).length === 0)
		return res.status(500).json({
			status: 500,
			message: "Hay campos vacios",
		});

	const { email, password } = req.body;

	if (!email && !password)
		return res.status(203).json({
			status: 203,
			message: "Hubo un error a la hora de realizar tu consulta",
		});

	const countUser = await hasUser(email);

	if (countUser == 0)
		return res.status(203).json({
			status: 203,
			message: "El usuario no existe",
		});

	const date_user = await getUser(email);
	const passwordDB = date_user.password;

	if (compareSync(password, passwordDB)) {
		return res.status(200).json({
			status: 200,
			message: "Bienvenido",
			user: date_user,
		});
	} else {
		return res.status(203).json({
			status: 203,
			message: "El correo o contraseña es incorrecta",
		});
	}
};

exp.recover = async (req, res) => {
	const { email } = req.body;
	if (!email)
		return res.json({
			status: 203,
			error: true,
			message: "Hubo un error a la hora de realizar tu consulta",
		});

	const countUser = await hasUser(email);
	if (countUser == 0)
		return res.json({
			status: 203,
			message: "El usuario no existe",
		});
	let stringRandom = randomString(8);
	let newPasswordHash = hashSync(stringRandom, 10);
	const user = await getUser(email);
	let message =
		"Estimado usuario, su contraseña se ha reestablecido, su nueva contraseña es: " +
		stringRandom;
	User.update(
		{
			password: newPasswordHash,
		},
		{
			where: {
				id: user.id,
				email: email,
			},
		}
	)
		.then((numberOfAffectedRows, affectedRows) => {
			sendEmailCustomMessage(
				email,
				"Su contraseña se ha reestablecido",
				message
			);
			return res.json({
				status: 200,
				error: false,
				message:
					"La contraseña ha sido cambiada y enviada a su correo electrónico",
			});
		})
		.catch((err) =>
			res.send({
				status: 200,
				message: "No se pudo lograr cambiar la contraseña",
				error: true,
				messageDeveloper: err,
			})
		);
};

exp.changepassowrd = async (req, res) => {
	const { beforePassword, pass, checkPassword } = req.body;
	const { id, email } = req.user;

	if (!beforePassword && !pass && !checkpassword)
		return res.json({
			status: 203,
			error: true,
			message: "Hubo un error a la hora de realizar tu consulta",
		});

	if (pass != checkPassword)
		return res.json({
			status: 203,
			error: true,
			message: "Las contraseñas no coinciden",
		});

	const countUser = await hasUser(email);

	if (countUser == 0)
		return res.json({
			status: 203,
			message: "El usuario no existe",
		});

	const date_user = await getUser(email);
	const passwordDB = date_user.password;

	if (compareSync(beforePassword, passwordDB)) {
		let newPasswordHash = hashSync(pass, 10);
		User.update(
			{
				password: newPasswordHash,
			},
			{
				where: {
					id: id,
					email: email,
				},
			}
		)
			.then((numberOfAffectedRows, affectedRows) => {
				return res.json({
					status: 200,
					error: false,
					message: "La contraseña ha sido cambiada",
				});
			})
			.catch((err) =>
				res.send({
					status: 203,
					message: "No se pudo lograr cambiar la contraseña",
					error: true,
					messageDeveloper: err,
				})
			);
	} else {
		return res.json({
			status: 203,
			error: true,
			message: "La contraseña anterior no es correcta",
		});
	}
};

module.exports = exp;
