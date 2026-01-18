const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Get financial summary
// @route   GET /api/summary
// @access  Private
const getSummary = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
        dateFilter.date = {};
        if (startDate) dateFilter.date.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateFilter.date.$lte = end;
        }
    }

    const matchStage = { user: req.user._id, ...dateFilter };

    // Total Income
    const totalIncomeResult = await Income.aggregate([
        { $match: matchStage },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;

    // Total Expense
    const totalExpenseResult = await Expense.aggregate([
        { $match: matchStage },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpense = totalExpenseResult.length > 0 ? totalExpenseResult[0].total : 0;

    // Balance
    const balance = totalIncome - totalExpense;

    // Expense by Category
    const expenseByCategory = await Expense.aggregate([
        { $match: matchStage },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    // All Transactions for CSV (Income + Expense sorted by date)
    const allIncomes = await Income.find(matchStage).sort({ date: -1 }).lean();
    const allExpenses = await Expense.find(matchStage).sort({ date: -1 }).lean();

    // Add type to distinguish and sort all
    const allTransactions = [
        ...allIncomes.map(i => ({ ...i, type: 'income' })),
        ...allExpenses.map(e => ({ ...e, type: 'expense' }))
    ].sort((a, b) => b.date - a.date);

    // Recent Transactions (Subset of allTransactions)
    const recentTransactions = allTransactions.slice(0, 5);

    res.status(200).json({
        totalIncome,
        totalExpense,
        balance,
        expenseByCategory,
        recentTransactions,
        allTransactions // New field for detailed CSV export
    });
});

module.exports = {
    getSummary
};
