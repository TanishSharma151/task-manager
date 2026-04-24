const Task = require('../models/Task');
const mongoose = require('mongoose');

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];


exports.getTasks = async (req, res) => {
  try {
    const { status, priority, tag, search } = req.query;
    const query = { userId: req.user.id };

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      query.status = status;
    }

    if (priority) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority value' });
      }
      query.priority = priority;
    }

    if (tag) {
      if (!mongoose.Types.ObjectId.isValid(tag)) {
        return res.status(400).json({ error: 'Invalid tag ID' });
      }
      query.tags = tag;
    }

    if (search) {
      if (typeof search !== 'string') {
        return res.status(400).json({ error: 'Invalid search value' });
      }
      
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.title = { $regex: escaped, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, tags } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title cannot exceed 200 characters' });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags must be an array' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      dueDate,
      priority,
      status,
      tags,
      userId: req.user.id
    });

    const populated = await task.populate('tags', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

  
    const { userId, _id, ...safeUpdate } = req.body;

    if (safeUpdate.priority && !VALID_PRIORITIES.includes(safeUpdate.priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    if (safeUpdate.status && !VALID_STATUSES.includes(safeUpdate.status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      safeUpdate,
      { new: true, runValidators: true }
    ).populate('tags', 'name');

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.markDone = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status === 'done') {
      return res.status(400).json({ error: 'Task is already marked as done' });
    }

    task.status = 'done';
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.reopenTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status !== 'done') {
      return res.status(400).json({ error: 'Only completed tasks can be reopened' });
    }

    task.status = 'todo';
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};