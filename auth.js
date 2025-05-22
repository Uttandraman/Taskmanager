const express = require('express');
const router = express.Router();
const User = require('./User');
const Task = require('./Task');

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

    // Create and save new user (no hashing)
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

router.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err });
  }
});

// Backend: GET /api/tasks?userEmail=test@example.com
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
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
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
