const Placement = require("../models/placement.model");

const departmentList = async (req, res) => {
  try {
    const result = await Placement.aggregate([
      {
        $match: { ACADEMIC_YEAR: req.ACADEMIC_YEAR },
      },
      {
        $group: {
          _id: { $toUpper: "$PERSONAL_DETAILS.BRANCH" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (result?.length) {
      res.status(200).json({
        result,
        message: "Fetched department wise data successfully.",
      });
    } else {
      res.status(200).json({
        result: [],
        message: "No data available.",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: "Error while fetching department wise data",
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const BRANCH = req.params.BRANCH;

    const result = await Placement.aggregate([
      {
        $match: {
          ACADEMIC_YEAR: req.ACADEMIC_YEAR,
          "PERSONAL_DETAILS.BRANCH": BRANCH,
        },
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
          NO_OF_OFFERS: { $size: "$SELECTED_COMPANY_DETAILS" },
          ACADEMIC_YEAR: 1,
          "SELECTED_COMPANY_DETAILS.COMPANY_NAME": 1,
          "SELECTED_COMPANY_DETAILS.CTC": 1,
        },
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
          NO_OF_OFFERS: { $first: "$NO_OF_OFFERS" },
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
        result,
        message: `Fetched selected students for department ${BRANCH} successfully.`,
      });
    } else {
      res.status(200).json({
        result: [],
        message: "No data available",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: `Error while selected students for department ${BRANCH}`,
    });
  }
};

module.exports = { departmentList, getDepartmentById };
