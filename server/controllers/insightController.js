const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Get smart expense insights
// @route   GET /api/insights
// @access  Private
const getInsights = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // 1. Month-over-Month Comparison
    const currentMonthExpenses = await Expense.aggregate([
        { $match: { user: req.user._id, date: { $gte: startOfCurrentMonth } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    const lastMonthExpenses = await Expense.aggregate([
        { $match: { user: req.user._id, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    const insights = [];

    currentMonthExpenses.forEach(curr => {
        const last = lastMonthExpenses.find(l => l._id === curr._id);
        if (last) {
            const diff = curr.total - last.total;
            const percentChange = ((diff / last.total) * 100).toFixed(1);
            if (percentChange > 10) {
                insights.push({
                    type: 'warning',
                    category: curr._id,
                    message: `${curr._id} spending increased by ${percentChange}% compared to last month.`
                });
            } else if (percentChange < -10) {
                insights.push({
                    type: 'success',
                    category: curr._id,
                    message: `Great job! ${curr._id} spending decreased by ${Math.abs(percentChange)}% compared to last month.`
                });
            }
        }
    });

    // 2. Budget Projections & Overspending Detection
    const budgets = await Budget.find({ user: userId, month: getMonthName(currentMonth), year: currentYear });

    for (const budget of budgets) {
        const currExp = currentMonthExpenses.find(e => e._id === budget.category);
        const spent = currExp ? currExp.total : 0;
        const percent = (spent / budget.limit) * 100;

        if (percent > 100) {
            insights.push({
                type: 'danger',
                category: budget.category,
                message: `You have exceeded your ${budget.category} budget by $${(spent - budget.limit).toFixed(2)}.`
            });
        } else if (percent > 80) {
            insights.push({
                type: 'warning',
                category: budget.category,
                message: `You have used ${percent.toFixed(1)}% of your ${budget.category} budget.`
            });
        }

        // Projection: If month is X days in, can we predict if they will exceed?
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const currentDay = today.getDate();
        const dailyAvg = spent / currentDay;
        const projectedFinal = dailyAvg * daysInMonth;

        if (projectedFinal > budget.limit && percent < 100) {
            const daysLeft = Math.floor((budget.limit - spent) / dailyAvg);
            insights.push({
                type: 'info',
                category: budget.category,
                message: `Based on your current spending, you may exceed your ${budget.category} budget in ${daysLeft > 0 ? daysLeft : 0} days.`
            });
        }
    }

    // 3. Daily Safe Spend Suggestion
    const totalBudgetLimitResult = budgets.reduce((acc, b) => acc + b.limit, 0);
    const totalSpentResult = currentMonthExpenses.reduce((acc, e) => acc + e.total, 0);
    const remainingBudget = totalBudgetLimitResult - totalSpentResult;
    const daysRemaining = new Date(currentYear, currentMonth + 1, 0).getDate() - today.getDate();

    const safeSpend = daysRemaining > 0 ? (remainingBudget / daysRemaining).toFixed(2) : 0;

    res.status(200).json({
        insights,
        dailySafeSpend: safeSpend > 0 ? safeSpend : 0,
        totalBudgetLimit: totalBudgetLimitResult,
        totalSpent: totalSpentResult,
        remainingBudget: remainingBudget > 0 ? remainingBudget : 0,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0
    });
});

function getMonthName(monthIndex) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthIndex];
}

module.exports = {
    getInsights
};
