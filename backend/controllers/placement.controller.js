const excelToJson = require("convert-excel-to-json");
const Placement = require("../models/placement.model");
const Student = require("../models/student.model");

const fs = require("fs");
function reduceJSON(jsonFile) {
  const registerNos = new Set();
  const result = jsonFile?.reduce((prev, curr) => {
    if (!registerNos.has(curr.REG_NO)) {
      registerNos.add(curr.REG_NO);
      return [
        ...prev,
        {
          REG_NO: curr.REG_NO,
          ACADEMIC_YEAR: curr.ACADEMIC_YEAR,
          PERSONAL_DETAILS: {
            NAME_OF_THE_STUDENT: curr.NAME_OF_THE_STUDENT,
            GENDER: curr.GENDER,
            BRANCH: curr.BRANCH,
            EMAIL: curr.EMAIL,
            MOBILE: curr.MOBILE,
            ADDRESS: curr.ADDRESS,
          },
          SELECTED_COMPANY_DETAILS: [
            {
              COMPANY_NAME: curr.COMPANY_NAME,
              CTC: curr.CTC,
              CAMPUS_TYPE: curr.CAMPUS_TYPE,
              SELECTED_DATE: curr.SELECTED_DATE,
            },
          ],
        },
      ];
    } else {
      const existing = prev.find((obj) => obj.REG_NO === curr.REG_NO);
      if (existing) {
        existing.SELECTED_COMPANY_DETAILS.push({
          COMPANY_NAME: curr.COMPANY_NAME,
          CTC: curr.CTC,
          CAMPUS_TYPE: curr.CAMPUS_TYPE,
          SELECTED_DATE: curr.SELECTED_DATE,
        });
      }
      return [...prev];
    }
  }, []);
  console.log(result,'result')
  return [result, registerNos];
}

const placementUpload = async (req, res, next) => {
  try {
    const { path } = req.file;
    const jsonFile = excelToJson({
      sourceFile: path,
      columnToKey: {
        A: "S_NO",
        B: "REG_NO",
        C: "COLLEGE",
        D: "NAME_OF_THE_STUDENT",
        E: "GENDER",
        F: "BRANCH",
        G: "EMAIL",
        H: "MOBILE",
        I: "COMPANY_NAME",
        J: "SELECTED_DATE",
        K: "CTC",
        L: "CAMPUS_TYPE",
        M: "ADDRESS",
        N: "ACADEMIC_YEAR",
      },
      header: {
        rows: 1,
      },
    });
    const [reduced, registerNos] = reduceJSON(jsonFile.Sheet1);
    console.log('reduced', reduced)
    const existingDocs = await Placement.find({
      REG_NO: { $in: Array.from(registerNos) },
    });
    // Filter out the existing register numbers from the new reduced JSON
    const newDocs = reduced.filter((doc) => {
      return !existingDocs.some((existingDoc) => {
        return existingDoc.REG_NO === doc.REG_NO;
      });
    });

    // Insert the new documents into the collection
    if (newDocs.length) {
      await Placement.insertMany(newDocs);
    }

    // Update the existing documents in the collection
    if (existingDocs.length) {
      existingDocs.map(async (ele) => {
        const index = reduced.findIndex((x) => {
          return x.REG_NO === ele.REG_NO;
        });
        if (index !== -1) {
          const unique_company = new Set();
          const SELECTED_COMPANY_DETAILS = [
            ...reduced[index].SELECTED_COMPANY_DETAILS,
            ...ele.SELECTED_COMPANY_DETAILS,
          ].filter((ele) => {
            if (!unique_company.has(ele.COMPANY_NAME)) {
              unique_company.add(ele.COMPANY_NAME);
              return true;
            } else {
              return false;
            }
          });
          reduced[index].SELECTED_COMPANY_DETAILS = SELECTED_COMPANY_DETAILS;
          await Placement.findByIdAndUpdate(ele._id, reduced[index]);
        }
      });
    }

    fs.unlinkSync(path, (err) => {
      if (err) {
        res.status(500).json({
          message: "Error while uploading file data.",
        });
      }
    });
    res.status(200).json({
      message: "File upload successfull",
    });
  } catch (e) {
    res.status(400).json({
      message: "Error while uploading file data.",
    });
  }
};

