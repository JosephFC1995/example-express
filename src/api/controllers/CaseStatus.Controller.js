const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { Op } = db.Sequelize;
const { Users, UserRole, File, CaseStatus } = db;

const exp = {};

exp.create = async (req, res) => {};

exp.findAll = async (req, res) => {
	const casestatus = await CaseStatus.findAll({
		returning: true,
	});

	return res.json(casestatus);
};

exp.findOne = async (req, res) => {};

exp.update = (req, res) => {};

exp.delete = (req, res) => {};

module.exports = exp;
