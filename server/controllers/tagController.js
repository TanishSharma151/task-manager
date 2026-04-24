const Tag = require('../models/Tag');
const Task = require('../models/Task');


exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    if (name.trim().length > 50) {
      return res.status(400).json({ error: 'Tag name cannot exceed 50 characters' });
    }

    const existing = await Tag.findOne({
      name: name.trim(),
      userId: req.user.id
    });

    if (existing) {
      return res.status(400).json({ error: 'Tag already exists' });
    }

    const tag = await Tag.create({ name: name.trim(), userId: req.user.id });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    if (name.trim().length > 50) {
      return res.status(400).json({ error: 'Tag name cannot exceed 50 characters' });
    }

    const tag = await Tag.findOne({ _id: req.params.id, userId: req.user.id });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const duplicate = await Tag.findOne({
      name: name.trim(),
      userId: req.user.id,
      _id: { $ne: req.params.id }
    });

    if (duplicate) {
      return res.status(400).json({ error: 'A tag with this name already exists' });
    }

    tag.name = name.trim();
    await tag.save();

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id, userId: req.user.id });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    await Task.updateMany(
      { tags: req.params.id, userId: req.user.id },
      { $pull: { tags: req.params.id } }
    );

    await Tag.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};