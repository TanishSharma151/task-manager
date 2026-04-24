const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    trim: true,
    maxlength: [50, 'Tag name cannot exceed 50 characters']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, { timestamps: true });

tagSchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Tag', tagSchema);