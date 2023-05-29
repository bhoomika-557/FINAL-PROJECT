const { Router } = require("express");
const app = Router();

const multer = require("multer");
const placementController = require("../controllers/placement.controller");
const upload = multer({ dest: "uploads/" });
const studUpload = multer({ dest: "student-uploads/" });

const Auth = require("../controllers/auth.controller");

app.post(
  "/file-upload/placement",
  Auth.verifyUser,
  upload.single("sheet"),
  placementController.placementUpload
);

app.post(
  "/file-upload/student",
  Auth.verifyUser,
  studUpload.single("sheet"),
  placementController.studentUpload
);

module.exports = app;
