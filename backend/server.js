const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.error('Make sure MongoDB is running on your system.');
});

// Routes
app.use('/api/tasks', require('./routes/tasks'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Task Manager API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

