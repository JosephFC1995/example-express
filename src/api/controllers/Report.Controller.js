const db = require("../config/index");
require("dotenv").config();
const {
	hasUser,
	getUser,
	getCaseById,
	uploadPDFAWS,
	uploadServer,
	createReport,
} = require("./index");
const { compareSync, hashSync } = require("bcrypt");
const { Op } = db.Sequelize;
const {
	User,
	UserRole,
	File,
	Version,
	Project,
	Case,
	CaseHistory,
	Report,
} = db;
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const exp = {};

/**
 * Reportar todos los reportes
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exp.findAll = async (req, res) => {
	const reports = await Report.findAll({
		where: {
			status: 1,
		},
		order: [["createdAt", "DESC"]],
		include: [
			{
				model: User,
				required: false,
				include: [
					{
						model: File,
						required: false,
					},
				],
			},
			{
				model: File,
				required: false,
			},
		],
		returning: true,
	});

	return res.json(reports);
};

/**
 * Generar reporte por proyecto
 *
 * @param {*} req
 * @param {*} res
 */
exp.generateCasesByProject = async (req, res) => {
	const { id, cases } = req.body;
	const project = await Project.findOne({
		where: {
			status: 1,
			id: id,
		},
	});

	let casesData = [];

	for (let index = 0; index < cases.length; index++) {
		const element = cases[index];
		let dataBasic = await getCaseById(element);
		casesData[index] = {
			identification: dataBasic.identification,
			complexity: dataBasic.Complexity.name,
			date_create: moment(dataBasic.dateCreate).format(
				"DD [de] MMM [del] YYYY"
			),
			date_exec: dataBasic.CaseHistories
				? moment(dataBasic.CaseHistories[0].dateCreate).format(
						"DD [de] MMM [del] YYYY"
				  )
				: "",
			name: dataBasic.name,
			description: dataBasic.description,
			casePreCondition: dataBasic.CasePreConditions.map((value, index) => {
				return {
					index: index + 1,
					description: value.description,
				};
			}),
			casePostCondition: dataBasic.CasePostConditions.map((value, index) => {
				return {
					index: index + 1,
					description: value.description,
				};
			}),
			caseSpecialCondition: dataBasic.CaseSpecialConditions.map(
				(value, index) => {
					return {
						index: index + 1,
						description: value.description,
					};
				}
			),
			caseStep: dataBasic.CaseHistories[0].CaseHistorySteps.map((value) => {
				return {
					index: value.CaseStep.position,
					name: value.CaseStep.description,
					estado: value.CaseHistoryStepStatus.name,
					expectedResult: value.CaseStep.expectedResult
						? value.CaseStep.expectedResult
						: "-",
					time: value.timeStep,
				};
			}),
		};
	}
	try {
		(async () => {
			var templateData = {
				project: {
					name: project.name,
					prefix: project.prefix,
					comentary: project.comentary,
					url: project.url,
					dateStart: project.dateStart
						? moment(project.dateStart).format("DD [de] MMM [del] YYYY")
						: "-",
					dateFinish: project.dateFinish
						? moment(project.dateFinish).format("DD [de] MMM [del] YYYY")
						: "-",
					status: project.idProjectStatus == 1 ? "Activo" : "Cerrado",
				},
				cases: casesData,
			};

			var templateHtml = fs.readFileSync(
				path.join(process.cwd(), "template", "project_case_test.html"),
				"utf8"
			);

			var template = handlebars.compile(templateHtml);
			var finalHtml = template(templateData);
			let name = "reports" + Date.now();
			let namePDF = name + ".pdf";
			let pathFile = path.join(process.cwd(), "public", "uploads", namePDF);
			var options = {
				format: "A4",
				headerTemplate: "<p></p>",
				footerTemplate: "<p></p>",
				displayHeaderFooter: false,
				margin: {
					top: "40px",
					bottom: "100px",
				},
				printBackground: true,
				path: pathFile,
			};
			const browser = await puppeteer.launch({
				args: ["--no-sandbox"],
				headless: true,
			});
			const page = await browser.newPage();
			await page.setContent(finalHtml, {
				waitUntil: ["domcontentloaded", "load", "networkidle0"],
			});
			await page.pdf(options);
			await browser.close();

			let update_pdf_aws = await uploadPDFAWS(pathFile, namePDF);
			let fileCreate = await uploadServer(
				name,
				"pdf",
				update_pdf_aws.Location,
				req.user
			);

			let reportCreate = await createReport(namePDF, fileCreate.id, req.user);

			return res.json({
				path: update_pdf_aws.Location,
			});
		})();
	} catch (error) {
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper: error,
		});
	}
};

