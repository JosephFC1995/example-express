const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const { Users, UserRole, File, CaseSpecialCondition } = db;

const exp = {};

exp.create = async (req, res) => {
  const body = req.body;

  if (!body)
    return res.status(500).json({
      status: 500,
      message: "No puedes enviar datos vacios",
    });

  return await CaseSpecialCondition.create(body)
    .then((special) => {
      return res.json({
        status: 200,
        data: special,
        message: "Post condición registrado correctamente",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        status: 500,
        message: err,
      });
    });
};

exp.findAll = async (req, res) => {};

exp.findOne = async (req, res) => {};

exp.update = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(500).json({
      status: 500,
      message: "No puedes enviar datos vacios",
    });
  const { body } = req;
  return await CaseSpecialCondition.update(body, {
    where: {
      id: id,
    },
  }).then((specialCase) => {
    return res.json({
      status: 200,
      data: specialCase,
      message: "Post condición se ha actualizado correctamente",
    });
  });
};

exp.delete = async (req, res) => {
  const { id } = req.params;
  if (!id)
    res.status(500).send({
      status: 500,
      message: "No se ha podido completar la solicitud",
      messageDeveloper: "No se esta enviando el parametro id del usuario",
    });

  return await CaseSpecialCondition.update(
    {
      status: 0,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((numberOfAffectedRows, affectedRows) => {
      if (numberOfAffectedRows > 0) {
        return res.json({
          status: 200,
          error: false,
          message: "Condición especial eliminado",
        });
      } else {
        return res.json({
          status: 200,
          error: true,
          message: "No se pudo lograr eliminar la condición especial",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        status: 500,
        message: "No se pudo lograr eliminar la condición especial",
        messageDeveloper: err,
      });
    });
};

module.exports = exp;
