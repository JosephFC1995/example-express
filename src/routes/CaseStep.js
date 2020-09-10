// Projects.js
module.exports = (function () {
  "use strict";
  const app = require("express").Router();
  const c_case_step = require("../api/controllers/CaseStep.Controller");
  require("dotenv").config();

  //   app.get("/", c_case_step.findAll);

  //   app.get("/:id", c_case_step.findOne);

  app.put("/:id", c_case_step.update);

  app.post("/steps", c_case_step.updateMultiple);

  app.post("/", c_case_step.create);

  app.delete("/:id", c_case_step.delete);

  return app;
})();
