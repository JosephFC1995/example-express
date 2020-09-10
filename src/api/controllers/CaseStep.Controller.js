const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const { Users, UserRole, File, CaseStep } = db;

const exp = {};

exp.create = async (req, res) => {
  const body = req.body;

  if (!body)
    return res.status(500).json({
      status: 500,
      message: "No puedes enviar datos vacios",
    });

  body.idUser = req.user.id;

  return await CaseStep.create(body)
    .then((step) => {
      return res.json({
        status: 200,
        data: step,
        message: "El step registrado correctamente",
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
  return await CaseStep.update(body, {
    where: {
      id: id,
    },
  }).then((stepCase) => {
    return res.json({
      status: 200,
      data: stepCase,
      message: "El step se ha actualizado correctamente",
    });
  });
};

exp.updateMultiple = async (req, res) => {
  const { body } = req;
  if (!body)
    return res.status(500).json({
      status: 500,
      message: "No puedes enviar datos vacios",
    });
  try {
    for (let index = 0; index < body.length; index++) {
      const element = body[index];
      await CaseStep.update(element, {
        where: {
          id: element.id,
        },
      });
    }
    return res.json({
      status: 200,
      error: false,
      message: "Steps actualizados",
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "No se ha podido completar la solicitud",
      messageDeveloper: "No se esta enviando el parametro id del usuario",
      error: error,
    });
  }

  console.log(body);
  return res.status(200);
};

exp.delete = async (req, res) => {
  const { id } = req.params;
  if (!id)
    res.status(500).send({
      status: 500,
      message: "No se ha podido completar la solicitud",
      messageDeveloper: "No se esta enviando el parametro id del usuario",
    });

  return await CaseStep.update(
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
          message: "Step eliminado",
        });
      } else {
        return res.json({
          status: 200,
          error: true,
          message: "No se pudo lograr eliminar la step",
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        status: 500,
        message: "No se pudo lograr eliminar la step",
        messageDeveloper: err,
      });
    });
};

module.exports = exp;
