const mongoose = require("mongoose");

const schema = mongoose.Schema({
  EMAIL: { type: String, unique: true },
  PASSWORD: String,
  ROLE: String,
});

module.exports = mongoose.model("auth", schema);
