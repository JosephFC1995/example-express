const db = require("../config/index");
require("dotenv").config();
const { hasUser, getUser } = require("./index");
const { Op } = db.Sequelize;
const {
	User,
	UserRole,
	File,
	Project,
	Error,
	ErrorStatus,
	Complexity,
	CaseStatus,
	Case,
	CaseHistory,
	CaseHistoryStep,
	ProjectStatus,
} = db;
const {
	getCountCases,
	getCountErros,
	getIndicatorPrimarys,
	uploadPDFAWS,
	uploadServer,
	createReport,
} = require("./index");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

const exp = {};

exp.indicatorCoverage = async (req, res) => {
	var countDays = req.query.countdays ? req.query.countdays : 20;

	var arrayD = [];
	var dayNow = moment();
	var dayIndice = moment().subtract(countDays, "days");

	const caseHistorys = await CaseHistory.findAll({
		where: {
			status: 1,
			createdAt: {
				[Op.between]: [dayIndice, dayNow],
			},
		},
		order: [["createdAt", "DESC"]],
		include: [
			{
				model: CaseHistoryStep,
			},
			{
				model: Case,
				where: {
					status: 1,
				},
			},
		],
	});

	for (let i = 0; i < countDays; i++) {
		var dateString = moment().subtract(i, "days").format("DD-MM-YYYY");
		arrayD[i] = {
			date: dateString,
		};
	}

	let arrayRever = arrayD.reverse();

	let scores = getIndicatorPrimarys(caseHistorys, arrayRever);

	return res.json({
		source: scores,
	});
};

exp.reports = async (req, res) => {
	let { dataEnd, dataStart, project, report, typeFilter, year } = req.query;
	let title = null;
	let data = null;
	if (typeFilter == "case") {
		if (report == "coverage") {
			data = await db.sequelize.query(
				"CALL cobertura_by_date(:date_s, :date_f)",
				{
					replacements: { date_s: dataStart, date_f: dataEnd },
					raw: true,
					plain: true,
				}
			);
		} else if (report == "maturity") {
			data = await db.sequelize.query(
				"CALL madurez_by_date(:date_s, :date_f)",
				{
					replacements: { date_s: dataStart, date_f: dataEnd },
					raw: true,
					plain: true,
				}
			);
		}
		let dataPase = null;
		dataPase = Object.keys(data).map((key) => {
			return {
				index: Number(key) + 1,
				...data[key],
			};
		});
		if (report == "coverage") {
			title = "Nivel De Cobertura De Las Pruebas";
		} else {
			title = "Nivel De Madurez De Las Pruebas";
		}

		return res.json({
			error: false,
			code: 200,
			type_filter: typeFilter,
			type_report: report,
			title: title,
			dateStart: dataStart,
			dateEnd: dataEnd,
			dateNow: moment().format("YYYY-MM-DD"),
			data: dataPase,
		});
	} else {
		data = await db.sequelize.query("CALL project_by_year(:y)", {
			replacements: { y: year },
			raw: true,
			plain: true,
		});

		projectStatus = await db.sequelize.query(
			"CALL project_close_active_by_year(:y)",
			{
				replacements: { y: year },
				raw: true,
				plain: true,
			}
		);

		projectStatusParse = Object.keys(projectStatus).map((key) => {
			return {
				...projectStatus[key],
			};
		});
		dataPase = Object.keys(data).map((key) => {
			return {
				...data[key],
			};
		});
		let array_m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		array_m.forEach((value) => {
			let m_index = value;
			let val_m = dataPase.some((item) => item.mes === m_index);
			if (!val_m)
				dataPase.push({
					mes: m_index,
					total: 0,
				});
		});
		dataPase.sort((a, b) => {
			if (a.name > b.name) {
				return 1;
			}
			if (a.name < b.name) {
				return -1;
			}
			// a must be equal to b
			return 0;
		});
		return res.json({
			error: false,
			code: 200,
			type_filter: typeFilter,
			type_report: report,
			title: title,
			dateStart: dataStart,
			dateEnd: dataEnd,
			dateNow: moment().format("YYYY-MM-DD"),
			data: {
				projectByY: dataPase,
				projectStatusParse: projectStatusParse[0]
					? projectStatusParse[0]
					: {
							proyect_active: "0",
							proyect_close: "0",
					  },
			},
		});
	}
};

exp.generateReport = async (req, res) => {
	const {
		data,
		title,
		dateStart,
		dateEnd,
		title_value_in_compare,
		promedio,
		formula,
	} = req.body;
	try {
		(async () => {
			var dataBinding = {
				title_h1: title,
				data: data,
				title: title,
				dateStart: dateStart,
				dateEnd: dateEnd,
				dateNow: moment().format("YYYY-MM-DD"),
				title_value_in_compare: title_value_in_compare,
				promedio: promedio,
				formula: formula,
			};

			var templateHtml = fs.readFileSync(
				path.join(process.cwd(), "template", "indicator.html"),
				"utf8"
			);
			var template = handlebars.compile(templateHtml);
			var finalHtml = template(dataBinding);
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
	} catch (err) {
		console.log("ERROR:", err);
	}
};

exp.indicatorCoverageDashboard = async (req, res) => {
	var countDays = 9;

	var arrayD = [];
	var dayNow = moment();
	var dayIndice = moment().subtract(countDays, "days");

	const caseHistorys = await CaseHistory.findAll({
		where: {
			status: 1,
			createdAt: {
				[Op.between]: [dayIndice, dayNow],
			},
		},
		order: [["createdAt", "DESC"]],
		include: [
			{
				model: CaseHistoryStep,
			},
			{
				model: Case,
				where: {
					status: 1,
				},
			},
		],
	});

	for (let i = 0; i < countDays; i++) {
		var dateString = moment().subtract(i, "days").format("DD-MM-YYYY");
		arrayD[i] = {
			date: dateString,
		};
	}

	let arrayRever = arrayD.reverse();

	let scores = getIndicatorPrimarys(caseHistorys, arrayRever);

	return res.json({
		source: scores,
	});
};

module.exports = exp;
