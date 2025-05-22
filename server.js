const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://uttandaramanb:uttand%4004@taskmanager.tudirkm.mongodb.net/?retryWrites=true&w=majority&appName=Taskmanager')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use the auth route
app.use('/api', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
