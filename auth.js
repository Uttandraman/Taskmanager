const express = require('express');
const router = express.Router();
const User = require('./User');
const Task = require('./Task');
const CategoryColor = require("./CategoryColor");

// POST /api/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful!' , user : newUser});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Both fields are required.' });
  }

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    return res.json({ message: 'Login successful!', user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});


function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

router.post("/tasks", async (req, res) => {
  try {
    const { category, userEmail } = req.body;

    let categoryColorDoc = await CategoryColor.findOne({ category, userEmail });

    if (!categoryColorDoc) {
      const newColor = getRandomColor();
      categoryColorDoc = new CategoryColor({
        category,
        userEmail,
        color: newColor,
      });
      await categoryColorDoc.save();
    }

    const task = new Task({ ...req.body, categoryColor: categoryColorDoc.color });
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err });
  }
});


router.get("/tasks", async (req, res) => {
  const { userEmail } = req.query;
  try {
    const tasks = await Task.find({ userEmail });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Update a task
router.put("/tasks/:id", async (req, res) => {
  try {
    const { category, userEmail } = req.body;

    let updateData = { ...req.body };

    // Fetch the existing task first
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If changing to "Completed", retain the original color
    if (category === "Completed") {
      updateData.categoryColor = existingTask.categoryColor;
      updateData.originalCategory = existingTask.category; // Store original category if needed
    } else if (category && userEmail) {
      // For any other category, assign color from CategoryColor model
      let colorDoc = await CategoryColor.findOne({ category, userEmail });

      if (!colorDoc) {
        const newColor = getRandomColor();
        colorDoc = new CategoryColor({ category, userEmail, color: newColor });
        await colorDoc.save();
      }

      updateData.categoryColor = colorDoc.color;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err });
  }
});



// Delete a task
router.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err });
  }
});



module.exports = router;
