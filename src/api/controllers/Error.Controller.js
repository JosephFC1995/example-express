const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const {
	User,
	UserRole,
	File,
	Error,
	Project,
	Complexity,
	ErrorStatus,
	ErrorMessage,
	CaseHistory,
	CaseHistoryStep,
	CaseStep,
	CaseHistoryStepStatus,
	Case,
} = db;

const moment = require("moment");

const exp = {};

exp.create = async (req, res) => {
	const body = req.body;

	if (!body)
		return res.status(500).json({
			status: 500,
			message: "No puedes enviar datos vacios",
		});

	body.idUser = req.user.id;

	return await Error.create(body)
		.then((error) => {
			return res.json({
				status: 200,
				data: error,
				message: "El error registrado correctamente",
			});
		})
		.catch((err) => {
			return res.status(500).json({
				status: 500,
				message: err,
			});
		});
};

exp.findAll = async (req, res) => {
	const { dates, complexity, project, status, userDeveloper } = req.query;

	const error = await Error.findAll({
		where: {
			status: 1,
			idComplexity: {
				[Op.like]: "%" + (complexity ? complexity : "") + "%",
			},
			idErrorStatus: {
				[Op.like]: "%" + (status ? status : "") + "%",
			},
			createdAt: {
				[Op.between]: [
					dates ? dates[0].split('"').join("") : moment("1990-01-01"),
					dates ? dates[1].split('"').join("") : moment(Date.now()),
				],
			},
		},
		include: [
			{
				model: CaseHistory,
				required: true,
				include: [
					{
						model: Case,
						required: true,
						include: [
							{
								model: Project,
								where: {
									id: {
										[Op.like]: "%" + (project ? project : "") + "%",
									},
								},
								required: true,
								include: [
									{
										model: User,
										required: false,
										attributes: ["id", "name", "lastName"],
										as: "UserDeveloper",
										include: [
											{
												model: File,
												required: false,
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				model: Complexity,
				required: false,
			},
			{
				model: ErrorStatus,
				required: false,
			},
		],
		returning: true,
	});

	return res.json(error);
};

exp.findAllByDeveloper = async (req, res) => {
	const { id } = req.params;
	const { dates, complexity, project, status, userDeveloper } = req.query;

	const error = await Error.findAll({
		where: {
			status: 1,
			idComplexity: {
				[Op.like]: "%" + (complexity ? complexity : "") + "%",
			},
			idErrorStatus: {
				[Op.like]: "%" + (status ? status : "") + "%",
			},
			createdAt: {
				[Op.between]: [
					dates ? dates[0].split('"').join("") : moment("1990-01-01"),
					dates ? dates[1].split('"').join("") : moment(Date.now()),
				],
			},
		},
		include: [
			{
				model: CaseHistory,
				required: true,
				include: [
					{
						model: Case,
						required: true,
						include: [
							{
								model: Project,
								where: {
									id: {
										[Op.like]: "%" + (project ? project : "") + "%",
									},
								},
								required: true,
								include: [
									{
										model: User,
										required: true,
										attributes: ["id", "name", "lastName"],
										where: { id: id },
										as: "UserDeveloper",
										include: [
											{
												model: File,
												required: false,
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				model: Complexity,
				required: false,
			},
			{
				model: ErrorStatus,
				required: false,
			},
		],
		returning: true,
	});

	return res.json(error);
};

exp.findOne = async (req, res) => {
	const { id } = req.params;
	const erros_d = await Error.findOne({
		where: {
			status: 1,
			id: id,
		},
		include: [
			// {
			// 	model: Project,
			// 	required: false,
			// 	include: [
			// 		{
			// 			model: db.User,
			// 			required: false,
			// 			attributes: ["id", "name", "lastName"],
			// 			as: "UserDeveloper",
			// 			include: [
			// 				{
			// 					model: File,
			// 					required: false,
			// 				},
			// 			],
			// 		},
			// 	],
			// },
			{
				model: Complexity,
				required: false,
			},
			{
				model: ErrorStatus,
				required: false,
			},
			{
				model: CaseHistory,
				required: false,
				include: [
					{
						model: Case,
						required: false,
						include: [
							{
								model: Project,
								required: false,
								include: [
									{
										model: User,
										required: false,
										attributes: ["id", "name", "lastName"],
										as: "UserDeveloper",
										include: [
											{
												model: File,
												required: false,
											},
										],
									},
								],
							},
						],
					},
					{
						model: CaseHistoryStep,
						required: false,
						include: [
							{
								model: CaseStep,
								required: false,
							},
							{
								model: CaseHistoryStepStatus,
								required: false,
							},
						],
					},
				],
			},
			{
				model: ErrorMessage,
				required: false,
				where: {
					status: 1,
				},
				include: [
					{
						model: User,
						required: false,
						attributes: ["id", "name", "lastName"],
						include: [
							{
								model: File,
								required: false,
							},
						],
					},
				],
			},
		],
		returning: true,
	});

	return res.json(erros_d);
};

exp.update = async (req, res) => {
	const { id } = req.params;
	if (!id)
		return res.status(500).json({
			status: 500,
			message: "No puedes enviar datos vacios",
		});
	const { body } = req;
	return await Error.update(body, {
		where: {
			id: id,
		},
	}).then((erro_e) => {
		return res.json({
			status: 200,
			data: erro_e,
			message: "El error se ha actualizado correctamente",
		});
	});
};

exp.resolver = async (req, res) => {
	const { id } = req.params;
	if (!id)
		return res.status(500).json({
			status: 200,
			error: true,
			message: "No puedes enviar datos vacios",
		});
	const { body } = req;
	return await Error.update(body, {
		where: {
			id: id,
		},
	}).then((erro_e) => {
		return res.json({
			status: 200,
			error: false,
			data: erro_e,
			message: "Se ha dado de baja el error",
		});
	});
};

exp.delete = async (req, res) => {
	const { id } = req.params;
	if (!id)
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper: "No se esta enviando el parametro id del usuario",
		});

	return await Error.update(
		{
			status: 0,
		},
		{
			where: {
				id: id,
			},
		}
	)
		.then((numberOfAffectedRows, affectedRows) => {
			if (numberOfAffectedRows > 0) {
				return res.json({
					status: 200,
					error: false,
					message: "Step eliminado",
				});
			} else {
				return res.json({
					status: 200,
					error: true,
					message: "No se pudo lograr eliminar la step",
				});
			}
		})
		.catch((err) => {
			return res.status(500).send({
				status: 500,
				message: "No se pudo lograr eliminar la step",
				messageDeveloper: err,
			});
		});
};

module.exports = exp;
