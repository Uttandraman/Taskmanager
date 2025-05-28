const mongoose = require("mongoose");

const CategoryColorSchema = new mongoose.Schema({
  userEmail: String,
  category: String,
  color: String,
});

module.exports = mongoose.model("CategoryColor", CategoryColorSchema);
