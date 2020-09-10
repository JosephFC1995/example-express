const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser, randomString } = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const {
	User,
	UserRole,
	File,
	Case,
	Project,
	CaseHistory,
	CasePostCondition,
	CasePreCondition,
	CaseSpecialCondition,
	CaseStep,
	Complexity,
	CaseStatus,
	CaseHistoryStep,
	CaseHistoryStatus,
	CaseDesign,
} = db;
const moment = require("moment");

const exp = {};

/**
 * * Crear un nuevo Caso Tester
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.create = async (req, res) => {
	const body = req.body;

	if (!body)
		return res.status(500).json({
			status: 500,
			message: "No puedes enviar datos vacios",
		});

	return await Case.create(body)
		.then((cas) => {
			return res.json({
				status: 200,
				data: cas,
				message: "Caso registrado correctamente",
			});
		})
		.catch((err) => {
			return res.status(500).json({
				status: 500,
				message: err,
			});
		});
};

/**
 * Reprogramar casos de prueba
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.reprograming = async (req, res) => {
	let { date, date_prev, total_nice, total_error } = req.body;

	if (!date) date = moment().format("YYYY-MM-DD");
	let date_ant = date_prev
		? date_prev
		: moment(date).subtract(1, "days").format("YYYY-MM-DD");

	let caseHistory_ant = await CaseHistory.findAll({
		where: {
			status: 1,
			dateCreate: date_ant,
		},
		returning: true,
		raw: true,
	});

	for (let index = 0; index < caseHistory_ant.length; index++) {
		const element = caseHistory_ant[index];
		if (element.idCaseHistoryStatus == 3) {
			let body = {
				idCaseStatus: 3,
			};
			await Case.update(body, {
				where: {
					id: element.idCase,
				},
			});
		} else if (element.idCaseHistoryStatus == 1) {
			let body = {
				idCaseHistoryStatus: 4,
			};
			await CaseHistory.update(body, {
				where: {
					id: element.id,
				},
			});

			let bodyHistory = {
				slug: await randomString(35),
				idCase: element.idCase,
				idCaseHistoryStatus: 1,
				dateCreate: date,
				idUser: req.user.id,
			};
			await CaseHistory.create(bodyHistory);
		} else if (element.idCaseHistoryStatus == 2) {
			let bodyHistory = {
				slug: await randomString(35),
				idCase: element.idCase,
				idCaseHistoryStatus: 1,
				dateCreate: date,
				idUser: req.user.id,
			};
			await CaseHistory.create(bodyHistory);
			let body = {
				idCaseStatus: 1,
			};
			await Case.update(body, {
				where: {
					id: element.idCase,
				},
			});
		}
	}

	let casesPending = await Case.findAll({
		where: {
			status: 1,
			idCaseStatus: 1,
			dateCreate: date,
		},
		returning: true,
		raw: true,
	});

	for (let index = 0; index < casesPending.length; index++) {
		const element = casesPending[index];
		let body = {
			slug: await randomString(35),
			idCase: element.id,
			idCaseHistoryStatus: 1,
			dateCreate: date,
			idUser: req.user.id,
		};
		await CaseHistory.create(body);
	}

	//
	let caseHistoryAux = await CaseHistory.findAll({
		where: {
			status: 1,
			dateCreate: date,
		},
		returning: true,
		raw: true,
	});

	let contador_nice = 1;
	let contador_error = 1;

	for (let index = 0; index < caseHistoryAux.length; index++) {
		const element = caseHistoryAux[index];

		if (element.idCaseHistoryStatus == 1 && contador_nice <= total_nice) {
			let body = {
				idCaseHistoryStatus: 3,
			};
			await CaseHistory.update(body, {
				where: {
					id: element.id,
				},
			});
			contador_nice++;
		} else if (
			element.idCaseHistoryStatus == 1 &&
			contador_error <= total_error
		) {
			let body = {
				idCaseHistoryStatus: 2,
			};
			await CaseHistory.update(body, {
				where: {
					id: element.id,
				},
			});
			contador_error++;
		}
	}
	//

	return res.json({
		date: date,
		casesPending: "Nice",
	});
};

exp.reprogramingCase = async (req, res) => {
	let { id } = req.params;
	let date = moment().format("YYYY-MM-DD");
	let casesPending = await Case.findAll({
		where: {
			id: id,
		},
		returning: true,
		raw: true,
	});

	for (let index = 0; index < casesPending.length; index++) {
		const element = casesPending[index];
		let body = {
			slug: await randomString(35),
			idCase: element.id,
			idCaseHistoryStatus: 1,
			dateCreate: date,
			idUser: req.user.id,
		};
		await CaseHistory.create(body);
	}

	return res.json({
		status: 200,
		error: false,
		data: casesPending,
		message: "Programación correctamente",
	});
};

/**
 * * Retornar todos los casos
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.findAll = async (req, res) => {
	const { dates, complexity, project, status, userTester } = req.query;
	let queyProject = null;
	if (project) {
		queyProject = project;
	} else {
		queyProject = {
			[Op.like]: "%" + (project ? project : "") + "%",
		};
	}
	const cases = await Case.findAll({
		where: {
			status: 1,
			idProject: queyProject,
			idCaseStatus: {
				[Op.like]: "%" + (status ? status : "") + "%",
			},
			idUserTester: {
				[Op.or]: [
					{ [Op.like]: "%" + (userTester ? userTester : "") + "%" },
					null,
				],
			},
			idComplexity: {
				[Op.like]: "%" + (complexity ? complexity : "") + "%",
			},
			createdAt: {
				[Op.between]: [
					dates ? dates[0].split('"').join("") : moment("1990-01-01"),
					dates ? dates[1].split('"').join("") : moment(Date.now()),
				],
			},
		},
		order: [["id", "DESC"]],
		include: [
			{
				model: User,
				required: false,
				attributes: ["id", "name", "lastName"],
			},
			{
				model: CaseStatus,
				required: false,
			},
			{
				model: Project,
				require: false,
			},
			{
				model: Complexity,
				required: false,
			},
		],
		returning: true,
	});

	return res.json(cases);
};

/**
 * Busca los casos por tester
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.findAllByTester = async (req, res) => {
	const { id_tester } = req.params;
	const { dates, complexity, project, status } = req.query;

	const cases = await CaseHistory.findAll({
		where: {
			status: 1,
			idCaseHistoryStatus: 1,
			createdAt: {
				[Op.between]: [
					dates ? dates[0].split('"').join("") : moment("1990-01-01"),
					dates ? dates[1].split('"').join("") : moment(Date.now()),
				],
			},
		},
		include: [
			{
				model: CaseHistoryStatus,
			},
			{
				model: Case,
				required: true,
				where: {
					idComplexity: {
						[Op.like]: "%" + (complexity ? complexity : "") + "%",
					},
				},
				include: [
					{
						model: User,
						required: false,
						attributes: ["id", "name", "lastName"],
					},
					{
						model: CaseStatus,
						required: false,
					},
					{
						model: Project,
						required: false,
					},
					{
						model: Complexity,
						required: false,
					},
				],
			},
		],
		returning: true,
	});

	// const cases = await Case.findAll({
	// 	where: {
	// 		status: 1,
	// 		idUserTester: id_tester,
	// 		idProject: {
	// 			[Op.like]: "%" + (project ? project : "") + "%",
	// 		},
	// 		idCaseStatus: {
	// 			[Op.like]: "%" + (status ? status : "") + "%",
	// 		},
	// 		idComplexity: {
	// 			[Op.like]: "%" + (complexity ? complexity : "") + "%",
	// 		},
	// 		createdAt: {
	// 			[Op.between]: [
	// 				dates ? dates[0].split('"').join("") : moment("1990-01-01"),
	// 				dates ? dates[1].split('"').join("") : moment(Date.now()),
	// 			],
	// 		},
	// 	},
	// 	include: [
	// 		{
	// 			model: User,
	// 			required: false,
	// 			attributes: ["id", "name", "lastName"],
	// 		},
	// 		{
	// 			model: CaseStatus,
	// 			required: false,
	// 		},
	// 		{
	// 			model: Project,
	// 			required: false,
	// 		},
	// 		{
	// 			model: Complexity,
	// 			required: false,
	// 		},
	// 	],
	// 	returning: true,
	// });

	return res.json(cases);
};

/**
 * * Retornar un caso en base a su id
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.findOne = async (req, res) => {
	const { id } = req.params;
	const cas = await Case.findOne({
		where: {
			status: 1,
			id: id,
		},
		order: [[CaseStep, "position", "ASC"]],
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
			{
				model: CaseHistory,
				required: false,
				where: {
					status: 1,
				},
				include: [
					{
						model: CaseHistoryStatus,
						required: false,
					},
					{
						model: CaseHistoryStep,
						required: false,
					},
				],
			},
			{
				model: CaseStatus,
				required: false,
			},
			{
				model: CaseDesign,
				required: false,
			},
			{
				model: CasePostCondition,
				required: false,
				where: {
					status: 1,
				},
			},
			{
				model: CasePreCondition,
				required: false,
				where: {
					status: 1,
				},
			},
			{
				model: CaseSpecialCondition,
				required: false,
				where: {
					status: 1,
				},
			},
			{
				model: CaseStep,
				required: false,
				where: {
					status: 1,
				},
			},
			{
				model: Complexity,
				required: false,
			},
		],
		returning: true,
	});

	return res.json(cas);
};

/**
 * Casos por proyectos
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.caseByProject = async (req, res) => {
	const id_project = req.params.id_project;
	const cas = await Case.findAll({
		where: {
			status: 1,
			id_project: id_project,
		},
		include: [
			{
				model: User,
				required: false,
				attributes: ["id", "name", "lastName", "status"],
			},
			{
				model: Project,
				required: false,
			},
		],
		returning: true,
	});
	return res.json(cas);
};

/**
 * Iniciar el testeo para el tester
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.startCaseTester = async (req, res) => {
	const { id, idCase } = req.body;
	// let slugGenerate = await randomString(35);

	let caseHistory = await CaseHistory.findOne({
		where: {
			id: id,
		},
		include: {
			model: Case,
			require: false,
		},
		returning: true,
		raw: true,
	});

	let casesSteps = await CaseStep.findAll({
		where: {
			idCase: idCase,
			status: 1,
		},
		order: [["position", "ASC"]],
		returning: true,
		raw: true,
	});

	let caseHistoryStep = [];

	for (let index = 0; index < casesSteps.length; index++) {
		const element = casesSteps[index];
		caseHistoryStep[index] = await CaseHistoryStep.create(
			{
				idCaseHistory: caseHistory.id,
				idCaseStep: element.id,
				idUser: req.user.id,
			},
			{ returning: true, raw: true }
		);
	}

	return res.json(caseHistory);
};

/**
 * Asigna casos al tester
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.asignTesterToCase = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	const { idTester } = body;

	let caseUpdate = await Case.update(
		{
			idUserTester: idTester,
		},
		{
			where: {
				id: id,
			},
			returning: true,
			raw: true,
		}
	);

	if (caseUpdate) {
		return res.json({
			status: 200,
			error: false,
			data: caseUpdate,
			message: "Tester asignado",
		});
	} else {
		return res.status(500).send({
			error: true,
			status: 500,
			message: "No se pudo lograr actualizar el dato",
		});
	}
};

/**
 * Actualiza un caso
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
	let updateCase = await Case.update(body, {
		where: {
			id: id,
		},
		returning: true,
	});

	return res.json(updateCase);
};

/**
 * Elimina un caso
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.delete = async (req, res) => {
	const { id } = req.params;
	if (!id)
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper: "No se esta enviando el parametro id del usuario",
			data: null,
		});

	let returnDelete = await Case.update(
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
		message:
			"El proyecto se ha eliminado correctamente, te estamos redireccionando",
		messageDeveloper: null,
		data: returnDelete,
	});
};

module.exports = exp;
