const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { Op } = db.Sequelize;
const {
	User,
	UserRole,
	File,
	Project,
	Error,
	ErrorStatus,
	Complexity,
	CaseStatus,
	ProjectStatus,
	Version,
} = db;
const { getCountCases, getCountErros } = require("./index");
const moment = require("moment");

const exp = {};

/**
 * * Crear projecto
 *
 * @param {*} req
 * @param {*} res
 * @returns project
 */
exp.create = async (req, res) => {
	const body = req.body;

	if (!body)
		return res.status(500).json({
			status: 500,
			message: "No puedes enviar datos vacios",
		});

	return await Project.create(body)
		.then((project) => {
			return res.json(project);
		})
		.catch((err) => {
			return res.status(500).json({
				status: 500,
				message: err,
			});
		});
};

/**
 * * Todos los projectos
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.findAll = async (req, res) => {
	const { dates, status, userDeveloper } = req.query;
	const project = await Project.findAll({
		where: {
			status: 1,
			idProjectStatus: {
				[Op.like]: "%" + (status ? status : "") + "%",
			},
			idUserDev: {
				[Op.like]: "%" + (userDeveloper ? userDeveloper : "") + "%",
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
				model: db.User,
				required: false,
				attributes: ["id", "name", "lastName"],
				as: "UserDeveloper",
				include: [
					{
						model: File,
						require: false,
					},
				],
			},
		],
		returning: true,
	});

	for (let index = 0; index < project.length; index++) {
		const element = project[index].dataValues;
		let counteCases = await getCountCases(element.id);
		project[index].dataValues.count_cases = counteCases;
		project[index].dataValues.count_errors = 0;
	}
	return res.json(project);
};

/**
 * * Todos los projectos para los Select
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.findAllForSelects = async (req, res) => {
	const { dates, status, userDeveloper } = req.query;
	const project = await Project.findAll({
		where: {
			status: 1,
			idProjectStatus: {
				[Op.like]: "%" + (status ? status : "") + "%",
			},
			idUserDev: {
				[Op.like]: "%" + (userDeveloper ? userDeveloper : "") + "%",
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
				model: db.User,
				required: false,
				attributes: ["id", "name", "lastName"],
				as: "UserDeveloper",
				include: [
					{
						model: File,
						require: false,
					},
				],
			},
		],
		returning: true,
	});

	return res.json(project);
};

/**
 * *Projecto en base a su id
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.findOne = async (req, res) => {
	const { id } = req.params;
	const project = await Project.findOne({
		where: {
			status: 1,
			id: id,
		},
		include: [
			{
				model: User,
				required: false,
				attributes: ["id", "name", "lastName"],
				as: "UserDeveloper",
				include: [
					{
						model: File,
					},
				],
			},
			{
				model: ProjectStatus,
				required: false,
			},
			{
				model: db.Case,
				required: false,
				where: {
					status: 1,
				},
				include: [
					{
						model: Complexity,
						required: false,
					},
					{
						model: CaseStatus,
						required: false,
					},
				],
			},
			{
				model: Version,
				require: false,
				include: [
					{
						model: User,
						required: false,
						include: [
							{
								model: File,
							},
						],
					},
				],
			},
		],
		returning: true,
	});

	return res.json(project);
};

/**
 * * Actualizar un proyecto en base a su id
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.update = async (req, res) => {
	const { id } = req.params;
	if (!id)
		return res.status(500).json({
			status: 500,
			message: "No puedes enviar datos vacios",
		});
	const { body } = req;
	let updateProject = await Project.update(body, {
		where: {
			id: id,
		},
		returning: true,
	});

	return res.json(updateProject);
};

/**
 * * Eliminar un proyecto ne base a su id
 *
 * @param {*} id
 * @returns
 */
exp.delete = async (req, res) => {
	const { id } = req.params;
	if (!id)
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper: "No se esta enviando el parametro id del usuario",
		});

	let returnDelete = await Project.update(
		{
			status: 0,
		},
		{
			where: {
				id: id,
			},
			returning: true,
		}
	);

	return res.json({
		status: 200,
		message: "El proyecto se ha eliminado correctamente",
		messageDeveloper: null,
		data: returnDelete,
	});
};

exp.closeProyect = async (req, res) => {
	const { id } = req.params;
	if (!id)
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper: "No se esta enviando el parametro id del usuario",
		});

	let closingProyect = await Project.update(
		{
			idProjectStatus: 2,
			dateFinish: moment().format("YYYY-MM-DD"),
		},
		{
			where: {
				id: id,
			},
			returning: true,
		}
	);

	return res.json({
		status: 200,
		message: "El proyecto se ha cerrado correctamente",
		messageDeveloper: null,
		data: closingProyect,
	});
};

exp.activeProyect = async (req, res) => {
	const { id } = req.params;
	if (!id)
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper: "No se esta enviando el parametro id del usuario",
		});

	let activeProyect = await Project.update(
		{
			idProjectStatus: 1,
			dateFinish: null,
		},
		{
			where: {
				id: id,
			},
			returning: true,
		}
	);

	return res.json({
		status: 200,
		message: "El proyecto se ha activo correctamente",
		messageDeveloper: null,
		data: activeProyect,
	});
};

module.exports = exp;
