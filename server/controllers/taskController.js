const Task = require('../models/Task');

// Get all tasks with filters
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, tag, search } = req.query;
    const query = { userId: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tag) query.tags = tag;
    if (search) query.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query)
      .populate('tags', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, tags } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create({
      title,
      description,
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

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('tags', 'name');

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark done
exports.markDone = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.status = 'done';
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};