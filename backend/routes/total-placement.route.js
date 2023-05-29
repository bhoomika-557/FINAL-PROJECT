const { Router } = require("express");
const app = Router();
const Placement = require("../controllers/placement.controller");
const Auth = require("../controllers/auth.controller");

app.post("/total-placement/list", Auth.verifyUser, Placement.totalPlacement);

module.exports = app;
