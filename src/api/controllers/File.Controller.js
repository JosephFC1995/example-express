const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser, randomString, uploadFileAWS } = require("./index");
const { Op } = db.Sequelize;
const { Users, UserRole, File } = db;

const exp = {};

exp.create = async (req, res) => {};

exp.findAll = async (req, res) => {};

exp.findOne = async (req, res) => {};

exp.update = (req, res) => {};

exp.delete = (req, res) => {};

/**
 * * Subida de archivos
 *
 * @param {body} req
 * @param {*} res
 */
exp.upload = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send("No file in base 64 were uploaded.");
  }
  const { user, body } = req;
  const { name, size, type, data } = body;
  let mimetype_split = type.split("/");
  let extension = mimetype_split[1];
  let new_name = randomString(50);
  let update_file_aws = await uploadFileAWS(
    data,
    new_name + "." + extension,
    type
  );

  let newDataFile = {
    name: new_name + "." + extension,
    originalname: name,
    size: size,
    encoding: "7bit",
    truncated: 0,
    extension: extension,
    mimetype: type,
    path: update_file_aws.Location,
    idUser: user.id
  };

  File.create(newDataFile)
    .then(file => {
      res.json(file);
    })
    .catch(err =>
      res.status(500).send({
        status: 500,
        message: "El archivo no pudo ser subido al servido",
        messageDeveloper: err
      })
    );
};

module.exports = exp;
