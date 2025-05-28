const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: String,
  category: String,
  originalCategory: String,
  userEmail: String,
  categoryColor: String,
});

module.exports = mongoose.model("Task", TaskSchema);
