const cron = require('node-cron');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const User = require('../models/User');
const AlertLog = require('../models/AlertLog');
const { sendBudgetAlert } = require('./emailService');

const checkBudgets = async () => {
    console.log('Running daily budget check...');
    try {
        const budgets = await Budget.find().populate('user');

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const currentMonth = monthNames[new Date().getMonth()];
        const currentYear = new Date().getFullYear();

        for (const budget of budgets) {
            // Respect user notification preferences
            if (!budget.user.notifications?.budgetAlerts) continue;

            // Only check budgets for current month/year
            if (budget.month !== currentMonth || budget.year !== currentYear) continue;

            // Calculate spent amount
            const monthIndex = new Date().getMonth();
            const startDate = new Date(currentYear, monthIndex, 1);
            const endDate = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59);

            const spentData = await Expense.aggregate([
                {
                    $match: {
                        user: budget.user._id,
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

            const spent = spentData.length > 0 ? spentData[0].totalSpent : 0;
            const percent = (spent / budget.limit) * 100;

            let alertType = null;
            if (percent >= 100) alertType = '100%';
            else if (percent >= 90) alertType = '90%';
            else if (percent >= 70) alertType = '70%';

            if (alertType) {
                // Check if alert already sent for this budget and type in the current month
                const alertExists = await AlertLog.findOne({
                    user: budget.user._id,
                    budget: budget._id,
                    type: alertType,
                    sentAt: { $gte: startDate, $lte: endDate }
                });

                if (!alertExists) {
                    console.log(`Sending ${alertType} alert for ${budget.user.email} - Category: ${budget.category}`);
                    await sendBudgetAlert(budget.user.email, {
                        category: budget.category,
                        limit: budget.limit,
                        spent,
                        percent: Math.round(percent)
                    }, alertType);

                    await AlertLog.create({
                        user: budget.user._id,
                        budget: budget._id,
                        type: alertType
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error in budget check cron:', error);
    }
};

// Run every day at midnight
const initCron = () => {
    cron.schedule('0 0 * * *', checkBudgets);
    console.log('Budget check cron initialized');
};

module.exports = {
    initCron,
    checkBudgets // Exported for manual trigger if needed
};
