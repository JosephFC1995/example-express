const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const {
	User,
	UserRole,
	File,
	Case,
	CaseHistory,
	CaseHistoryStep,
	CaseHistoryStepStatus,
	CaseStep,
	Project,
	CaseStatus,
	CasePostCondition,
	CasePreCondition,
	CaseSpecialCondition,
	CaseHistoryStatus,
	CaseHistoryMessage,
	Complexity,
	Error,
} = db;

const exp = {};

exp.create = async (req, res) => {};

exp.findAll = async (req, res) => {};

exp.findOne = async (req, res) => {};

exp.findOneDetail = async (req, res) => {
	let { slug } = req.params;

	let caseHistoryFind = await CaseHistory.findOne({
		returning: true,
		where: {
			slug: slug,
			status: 1,
		},
		include: [
			{
				model: CaseHistoryStatus,
				required: false,
			},
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
					{
						model: CaseStatus,
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
						model: Complexity,
						required: false,
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
			{
				model: CaseHistoryMessage,
				required: false,
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
							{
								model: UserRole,
								required: false,
							},
						],
					},
				],
			},
		],
	});

	return res.json({
		data: caseHistoryFind,
		status: 200,
		message: "Consulta realizada",
	});
};

exp.findOneBySlug = async (req, res) => {
	let { slug } = req.params;

	let caseHistoryFind = await CaseHistory.findOne({
		returning: true,
		where: {
			slug: slug,
			status: 1,
		},
		include: [
			{
				model: CaseHistoryStatus,
				required: false,
			},
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
					{
						model: CaseStatus,
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
						model: Complexity,
						required: false,
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
			{
				model: CaseHistoryMessage,
				required: false,
				include: [
					{
						model: User,
						required: false,
					},
				],
			},
		],
	});

	if (caseHistoryFind.Case.idCaseStatus == 4) {
		return res.json({
			data: null,
			status: 200,
			message: "El caso de prueba ya ha sido testeado",
			codeResponse: 1,
		});
	}

	if (caseHistoryFind.idCaseHistoryStatus == 2) {
		return res.json({
			data: null,
			status: 200,
			message: "Este testeo ya ha sido terminada",
			codeResponse: 2,
		});
	} else if (caseHistoryFind.idCaseHistoryStatus == 3) {
		return res.json({
			data: null,
			status: 200,
			message: "Este testeo ya ha sido cancelado previamente",
			codeResponse: 3,
		});
	}

	return res.json({
		data: caseHistoryFind,
		status: 200,
		message: "Consulta realizada",
	});
};

exp.update = (req, res) => {};

exp.delete = (req, res) => {};

exp.cancelCase = async (req, res) => {
	let { slug } = req.params;
	let { time } = req.body;

	let updateDataCaseHistory = await CaseHistory.update(
		{
			idCaseHistoryStatus: 4,
			timeFinish: time,
		},
		{
			where: { slug: slug },
			returning: true,
		}
	);

	return res.json(updateDataCaseHistory);
};

exp.finishCase = async (req, res) => {
	let { slug } = req.params;
	let {
		idCase,
		idCaseHistory,
		idCaseHistoryStatus,
		message,
		time,
		totalErrors,
	} = req.body;
	let { id } = req.user;

	if (message != "") {
		await CaseHistoryMessage.create({
			message: message,
			idUser: id,
			idCaseHistory: idCaseHistory,
		});
	}

	let updateDataCaseHistory = await CaseHistory.update(
		{
			idCaseHistoryStatus: idCaseHistoryStatus,
			timeFinish: time,
		},
		{
			where: { slug: slug },
			returning: true,
		}
	);

	if (totalErrors == 0) {
		await Case.update(
			{
				idCaseStatus: 3,
			},
			{
				where: {
					id: idCase,
				},
			}
		);
	} else {
		await Case.update(
			{
				idCaseStatus: 2,
			},
			{
				where: {
					id: idCase,
				},
			}
		);

		await Error.create({
			detail: message,
			idComplexity: 2,
			idErrorStatus: 1,
			idCaseHistory: idCaseHistory,
			idUser: req.user.id,
		});
	}

	return res.json(updateDataCaseHistory);
};

module.exports = exp;
