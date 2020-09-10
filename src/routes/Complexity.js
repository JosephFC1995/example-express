// Projects.js
module.exports = (function () {
  "use strict";
  const app = require("express").Router();
  const c_complexity = require("../api/controllers/Complexity.Controller");
  require("dotenv").config();

  app.get("/", c_complexity.findAll);

  //   app.get("/:id", c_complexity.findOne);

  //   app.put("/:id", c_complexity.update);

  //   app.post("/", c_complexity.create);

  //   app.delete("/:id", c_complexity.delete);

  return app;
})();
