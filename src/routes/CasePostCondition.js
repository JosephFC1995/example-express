// Projects.js
module.exports = (function () {
  "use strict";
  const app = require("express").Router();
  const c_case_postcondition = require("../api/controllers/CasePostCondition.Controller");
  require("dotenv").config();

  //   app.get("/", c_case_postcondition.findAll);

  //   app.get("/:id", c_case_postcondition.findOne);

  app.put("/:id", c_case_postcondition.update);

  app.post("/", c_case_postcondition.create);

  app.delete("/:id", c_case_postcondition.delete);

  return app;
})();
