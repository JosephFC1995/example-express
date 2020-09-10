const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const { Users, UserRole, File, CasePostCondition } = db;

const exp = {};

exp.create = async (req, res) => {
  const body = req.body;

  if (!body)
    return res.status(500).json({
      status: 500,
      message: "No puedes enviar datos vacios",
    });

  return await CasePostCondition.create(body)
    .then((post) => {
      return res.json({
        status: 200,
        data: post,
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
  return await CasePostCondition.update(body, {
    where: {
      id: id,
    },
  }).then((postCase) => {
    return res.json({
      status: 200,
      data: postCase,
      message: "Pre condición se ha actualizado correctamente",
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

  return await CasePostCondition.update(
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
          message: "Pre condición eliminado",
        });
      } else {
        return res.json({
          status: 200,
          error: true,
          message: "No se pudo lograr eliminar la precondición",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        status: 500,
        message: "No se pudo lograr eliminar la precondición",
        messageDeveloper: err,
      });
    });
};

module.exports = exp;