const totalPlacement = async (req, res, next) => {
  try {
    const data = await Placement.find({
      ACADEMIC_YEAR: { $eq: req.ACADEMIC_YEAR },
    });
    const result = [];
    data.forEach((ele) => {
      const flatten = [];
      ele.SELECTED_COMPANY_DETAILS.forEach((x) => {
        flatten.push({
          REG_NO: ele?.REG_NO,
          NAME_OF_THE_STUDENT: ele?.PERSONAL_DETAILS.NAME_OF_THE_STUDENT,
          GENDER: ele?.PERSONAL_DETAILS.GENDER,
          COLLEGE: ele?.PERSONAL_DETAILS.COLLEGE,
          BRANCH: ele?.PERSONAL_DETAILS.BRANCH,
          EMAIL: ele?.PERSONAL_DETAILS.EMAIL,
          MOBILE: ele?.PERSONAL_DETAILS.MOBILE,
          ADDRESS: ele?.PERSONAL_DETAILS.ADDRESS,
          ACADEMIC_YEAR: ele?.ACADEMIC_YEAR,
          COMPANY_NAME: x?.COMPANY_NAME,
          CTC: x?.CTC,
          CAMPUS_TYPE: x?.CAMPUS_TYPE,
          SELECTED_DATE: x?.SELECTED_DATE,
        });
      });
      result.push(...flatten);
    });

    if (result) {
      res.status(200).json({
        result,
        message: "Placement sheet data fetched successfully.",
      });
    } else {
      res.status(200).json({
        result: [],
        message: "No data available.",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: "Error while fetching the placement sheet data.",
    });
  }
};

const studentUpload = async (req, res, next) => {
  try {
    const { path } = req.file;
    const jsonFile = excelToJson({
      sourceFile: path,
      columnToKey: {
        A: "S_NO",
        B: "REG_NO",
        C: "COLLEGE",
        D: "NAME_OF_THE_STUDENT",
        E: "GENDER",
        F: "BRANCH",
        G: "EMAIL",
        H: "MOBILE",
        I: "COMPANY_NAME",
        J: "SELECTED_DATE",
        K: "CTC",
        L: "CAMPUS_TYPE",
        M: "ADDRESS",
        N: "ACADEMIC_YEAR",
      },
      header: {
        rows: 1,
      },
    });
    const [reduced, registerNos] = reduceJSON(jsonFile.Sheet1);
    const existingDocs = await Student.find({
      REG_NO: { $in: Array.from(registerNos) },
    });
    // Filter out the existing register numbers from the new reduced JSON
    const newDocs = reduced.filter((doc) => {
      return !existingDocs.some((existingDoc) => {
        return existingDoc.REG_NO === doc.REG_NO;
      });
    });

    // Insert the new documents into the collection
    if (newDocs.length) {
      await Student.insertMany(newDocs);
    }

    // Update the existing documents in the collection
    if (existingDocs.length) {
      existingDocs.map(async (ele) => {
        const index = reduced.findIndex((x) => {
          return x.REG_NO === ele.REG_NO;
        });
        if (index !== -1) {
          const unique_company = new Set();
          const SELECTED_COMPANY_DETAILS = [
            ...reduced[index].SELECTED_COMPANY_DETAILS,
            ...ele.SELECTED_COMPANY_DETAILS,
          ].filter((ele) => {
            if (!unique_company.has(ele.COMPANY_NAME)) {
              unique_company.add(ele.COMPANY_NAME);
              return true;
            } else {
              return false;
            }
          });
          reduced[index].SELECTED_COMPANY_DETAILS = SELECTED_COMPANY_DETAILS;
          await Student.findByIdAndUpdate(ele._id, reduced[index]);
        }
      });
    }

    fs.unlinkSync(path, (err) => {
      if (err) {
        res.status(500).json({
          message: "Error while uploading file data.",
        });
      }
    });
    res.status(200).json({
      message: "File upload successfull",
    });
  } catch (e) {
    res.status(400).json({
      message: "Error while uploading file data.",
    });
  }
};
module.exports = { placementUpload, totalPlacement, studentUpload };
