const db = require("../config/index");
require("dotenv").config();
const {
	hasUser,
	getUser,
	getCountCases,
	getCountVersions,
} = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const {
	User,
	UserRole,
	File,
	Version,
	Project,
	Case,
	CaseHistory,
	Error,
	ProjectStatus,
} = db;

const exp = {};

exp.create = async (req, res) => {
	const body = req.body;

	if (!body)
		return res.status(500).json({
			status: 500,
			message: "No puedes enviar datos vacios",
		});

	let responseVersionCreate = await Version.create(body, {
		returning: true,
	});

	return res.json({
		status: 200,
		message: "La versión se ha creado correctamente",
		messageDeveloper: null,
		data: responseVersionCreate,
	});
};

exp.findOneByProyect = async (req, res) => {
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

exp.findAllByProject = async (req, res) => {
	let { user } = req;
	const projectByDev = await Project.findAll({
		where: {
			status: 1,
			idUserDev: user.id,
		},
		include: [
			// {
			// 	model: Case,
			// 	required: false,
			// 	where: {
			// 		status: 1,
			// 	},
			// 	include: [
			// 		{
			// 			model: CaseHistory,
			// 			required: false,
			// 			where: {
			// 				status: 1,
			// 			},
			// 		},
			// 	],
			// },
			{
				model: Version,
				required: false,
				where: {
					status: 1,
				},
			},
		],
		returning: true,
	});

	for (let index = 0; index < projectByDev.length; index++) {
		const element = projectByDev[index].dataValues;
		let counteCases = await getCountCases(element.id);
		let counteVersion = await getCountVersions(element.id);
		projectByDev[index].dataValues.count_cases = counteCases;
		projectByDev[index].dataValues.count_versions = counteVersion;
		projectByDev[index].dataValues.count_errors = 0;
	}

	return res.json(projectByDev);
};

/**
 * *Projecto en base a su id
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.projectfindOne = async (req, res) => {
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
				model: Version,
				require: false,
			},
		],
		returning: true,
	});

	return res.json(project);
};

exp.update = (req, res) => {};

exp.delete = (req, res) => {};

module.exports = exp;
