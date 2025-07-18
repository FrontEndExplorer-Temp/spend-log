const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all income for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const income = await Income.find({ user: req.userId }).sort({ date: -1 });
    res.json(income);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new income
router.post('/', auth, [
  body('title').isString().trim().notEmpty(),
  body('amount').isNumeric(),
  body('category').isString().trim().notEmpty(),
  body('date').isISO8601(),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { title, amount, category, date } = req.body;
  const income = new Income({ title, amount, category, date, user: req.userId });
  try {
    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update income
router.put('/:id', auth, [
  body('title').optional().isString().trim().notEmpty(),
  body('amount').optional().isNumeric(),
  body('category').optional().isString().trim().notEmpty(),
  body('date').optional().isISO8601(),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  try {
    const updatedIncome = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    res.json(updatedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete income
router.delete('/:id', auth, async (req, res) => {
  try {
    await Income.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: 'Income deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 