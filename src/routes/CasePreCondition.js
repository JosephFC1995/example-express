// Projects.js
module.exports = (function () {
  "use strict";
  const app = require("express").Router();
  const c_case_precondition = require("../api/controllers/CasePreCondition.Controller");
  require("dotenv").config();

  //   app.get("/", c_case_precondition.findAll);

  //   app.get("/:id", c_case_precondition.findOne);

  app.put("/:id", c_case_precondition.update);

  app.post("/", c_case_precondition.create);

  app.delete("/:id", c_case_precondition.delete);

  return app;
})();