/**
 * Generar reporte por caso en base a su id
 *
 * @param {*} req
 * @param {*} res
 */
exp.generateCasesByCaseID = async (req, res) => {
	const { id } = req.body;

	let dataBasic = await getCaseById(id);
	let caseData = {
		identification: dataBasic.identification,
		complexity: dataBasic.Complexity.name,
		date_create: moment(dataBasic.dateCreate).format("DD [de] MMM [del] YYYY"),
		date_exec: dataBasic.CaseHistories
			? moment(dataBasic.CaseHistories[0].dateCreate).format(
					"DD [de] MMM [del] YYYY"
			  )
			: "",
		name: dataBasic.name,
		description: dataBasic.description,
		casePreCondition: dataBasic.CasePreConditions.map((value, index) => {
			return {
				index: index + 1,
				description: value.description,
			};
		}),
		casePostCondition: dataBasic.CasePostConditions.map((value, index) => {
			return {
				index: index + 1,
				description: value.description,
			};
		}),
		caseSpecialCondition: dataBasic.CaseSpecialConditions.map(
			(value, index) => {
				return {
					index: index + 1,
					description: value.description,
				};
			}
		),
		caseStep: dataBasic.CaseHistories[0].CaseHistorySteps.map((value) => {
			return {
				index: value.CaseStep.position,
				name: value.CaseStep.description,
				estado: value.CaseHistoryStepStatus.name,
				expectedResult: value.CaseStep.expectedResult
					? value.CaseStep.expectedResult
					: "-",
				time: value.timeStep,
			};
		}),
	};

	try {
		(async () => {
			var templateData = {
				cases: caseData,
			};

			var templateHtml = fs.readFileSync(
				path.join(process.cwd(), "template", "case_test.html"),
				"utf8"
			);

			var template = handlebars.compile(templateHtml);
			var finalHtml = template(templateData);
			let name = "reports" + Date.now();
			let namePDF = name + ".pdf";
			let pathFile = path.join(process.cwd(), "public", "uploads", namePDF);
			var options = {
				format: "A4",
				headerTemplate: "<p></p>",
				footerTemplate: "<p></p>",
				displayHeaderFooter: false,
				margin: {
					top: "40px",
					bottom: "100px",
				},
				printBackground: true,
				path: pathFile,
			};
			const browser = await puppeteer.launch({
				args: ["--no-sandbox"],
				headless: true,
			});
			const page = await browser.newPage();
			await page.setContent(finalHtml, {
				waitUntil: ["domcontentloaded", "load", "networkidle0"],
			});
			await page.pdf(options);
			await browser.close();

			let update_pdf_aws = await uploadPDFAWS(pathFile, namePDF);
			let fileCreate = await uploadServer(
				name,
				"pdf",
				update_pdf_aws.Location,
				req.user
			);

			let reportCreate = await createReport(namePDF, fileCreate.id, req.user);

			return res.json({
				path: update_pdf_aws.Location,
			});
		})();
	} catch (error) {
		res.status(500).send({
			status: 500,
			message: "No se ha podido completar la solicitud",
			messageDeveloper: error,
		});
	}
};

module.exports = exp;
