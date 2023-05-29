const mongoose = require("mongoose");

const schema = mongoose.Schema({
  REG_NO: { type: String, unique: true },
  ACADEMIC_YEAR: String,
  PERSONAL_DETAILS: {
    NAME_OF_THE_STUDENT: String,
    GENDER: String,
    COLLEGE: String,
    BRANCH: String,
    EMAIL: String,
    MOBILE: String,
    ADDRESS: String,
  },
  SELECTED_COMPANY_DETAILS: [
    {
      COMPANY_NAME: String,
      CTC: String,
      CAMPUS_TYPE: String,
      SELECTED_DATE: String,
    },
  ],
});

module.exports = mongoose.model("Placement", schema);
