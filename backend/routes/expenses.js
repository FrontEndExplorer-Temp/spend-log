const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all expenses for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new expense
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
  const expense = new Expense({ title, amount, category, date, user: req.userId });
  try {
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an expense
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
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
