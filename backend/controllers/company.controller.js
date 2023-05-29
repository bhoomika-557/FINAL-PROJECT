const Placement = require("../models/placement.model");

const companyList = async (req, res) => {
  try {
    const result = await Placement.aggregate([
      {
        $match: { ACADEMIC_YEAR: req.ACADEMIC_YEAR },
      },
      { $unwind: "$SELECTED_COMPANY_DETAILS" },
      {
        $group: {
          _id: "$SELECTED_COMPANY_DETAILS.COMPANY_NAME",
          SELECTED_COUNT: { $sum: 1 },
          COMPANY_NAME: { $first: "$SELECTED_COMPANY_DETAILS.COMPANY_NAME" },
          CTC: { $first: "$SELECTED_COMPANY_DETAILS.CTC" },
          CAMPUS_TYPE: { $first: "$SELECTED_COMPANY_DETAILS.CAMPUS_TYPE" },
        },
      },
      {
        $group: {
          _id: null,
          company_list: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          company_list: "$company_list",
        },
      },
    ]);

    if (result?.length) {
      console.log(JSON.stringify(result[0]));
      res.status(200).json({
        ...result[0],
        message: "List of companies fetched successfully.",
      });
    } else {
      res.status(200).json({
        company_list: [],
        message: "No data available.",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: `Error while fetching the list of companies data.`,
    });
  }
};

const companySpecificList = async (req, res) => {
  try {
    const COMPANY_NAME = req.params.company;
    const result = await Placement.find(
      {
        ACADEMIC_YEAR: req.ACADEMIC_YEAR,
        "SELECTED_COMPANY_DETAILS.COMPANY_NAME": COMPANY_NAME,
      },
      {
        PERSONAL_DETAILS: 1,
        REG_NO: 1,
        "SELECTED_COMPANY_DETAILS.$": 1,
      }
    );
    if (result?.length) {
      res.status(200).json({
        result,
        message: `Selected students for ${COMPANY_NAME} fetched successfully.`,
      });
    } else {
      res.status(200).json({
        result: [],
        message: "No data available.",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: `Error while fetching the data for ${COMPANY_NAME}`,
    });
  }
};

module.exports = { companySpecificList, companyList };
