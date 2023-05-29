const excelToJson = require("convert-excel-to-json");
const Auth = require("../models/auth.model");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function reduceJSON(jsonFile) {
  const data = jsonFile
  const uniqueData = {}
  const dup = []
  for(let i=0; i< data.length;i++) {
    const item = data[i]
    const EMAIL = item.EMAIL

    if(!uniqueData[EMAIL]) {
      uniqueData[EMAIL] = item
    } else {
      dup.push(item.EMAIL)
    }
  }
console.log(dup)
  return Object.values(uniqueData)
  
}



const register = async (req, res, next) => {
  try {
    const { path } = req.file;
    const jsonFile = excelToJson({
      sourceFile: path,
      columnToKey: {
        A: "EMAIL",
        B: "PASSWORD",
        C: "ROLE",
        D: "ACADEMIC_YEAR",
      },
      header: {
        rows: 1,
      },
    });
    const data = reduceJSON(jsonFile.Sheet1);
    data.forEach(async (user) => {
      const existing = await Auth.findOne({ EMAIL: user.EMAIL });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(user.PASSWORD, 10);

        const newUser = new Auth({
          EMAIL: user.EMAIL,
          PASSWORD: hashedPassword,
          ROLE: user.ROLE,
          ACADEMIC_YEAR: user.ACADEMIC_YEAR,
        });
        await newUser.save();
      }
    });

    fs.unlinkSync(path, (err) => {
      if (err) {
        res.status(500).json({
          message: "Error while registering the credentials.",
        });
      }
    });
    res.status(200).json({
      message: "Credentials added successful",
    });
  } catch (e) {
    res.status(500).json({
      message: "Error while uploading credentials file data.",
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { EMAIL, PASSWORD } = req.body;
    console.log(EMAIL, PASSWORD)
    const user = await Auth.findOne({ EMAIL });

    console.log('user', user)
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(PASSWORD, user.PASSWORD);
    console.log(passwordMatch)
    console.log('p', PASSWORD)
    console.log(user.PASSWORD)

    if (passwordMatch) {
      const token = jwt.sign(
        {
          EMAIL,
          ROLE: user.ROLE,
        },
        process.env.SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).json({
        token: token,
        message: "Login Successfull",
      });
    } else {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Not a valid user.",
    });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    token = token.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await Auth.findOne({ EMAIL: decoded.EMAIL });
    if (!user) {
      throw new Error();
    }
    const tokenExpiration = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    if (now >= tokenExpiration) {
      res.status(401).send({ error: "Token has expired." });
    }

    req.user = user;
    req.token = token;
    req.ACADEMIC_YEAR = req.header("ACADEMIC_YEAR");
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
module.exports = { register, login, verifyUser };
