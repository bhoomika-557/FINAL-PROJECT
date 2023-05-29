const { Router } = require("express");
const app = Router();
const companyController = require("../controllers/company.controller");
const Auth = require("../controllers/auth.controller");

app.get("/company/list", Auth.verifyUser, companyController.companyList);
app.get(
  "/company/single/:company",
  Auth.verifyUser,
  companyController.companySpecificList
);

module.exports = app;
