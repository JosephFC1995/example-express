const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { Op } = db.Sequelize;
const { Users, UserRole, File, ProjectStatus } = db;

const exp = {};

exp.create = async (req, res) => {};

exp.findAll = async (req, res) => {
	const projectstatus = await ProjectStatus.findAll({
		returning: true,
	});

	return res.json(projectstatus);
};

exp.findOne = async (req, res) => {};

exp.update = (req, res) => {};

exp.delete = (req, res) => {};

module.exports = exp;
