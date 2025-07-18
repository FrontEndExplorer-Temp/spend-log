const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { isAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../assets/images'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.userId + '_avatar' + ext);
  },
});
const upload = multer({ storage });

// Helper to generate tokens
function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
}
function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({ email, password: hashed, verificationToken });
    await user.save();
    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    await transporter.sendMail({
      to: user.email,
      from: process.env.MAIL_FROM || 'no-reply@expensetracker.com',
      subject: 'Verify your email',
      html: `
        <div style="max-width:480px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;font-family:sans-serif;color:#222;">
          <div style="text-align:center;">
            <h2 style="color:#2d6cdf;margin-bottom:8px;">Spend Log</h2>
            <p style="font-size:16px;margin-bottom:24px;">Track every penny, grow your savings.</p>
          </div>
          <div style="background:#fff;padding:24px 20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <p style="font-size:16px;margin-bottom:16px;">Thank you for registering! Please verify your email address.</p>
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#2d6cdf;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;margin-bottom:16px;">Verify Email</a>
            <p style="font-size:14px;color:#888;margin-top:24px;">If you did not request this, you can safely ignore this email.</p>
          </div>
          <div style="text-align:center;margin-top:32px;font-size:12px;color:#aaa;">
            &copy; ${new Date().getFullYear()} Spend Log. All rights reserved.
          </div>
        </div>
      `
    });
    res.json({ message: 'Registration successful! Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Email verification route
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login (only allow if verified)
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email before logging in.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ token: accessToken, email: user.email, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    const newAccessToken = generateAccessToken(user._id);
    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});

// Logout endpoint (removes refresh token)
router.post('/logout', auth, async (req, res) => {
  const token = req.cookies.refreshToken;
  try {
    const user = await User.findById(req.userId);
    if (user && token) {
      user.refreshTokens = (user.refreshTokens || []).filter(t => t !== token);
      await user.save();
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user with that email' });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Configure nodemailer (Mailtrap for dev)
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
    await transporter.sendMail({
      to: user.email,
      from: process.env.MAIL_FROM || 'no-reply@expensetracker.com',
      subject: 'Password Reset',
      html: `
        <div style="max-width:480px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;font-family:sans-serif;color:#222;">
          <div style="text-align:center;">
            <h2 style="color:#2d6cdf;margin-bottom:8px;">Spend Log</h2>
            <p style="font-size:16px;margin-bottom:24px;">Track every penny, grow your savings.</p>
          </div>
          <div style="background:#fff;padding:24px 20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <p style="font-size:16px;margin-bottom:16px;">You requested a password reset. Click the button below to reset your password. This link is valid for 1 hour.</p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2d6cdf;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;margin-bottom:16px;">Reset Password</a>
            <p style="font-size:14px;color:#888;margin-top:24px;">If you did not request this, you can safely ignore this email.</p>
          </div>
          <div style="text-align:center;margin-top:32px;font-size:12px;color:#aaa;">
            &copy; ${new Date().getFullYear()} Spend Log. All rights reserved.
          </div>
        </div>
      `
    });
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset Password
router.post('/reset-password', [
  body('token').isString().notEmpty(),
  body('password').isLength({ min: 6 }),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Email
router.post('/update-email', auth, [
  body('email').isEmail().normalizeEmail(),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { email } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.findById(req.userId);
    user.email = email;
    await user.save();
    res.json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Password
router.post('/update-password', auth, [
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 }),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Avatar upload route
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.avatar = req.file.filename;
    await user.save();
    res.json({ avatar: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resend verification email
router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail(),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No account with that email.' });
    if (user.isVerified) return res.status(400).json({ message: 'Account is already verified.' });
    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();
    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    await transporter.sendMail({
      to: user.email,
      from: process.env.MAIL_FROM || 'no-reply@expensetracker.com',
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
    });
    res.json({ message: 'Verification email resent. Please check your inbox.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete account
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const userId = req.userId;
    // Delete all expenses and incomes for this user
    await require('../models/Expense').deleteMany({ user: userId });
    await require('../models/Income').deleteMany({ user: userId });
    // Delete the user
    await require('../models/User').findByIdAndDelete(userId);
    res.json({ message: 'Account and all data deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: List users
router.get('/admin/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password -refreshTokens');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Admin: Delete user
router.delete('/admin/users/:id', auth, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await require('../models/Expense').deleteMany({ user: req.params.id });
    await require('../models/Income').deleteMany({ user: req.params.id });
    res.json({ message: 'User and data deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Admin: App stats
router.get('/admin/stats', auth, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const verifiedCount = await User.countDocuments({ isVerified: true });
    const expenseCount = await require('../models/Expense').countDocuments();
    const incomeCount = await require('../models/Income').countDocuments();
    res.json({ userCount, verifiedCount, expenseCount, incomeCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 