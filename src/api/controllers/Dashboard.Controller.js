const db = require("../config/index");
require("dotenv").config();
const {
	hasUser,
	getUser,
	getCountAllProjects,
	getCountAllCases,
	getCountAllErrors,
	getCountAllUsers,
	getCountAllHistory,
	getCountHistoryByTester,
	getCountAllCasesByAsignTest,
	getCountStepMake,
	getCountCasePending,
	getCountAllReports,
	findInArray,
} = require("./index");
const { Op } = db.Sequelize;
const {
	User,
	UserRole,
	File,
	Error,
	Project,
	Complexity,
	ErrorStatus,
	ErrorMessage,
} = db;

const exp = {};

exp.findAll = async (req, res) => {
	let dashboard = {
		panels: {},
	};

	if (findInArray(req.user.scope, "tester")) {
		let count_projects = await getCountAllProjects();
		dashboard.panels.project = {
			title: "Proyectos",
			count: count_projects,
			ico: "ApertureIcon",
			route: null,
			style: "color: #ff9f43;fill: rgba(255,159,67,0.25);",
		};
		let count_cases = await getCountAllCases();
		dashboard.panels.cases = {
			title: "Casos de prueba",
			count: count_cases,
			ico: "LayersIcon",
			route: null,
			style: "color: rgb(45, 218, 181); fill: rgba(45,218,181,0.25);",
		};

		let count_history_by_user = await getCountHistoryByTester(req.user.id);
		dashboard.panels.tests = {
			title: "Testeos realizados",
			count: count_history_by_user,
			ico: "CheckIcon",
			route: null,
			style: "color: #fd3c97 ; fill: rgba(253, 60, 151, 0.25)",
		};

		let count_cases_asign = await getCountAllCasesByAsignTest(req.user.id);
		dashboard.panels.case_asign = {
			title: "Casos de p. asignadas",
			count: count_cases_asign,
			ico: "UserCheckIcon",
			route: null,
			style: "color: #6d81f5; fill: rgba(109,129,245,0.25);",
		};

		let count_step_makes = await getCountStepMake(req.user.id);
		dashboard.panels.step_makes = {
			title: "Total pasos realizadas",
			count: count_step_makes,
			ico: "ChevronsUpIcon",
			route: null,
			style: "color: #9ba7ca; fill: rgba(155, 167, 202, 0.25)",
		};

		let count_case_pendint = await getCountCasePending(req.user.id);
		dashboard.panels.case_pending = {
			title: "Casos de p. pendientes",
			count: count_case_pendint,
			ico: "ClockIcon",
			route: "cases-asign",
			style: "color: #472727; fill: rgba(71, 39, 39, 0.25);",
		};
	} else if (findInArray(req.user.scope, "administrator")) {
		let count_projects = await getCountAllProjects();
		dashboard.panels.project = {
			title: "Proyectos",
			count: count_projects,
			ico: "ApertureIcon",
			route: "projects",
			style: "color: #ff9f43;fill: rgba(255,159,67,0.25);",
		};
		let count_cases = await getCountAllCases();
		dashboard.panels.cases = {
			title: "Casos de prueba",
			count: count_cases,
			ico: "LayersIcon",
			route: "cases",
			style: "color: rgb(45, 218, 181); fill: rgba(45,218,181,0.25);",
		};
		let count_errors = await getCountAllErrors();
		dashboard.panels.errors = {
			title: "Errores",
			count: count_errors,
			ico: "MehIcon",
			route: "errors",
			style: "color: #fd3c97 ; fill: rgba(253, 60, 151, 0.25)",
		};
		let count_users = await getCountAllUsers();
		dashboard.panels.users = {
			title: "Usuarios",
			count: count_users,
			ico: "UsersIcon",
			route: "users",
			style: "color: #6d81f5; fill: rgba(109,129,245,0.25);",
		};
		let count_reports = await getCountAllReports();
		dashboard.panels.reports = {
			title: "Reportes",
			count: count_reports,
			ico: "ZapIcon",
			route: "reports",
			style: "color: #9ba7ca; fill: rgba(155, 167, 202, 0.25)",
		};
		let count_history = await getCountAllHistory();
		dashboard.panels.testeo = {
			title: "Testeos",
			count: count_history,
			ico: "PlayCircleIcon",
			route: null,
			style: "color: #472727; fill: rgba(71, 39, 39, 0.25);",
		};
	}
	return res.json(dashboard);
};

module.exports = exp;
