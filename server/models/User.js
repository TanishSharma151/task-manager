const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, // remove extra spaces
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // ensure no duplicate emails
    lowercase: true, // normalize for consistency
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] // basic email validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'] // basic password rule
  }
}, { timestamps: true }); // adds createdAt & updatedAt

// Index on email for faster lookup during login
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);