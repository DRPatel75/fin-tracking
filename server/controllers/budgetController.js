const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get budgets with spent amount
// @route   GET /api/budget
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
    const budgets = await Budget.find({ user: req.user.id }).lean();

    const monthMap = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };

    const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
        const monthIndex = monthMap[budget.month];
        const startDate = new Date(budget.year, monthIndex, 1);
        const endDate = new Date(budget.year, monthIndex + 1, 0, 23, 59, 59);

        const spentData = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    category: budget.category,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: '$amount' }
                }
            }
        ]);

        return {
            ...budget,
            spent: spentData.length > 0 ? spentData[0].totalSpent : 0
        };
    }));

    res.status(200).json(budgetsWithSpent);
});

// @desc    Set budget
// @route   POST /api/budget
// @access  Private
const setBudget = asyncHandler(async (req, res) => {
    const { category, limit, month, year } = req.body;

    if (!category || !limit || !month || !year) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if budget exists for this category/month/year
    const budgetExists = await Budget.findOne({
        user: req.user.id,
        category,
        month,
        year
    });

    if (budgetExists) {
        // Update existing
        budgetExists.limit = limit;
        const updatedBudget = await budgetExists.save();
        res.status(200).json(updatedBudget);
    } else {
        // Create new
        const budget = await Budget.create({
            user: req.user.id,
            category,
            limit,
            month,
            year
        });
        res.status(200).json(budget);
    }
});

// @desc    Delete budget
// @route   DELETE /api/budget/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
        res.status(404);
        throw new Error('Budget not found');
    }

    if (budget.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await budget.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getBudgets,
    setBudget,
    deleteBudget
};
