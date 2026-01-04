const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, search, sortBy } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'active') {
      query.completed = false;
    }
    
    // Filter by priority
    if (priority) {
      query.priority = priority;
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sort = {};
    if (sortBy === 'priority') {
      sort = { priority: 1, createdAt: -1 };
    } else if (sortBy === 'date') {
      sort = { dueDate: 1, createdAt: -1 };
    } else {
      sort = { createdAt: -1 };
    }
    
    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH toggle task completion
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.completed = !task.completed;
    task.updatedAt = Date.now();
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET task statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ completed: true });
    const pending = await Task.countDocuments({ completed: false });
    const highPriority = await Task.countDocuments({ priority: 'high', completed: false });
    
    res.json({
      total,
      completed,
      pending,
      highPriority
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

