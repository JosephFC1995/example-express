const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { Op } = db.Sequelize;
const { User, UserRole, File } = db;

const exp = {};

exp.create = async (req, res) => {};

exp.findAll = async (req, res) => {
	const roles = await UserRole.findAll({
		where: {
			status: 1,
		},
		include: [
			{
				model: User,
				required: false,
			},
		],
		returning: true,
	});

	return res.json(roles);
};

exp.findOne = async (req, res) => {};

exp.update = (req, res) => {};

exp.delete = (req, res) => {};

module.exports = exp;
