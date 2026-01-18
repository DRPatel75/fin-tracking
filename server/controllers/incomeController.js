const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');

// @desc    Get incomes
// @route   GET /api/income
// @access  Private
const getIncomes = asyncHandler(async (req, res) => {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(incomes);
});

// @desc    Add income
// @route   POST /api/income
// @access  Private
const addIncome = asyncHandler(async (req, res) => {
    const { source, amount, category, description, date } = req.body;

    if (!source || !amount || !category) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const income = await Income.create({
        user: req.user.id,
        source,
        amount,
        category,
        description,
        date
    });

    res.status(200).json(income);
});

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = asyncHandler(async (req, res) => {
    const income = await Income.findById(req.params.id);

    if (!income) {
        res.status(404);
        throw new Error('Income not found');
    }

    if (income.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await income.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getIncomes,
    addIncome,
    deleteIncome
};
