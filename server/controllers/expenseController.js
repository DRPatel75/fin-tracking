const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');

// @desc    Get expenses
// @route   GET /api/expense
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
});

// @desc    Add expense
// @route   POST /api/expense
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    if (!title || !amount || !category) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const expense = await Expense.create({
        user: req.user.id,
        title,
        amount,
        category,
        description,
        date
    });

    res.status(200).json(expense);
});

// @desc    Delete expense
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the expense user
    if (expense.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await expense.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getExpenses,
    addExpense,
    deleteExpense
};
