const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const { Users, UserRole, File, Complexity, CaseDesign } = db;

const exp = {};

exp.create = async (req, res) => {};

exp.findAll = async (req, res) => {
	const caseDesign = await CaseDesign.findAll({
		returning: true,
	});

	return res.json(caseDesign);
};

exp.findOne = async (req, res) => {};

exp.update = (req, res) => {};

exp.delete = (req, res) => {};

module.exports = exp;
