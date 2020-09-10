// Error.js
module.exports = (function () {
  "use strict";
  const app = require("express").Router();
  const c_dashboard = require("../api/controllers/Dashboard.Controller");
  require("dotenv").config();

  app.get("/", c_dashboard.findAll);

  //   app.get("/:id", c_dashboard.findOne);

  //   app.put("/:id", c_dashboard.update);

  //   app.post("/steps", c_dashboard.updateMultiple);

  //   app.post("/", c_dashboard.create);

  //   app.delete("/:id", c_dashboard.delete);

  return app;
})();
