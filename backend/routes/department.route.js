const { Router } = require("express");
const app = Router();
const Department = require("../controllers/department.controller");
const Auth = require("../controllers/auth.controller");

app.get("/department-wise-list", Auth.verifyUser, Department.departmentList);
app.get(
  "/departmet-specific-list/:BRANCH",
  Auth.verifyUser,
  Department.getDepartmentById
);

module.exports = app;
