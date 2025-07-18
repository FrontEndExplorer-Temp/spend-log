const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  avatar: {
    type: String,
    default: '', // Will store the filename or URL of the avatar
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  refreshTokens: [String],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', UserSchema); 