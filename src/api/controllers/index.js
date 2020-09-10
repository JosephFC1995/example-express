"user strict";
const db = require("../config");
const exec_funtions = {};
const {
	User,
	UserRole,
	Project,
	Case,
	Error,
	CaseHistory,
	CaseHistoryStep,
	CaseHistoryStatus,
	CaseStatus,
	CasePostCondition,
	CasePreCondition,
	CaseSpecialCondition,
	Complexity,
	File,
	CaseHistoryStepStatus,
	CaseStep,
	Version,
	Report,
} = db;
require("dotenv").config();
const AWS = require("aws-sdk");
const moment = require("moment");
const fs = require("fs");
var nodemailer = require("nodemailer");

/**
 * Obtener un usuario en base a su correo
 *
 * @param {*} email
 * @returns
 */
exec_funtions.getUser = (email) => {
	const result = User.findOne({
		where: {
			email: email,
		},
		include: [
			{
				model: UserRole,
				required: true,
			},
			{
				model: File,
				required: false,
			},
		],
		returning: true,
	});

	return result;
};

/**
 * Verificar si existe un usuario en base a su correo
 *
 * @param {*} email
 * @returns
 */
exec_funtions.hasUser = (email) => {
	const result = User.count({
		where: {
			email: email,
		},
		returning: true,
	});
	return result;
};

/**
 * Obtener el total de Casos de test en base el id
 *
 * @param {*} id
 * @returns
 */
exec_funtions.getCountCases = (id) => {
	const result = Case.count({
		where: {
			idProject: id,
		},
		returning: true,
	});

	return result;
};

/**
 * Obtener el total de Versiones al id del proyecto
 *
 * @param {*} id
 * @returns
 */
exec_funtions.getCountVersions = (id) => {
	const result = Version.count({
		where: {
			idProject: id,
		},
		returning: true,
	});

	return result;
};

/**
 * Obtener el total de Errores en base el id
 *
 * @param {*} id
 * @returns
 */
exec_funtions.getCountErros = (id) => {
	const result = db.Error.count({
		where: {
			idProject: id,
		},
		returning: true,
	});

	return result;
};

exec_funtions.getCountAllHistory = () => {
	let result = CaseHistory.count({
		returning: true,
	});

	return result;
};

exec_funtions.getCountHistoryByTester = (id) => {
	let result = CaseHistory.count({
		returning: true,
		where: {
			idUser: id,
		},
	});

	return result;
};

exec_funtions.getCountAllProjects = () => {
	let result = Project.count({
		returning: true,
	});

	return result;
};

exec_funtions.getCountAllCases = () => {
	let result = Case.count({
		returning: true,
	});

	return result;
};

exec_funtions.getCountCasePending = (id) => {
	let result = Case.count({
		returning: true,
		where: {
			idUserTester: id,
			idCaseStatus: 1,
		},
	});

	return result;
};

exec_funtions.getCountAllCasesByAsignTest = (id) => {
	let result = Case.count({
		returning: true,
		where: {
			idUserTester: id,
		},
	});

	return result;
};

exec_funtions.getCountStepMake = (id) => {
	let result = CaseHistoryStep.count({
		returning: true,
		where: {
			idUser: id,
		},
	});

	return result;
};

exec_funtions.getCountAllUsers = () => {
	let result = User.count({
		returning: true,
	});

	return result;
};

exec_funtions.getCountAllErrors = () => {
	let result = Error.count({
		returning: true,
	});

	return result;
};

exec_funtions.getCountAllReports = () => {
	let result = Report.count({
		returning: true,
	});

	return result;
};

exec_funtions.getUserById = (id) => {
	const result = User.findOne({
		where: {
			id: id,
		},
		include: [
			{
				model: File,
				required: false,
			},
		],
		returning: true,
	});

	return result;
};

/**
 * * Generador de string en base al tamaño
 *
 * @param {*} length Integer
 * @returns
 */
