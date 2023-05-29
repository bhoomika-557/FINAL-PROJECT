const Placement = require("../models/placement.model");
const Student = require("../models/student.model");

const studentsList = async (req, res) => {
  try {
    const result = await Placement.aggregate([
      {
        $match: { ACADEMIC_YEAR: req.ACADEMIC_YEAR },
      },
      // {
      //   $group: {
      //     _id: { $toUpper: "$PERSONAL_DETAILS.NAME_OF_THE_STUDENT" },
      //     count: { $sum: 1 },
      //   },
      // },
      
      {
        $project: {
          REG_NO: 1,
          "PERSONAL_DETAILS.NAME_OF_THE_STUDENT": 1,
          "PERSONAL_DETAILS.GENDER": 1,
          "PERSONAL_DETAILS.COLLEGE": 1,
          "PERSONAL_DETAILS.BRANCH": 1,
          "PERSONAL_DETAILS.EMAIL": 1,
          "PERSONAL_DETAILS.MOBILE": 1,
          "PERSONAL_DETAILS.ADDRESS": 1,
          ACADEMIC_YEAR: 1,
          //
          NO_OF_OFFERS:{$sum:1 },
          //"PERSONAL_DETAILS.NAME_OF_THE_STUDENT":1,
          "SELECTED_COMPANY_DETAILS.COMPANY_NAME": 1,
          "SELECTED_COMPANY_DETAILS.CTC": 1,
        },
      },
      {
        $unwind: "$SELECTED_COMPANY_DETAILS",
      },
      {
        $group: {
          _id: "$_id",
          REG_NO: {
            $first: "$REG_NO",
          },
          NAME_OF_THE_STUDENT: {
            $first: "$PERSONAL_DETAILS.NAME_OF_THE_STUDENT",
          },
          GENDER: { $first: "$PERSONAL_DETAILS.GENDER" },
          COLLEGE: { $first: "$PERSONAL_DETAILS.COLLEGE" },
          BRANCH: { $first: "$PERSONAL_DETAILS.BRANCH" },
          EMAIL: { $first: "$PERSONAL_DETAILS.EMAIL" },
          MOBILE: { $first: "$PERSONAL_DETAILS.MOBILE" },
          ADDRESS: { $first: "$PERSONAL_DETAILS.ADDRESS" },
          ACADEMIC_YEAR: { $first: "$ACADEMIC_YEAR" },
          //
          NO_OF_OFFERS: { $sum: 1 },
        // NO_OF_OFFERS:{$count: "PERSONAL_DETAILS.NAME_OF_THE_STUDENT" },
          HIGHEST_PACKAGE: { $max: "$SELECTED_COMPANY_DETAILS.CTC" },
          LOWEST_PACKAGE: { $min: "$SELECTED_COMPANY_DETAILS.CTC" },
          HIGHEST_PACKAGE_COMPANY: {
            $first: {
              $arrayElemAt: [
                {
                  $map: {
                    input: ["$SELECTED_COMPANY_DETAILS"],
                    as: "company",
                    in: {
                      $cond: [
                        {
                          $eq: [
                            "$$company.CTC",
                            { $max: "$SELECTED_COMPANY_DETAILS.CTC" },
                          ],
                        },
                        "$$company.COMPANY_NAME",
                        null,
                      ],
                    },
                  },
                },
                0,
              ],
            },
          },
          LOWEST_PACKAGE_COMPANY: {
            $first: {
              $arrayElemAt: [
                {
                  $map: {
                    input: ["$SELECTED_COMPANY_DETAILS"],
                    as: "company",
                    in: {
                      $cond: [
                        {
                          $eq: [
                            "$$company.CTC",
                            { $min: "$SELECTED_COMPANY_DETAILS.CTC" },
                          ],
                        },
                        "$$company.COMPANY_NAME",
                        null,
                      ],
                    },
                  },
                },
                0,
              ],
            },
          },
          
        },
      },
    ]);

    if (result.length) {
      res.status(200).json({
        selected_students: result,
        message: "List of selected students fetched successfully.",
      });
    } else {
      res.status(200).json({
        selected_students: [],
        message: "No data available.",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: `Error while fetching the list of selected students data.`,
    });
  }
};

const studentSpecificCompanies = async (req, res) => {
  try {
    const REG_NO = req.params.REG_NO;
    const result = await Placement.findOne(
      { REG_NO: REG_NO },
      { SELECTED_COMPANY_DETAILS: 1 }
    );

    console.log("ss", REG_NO);
    console.log("ss", result);
    if (result?.SELECTED_COMPANY_DETAILS?.length) {
      res.status(200).json({
        result: { SELECTED_COMPANY_DETAILS: result?.SELECTED_COMPANY_DETAILS },
        message: `Selected companies of ${REG_NO} fetched successfully.`,
      });
    } else {
      res.status(200).json({
        result: {
          SELECTED_COMPANY_DETAILS: [],
          message: "No data available.",
        },
      });
    }
  } catch (e) {
    res.status(400).json({
      message: `Error while fetching the selected companies of ${REG_NO}`,
    });
  }
};

const studentDetails = async (req, res, next) => {
  try {
    console.log(req.params.REG_NO);
    const result = await Student.aggregate([
      {
        $match: { REG_NO: req.params.REG_NO },
      },
      {
        $project: {
          REG_NO: 1,
          "PERSONAL_DETAILS.NAME_OF_THE_STUDENT": 1,
          "PERSONAL_DETAILS.GENDER": 1,
          "PERSONAL_DETAILS.COLLEGE": 1,
          "PERSONAL_DETAILS.BRANCH": 1,
          "PERSONAL_DETAILS.EMAIL": 1,
          "PERSONAL_DETAILS.MOBILE": 1,
          "PERSONAL_DETAILS.ADDRESS": 1,
          ACADEMIC_YEAR: 1,
          //
          NO_OF_OFFERS:{$sum:1 },
         // "PERSONAL_DETAILS.NAME_OF_THE_STUDENT":1,
          "SELECTED_COMPANY_DETAILS.COMPANY_NAME": 1,
          "SELECTED_COMPANY_DETAILS.CTC": 1,
        },
      },
      {
        $unwind: "$SELECTED_COMPANY_DETAILS",
      },
      {
        $group: {
          _id: "$_id",
          REG_NO: {
            $first: "$REG_NO",
          },
          NAME_OF_THE_STUDENT: {
            $first: "$PERSONAL_DETAILS.NAME_OF_THE_STUDENT",
          },
          GENDER: { $first: "$PERSONAL_DETAILS.GENDER" },
          COLLEGE: { $first: "$PERSONAL_DETAILS.COLLEGE" },
          BRANCH: { $first: "$PERSONAL_DETAILS.BRANCH" },
          EMAIL: { $first: "$PERSONAL_DETAILS.EMAIL" },
          MOBILE: { $first: "$PERSONAL_DETAILS.MOBILE" },
          ADDRESS: { $first: "$PERSONAL_DETAILS.ADDRESS" },
          ACADEMIC_YEAR: { $first: "$ACADEMIC_YEAR" },
         NO_OF_OFFERS:{count: {$sum:1 }},
         // NO_OF_OFFERS:{ $first: "$PERSONAL_DETAILS.NAME_OF_THE_STUDENT"},
          HIGHEST_PACKAGE: { $max: "$SELECTED_COMPANY_DETAILS.CTC" },
          LOWEST_PACKAGE: { $min: "$SELECTED_COMPANY_DETAILS.CTC" },
          HIGHEST_PACKAGE_COMPANY: {
            $first: {
              $arrayElemAt: [
                {
                  $map: {
                    input: ["$SELECTED_COMPANY_DETAILS"],
                    as: "company",
                    in: {
                      $cond: [
                        {
                          $eq: [
                            "$$company.CTC",
                            { $max: "$SELECTED_COMPANY_DETAILS.CTC" },
                          ],
                        },
                        "$$company.COMPANY_NAME",
                        null,
                      ],
                    },
                  },
                },
                0,
              ],
            },
          },
          LOWEST_PACKAGE_COMPANY: {
            $first: {
              $arrayElemAt: [
                {
                  $map: {
                    input: ["$SELECTED_COMPANY_DETAILS"],
                    as: "company",
                    in: {
                      $cond: [
                        {
                          $eq: [
                            "$$company.CTC",
                            { $min: "$SELECTED_COMPANY_DETAILS.CTC" },
                          ],
                        },
                        "$$company.COMPANY_NAME",
                        null,
                      ],
                    },
                  },
                },
                0,
              ],
            },
          },
         
        },
      },
    ]);

    console.log(result);
    if (result.length) {
      res.status(200).json({
        student_details: result[0],
        message: "Student details fetched successfully.",
      });
    } else {
      res.status(200).json({
        student_details: [],
        message: "No data available.",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: `Error while fetching the student data.`,
    });
  }
};
module.exports = {
  studentsList,
  studentSpecificCompanies,
  studentDetails,
};
