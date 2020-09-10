// Users.js
module.exports = (function() {
  "use strict";
  const app = require("express").Router();
  const C_UserRole = require("../api/controllers/UserRole.Controller");

  app.get("/", C_UserRole.findAll);

  return app;
})();
