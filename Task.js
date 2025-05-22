const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: String,
  category: String,
  userEmail: String, // Optional if you want user-based separation
});

module.exports = mongoose.model("Task", TaskSchema);
