const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    trim: true, // remove extra spaces
    maxlength: [50, 'Tag name cannot exceed 50 characters']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to owner of the tag
    required: [true, 'User ID is required']
  }
}, { timestamps: true }); // adds createdAt and updatedAt

// Ensure tag names are unique per user (same name allowed across different users)
tagSchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Tag', tagSchema);