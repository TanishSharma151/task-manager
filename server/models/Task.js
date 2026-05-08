const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true, // remove extra spaces
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  dueDate: {
    type: Date // optional deadline for task
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'], // restrict allowed values
      message: 'Priority must be low, medium, or high'
    },
    default: 'medium'
  },
  status: {
    type: String,
    enum: {
      values: ['todo', 'in-progress', 'done'], // task lifecycle states
      message: 'Status must be todo, in-progress, or done'
    },
    default: 'todo'
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag' // reference to Tag collection (many-to-many)
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ensures task belongs to a specific user
    required: [true, 'User ID is required']
  }
}, { timestamps: true }); // adds createdAt & updatedAt

// Indexes to optimize common queries
taskSchema.index({ userId: 1 }); // fetch all tasks of a user
taskSchema.index({ userId: 1, status: 1 }); // filter by status
taskSchema.index({ userId: 1, priority: 1 }); // filter by priority

module.exports = mongoose.model('Task', taskSchema);