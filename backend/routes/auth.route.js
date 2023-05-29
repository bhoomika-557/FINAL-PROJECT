const { Router } = require("express");
const app = Router();

const multer = require("multer");
const authController = require("../controllers/auth.controller");
const upload = multer({ dest: "register-uploads/" });

app.post("/register", upload.single("sheet"), authController.register);
app.post("/login", authController.login);
// app.post("/verify", authController.verifyUser);

module.exports = app;
