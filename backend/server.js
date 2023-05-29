const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileRouter = require("./routes/file-upload.route");
const CompanyRouter = require("./routes/company.route");
const studentRouter = require("./routes/student.route");
const totalPlacementRouter = require("./routes/total-placement.route");
const authRouter = require("./routes/auth.route");
const departmentRouter = require("./routes/department.route");

dotenv.config();
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mongoose
  .connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log(process.env.URL);
    console.log("Error while connecting to database.");
  });

// routes
app.use(studentRouter);
app.use(CompanyRouter);
app.use(fileRouter);
app.use(totalPlacementRouter);
app.use(authRouter);
app.use(departmentRouter);
app.get("/", (req, res) => {
  res.send("server running on port 3001");
});

app.listen(process.env.PORT || 3001, (error) => {
  if (!error) {
    console.log("server running on port", process.env.PORT || 3002);
  } else {
    console.log("Error while connecting to server!");
  }
});