exec_funtions.randomString = (length) => {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = length;
	var randomstring = "";
	for (var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
};

exec_funtions.findInArray = (array, value) => {
	return array.includes(value);
};

exec_funtions.sendEmailCustomMessage = (email, subject, message) => {
	var transporter = nodemailer.createTransport({
		host: "mail.josephfc.dev",
		port: 465,
		secure: true,
		auth: {
			user: "appnoreply@josephfc.dev",
			pass: "JshSwC}yjoA=",
		},
	});

	var mailOptions = {
		from: "appnoreply@josephfc.dev",
		to: email,
		subject: subject,
		text: message,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};

/**
 *
 * Obtencion de indicadores por casos
 * @param {Array} cases array de los casos
 * @param {Array} days array de las fechas
 * @returns
 */
exec_funtions.getIndicatorPrimarys = (cases, days) => {
	days.forEach((element, index) => {
		let d = moment(element.date, "DD-MM-YYYY");
		let casesForDay = cases.filter((value) => {
			let dayMomentFormat = moment(value.createdAt).format("DD-MM-YYYY");
			let dayMomentisSame = moment(dayMomentFormat, "DD-MM-YYYY");
			return dayMomentisSame.isSame(d, "day");
		});

		let casesRealice = cases.filter((value) => {
			if (value.idCaseHistoryStatus != 1) {
				let dayMomentFormat = moment(value.createdAt).format("DD-MM-YYYY");
				let dayMomentisSame = moment(dayMomentFormat, "DD-MM-YYYY");
				return dayMomentisSame.isSame(d, "day");
			}
		});

		let countEror = casesForDay.filter((current) => {
			if (
				current.idCaseHistoryStatus != 1 &&
				current.idCaseHistoryStatus != 4
			) {
				let c = current.CaseHistorySteps.filter(
					(value) => value.idCaseHistoryStepStatus == 3
				);
				return c;
			}
		});

		let countFinish = casesForDay.filter((current) => {
			if (current.idCaseHistoryStatus == 3) {
				return current;
			}
		});

		days[index].casesDay = casesForDay.length;
		days[index].casesRealice = casesRealice.length;
		days[index].casesErrors = countEror.length;
		days[index].indicatorDataCasePrincipal =
			casesForDay.length || casesForDay.length
				? casesForDay.length / casesForDay.length
				: 0;
		days[index].indicatorDataCaseCobertura =
			casesRealice.length || casesForDay.length
				? casesRealice.length / casesForDay.length
				: 0;
		days[index].indicatorDataCaseMadurez =
			countFinish.length || casesForDay.length
				? countFinish.length / casesForDay.length
				: 0;
	});

	return days;
};

exec_funtions.getCaseById = async (id) => {
	const cas = await Case.findOne({
		where: {
			status: 1,
			id: id,
		},
		include: [
			{
				model: User,
				required: false,
				attributes: ["id", "name", "lastName"],
				include: [
					{
						model: File,
						required: false,
					},
				],
			},
			{
				model: CaseHistory,
				required: false,
				where: {
					status: 1,
					idCaseHistoryStatus: 3,
				},
				include: [
					{
						model: CaseHistoryStatus,
						required: false,
					},
					{
						model: CaseHistoryStep,
						required: false,
						order: [[CaseStep, "position", "ASC"]],
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
					},
				],
			},
			{
				model: CaseStatus,
				required: false,
			},
			{
				model: CasePostCondition,
				required: false,
				where: {
					status: 1,
				},
			},
			{
				model: CasePreCondition,
				required: false,
				where: {
					status: 1,
				},
			},
			{
				model: CaseSpecialCondition,
				required: false,
				where: {
					status: 1,
				},
			},
			{
				model: Complexity,
				required: false,
			},
		],
		returning: true,
		plain: true,
	});
	return cas;
};

exec_funtions.uploadServer = async (name, ext, pathAWS, user) => {
	let newDataFile = {
		name: name + ext,
		originalname: name,
		size: null,
		encoding: "7bit",
		truncated: 0,
		extension: "pdf",
		mimetype: "application/pdf",
		path: pathAWS,
		idUser: user.id,
	};

	let file = await File.create(newDataFile, {
		returning: true,
	});

	return file;
};

exec_funtions.createReport = async (name, idFile, user) => {
	let newDataFile = {
		name: name,
		idFile: idFile,
		idUser: user.id,
	};

	let report = await Report.create(newDataFile, {
		returning: true,
	});

	return report;
};

/**
 * * Subir archivos a Amason
 *
 * @param {*} base64
 * @param {*} fileName
 * @param {*} type
 * @returns
 */
exec_funtions.uploadFileAWS = (base64, fileName, type) => {
	// AWS
	const ID = process.env.AWS_ID;
	const SECRET = process.env.AWS_SECRET;
	const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

	const s3 = new AWS.S3({
		accessKeyId: ID,
		secretAccessKey: SECRET,
	});

	const base64Data = new Buffer.from(
		base64.replace(/^data:image\/\w+;base64,/, ""),
		"base64"
	);

	const params = {
		Bucket: BUCKET_NAME,
		Key: "images/" + fileName,
		Body: base64Data,
		ContentEncoding: "base64",
		ContentType: type,
		ACL: "public-read",
	};

	var reques_aws = s3.upload(params);
	var result = reques_aws.promise();
	return result.then(
		(data) => {
			return data;
		},
		(error) => {
			console.log(error);
		}
	);
};

exec_funtions.uploadPDFAWS = (pdfPath, pdfName) => {
	// AWS
	const ID = process.env.AWS_ID;
	const SECRET = process.env.AWS_SECRET;
	const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

	const s3 = new AWS.S3({
		accessKeyId: ID,
		secretAccessKey: SECRET,
	});
	const fileContent = fs.readFileSync(pdfPath);
	const params = {
		Bucket: BUCKET_NAME,
		Key: "pdf/" + pdfName,
		Body: fileContent,
		contentType: "application/pdf",
		ACL: "public-read",
	};

	var reques_aws = s3.upload(params);
	var result = reques_aws.promise();
	return result.then(
		(data) => {
			return data;
		},
		(error) => {
			console.log(error);
		}
	);
};

module.exports = exec_funtions;
