// Projects.js
module.exports = (function () {
  "use strict";
  const app = require("express").Router();
  const c_case_specialcondition = require("../api/controllers/CaseSpecialCondition.Controller");
  require("dotenv").config();

  //   app.get("/", c_case_specialcondition.findAll);

  //   app.get("/:id", c_case_specialcondition.findOne);

  app.put("/:id", c_case_specialcondition.update);

  app.post("/", c_case_specialcondition.create);

  app.delete("/:id", c_case_specialcondition.delete);

  return app;
})();
