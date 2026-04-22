const Tag = require('../models/Tag');
const Task = require('../models/Task');

// Get all tags
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create tag
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const existing = await Tag.findOne({ name, userId: req.user.id });
    if (existing) {
      return res.status(400).json({ error: 'Tag already exists' });
    }

    const tag = await Tag.create({ name, userId: req.user.id });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Rename tag
exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id, userId: req.user.id });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    tag.name = req.body.name || tag.name;
    await tag.save();

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete tag — tasks not deleted
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id, userId: req.user.id });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Remove tag from all tasks but don't delete tasks
    await Task.updateMany(
      { tags: req.params.id },
      { $pull: { tags: req.params.id } }
    );

    await Tag.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};