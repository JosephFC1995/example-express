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
	CaseHistoryStepStatus,
} = db;

const exp = {};

exp.update = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	let updateStepHistoryStep = await CaseHistoryStep.update(body, {
		where: {
			id: id,
		},
		raw: true,
	});

	if (updateStepHistoryStep) {
		let rowUpdate = await CaseHistoryStep.findOne({
			where: { id: id },
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
		});
		return res.json({
			status: 200,
			error: false,
			data: rowUpdate,
			message: "Dato actualizado",
		});
	} else {
		return res.status(500).send({
			error: true,
			status: 500,
			message: "No se pudo lograr eliminar usuario",
		});
	}
};

module.exports = exp;
