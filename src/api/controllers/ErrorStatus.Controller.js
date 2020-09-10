const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { Op } = db.Sequelize;
const { Users, UserRole, File, ErrorStatus } = db;

const exp = {};

exp.create = async (req, res) => {};

exp.findAll = async (req, res) => {
	const errorstatus = await ErrorStatus.findAll({
		returning: true,
	});

	return res.json(errorstatus);
};

exp.findOne = async (req, res) => {};

exp.update = (req, res) => {};

exp.delete = (req, res) => {};

module.exports = exp;
