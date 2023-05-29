const { Router } = require("express");
const app = Router();
const studentController = require("../controllers/student.controller");
const multer = require("multer");

const Auth = require("../controllers/auth.controller");
const upload = multer({ dest: "students-data/" });

app.get("/students/list", Auth.verifyUser, studentController.studentsList);
app.get(
  "/students/:REG_NO",
  Auth.verifyUser,
  studentController.studentSpecificCompanies
);

app.get(
  "/students/details/:REG_NO",
  Auth.verifyUser,
  studentController.studentDetails
);

// app.post(
//   "/students/data",
//   Auth.verifyUser,
//   upload.single("sheet"),
//   studentController.studentUpload
// );
module.exports = app;
