const asyncHandler = require('express-async-handler');
const { parseCSV, parsePDF } = require('../utils/parsingService');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const UploadedStatement = require('../models/UploadedStatement');

// @desc    Upload and parse bank statement
// @route   POST /api/upload
// @access  Private
const uploadStatement = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    const { buffer, originalname, mimetype } = req.file;
    const fileType = mimetype === 'text/csv' || originalname.endsWith('.csv') ? 'csv' : 'pdf';

    const uploadedStatement = await UploadedStatement.create({
        user: req.user.id,
        fileName: originalname,
        fileType,
        status: 'pending'
    });

    try {
        let transactions = [];
        if (fileType === 'csv') {
            transactions = await parseCSV(buffer);
        } else {
            transactions = await parsePDF(buffer);
        }

        let count = 0;
        for (const transaction of transactions) {
            if (transaction.type === 'expense') {
                await Expense.create({
                    user: req.user.id,
                    title: transaction.description,
                    amount: transaction.amount,
                    date: transaction.date,
                    category: transaction.category,
                    description: `Parsed from ${originalname}`,
                    source: 'parsed'
                });
            } else {
                await Income.create({
                    user: req.user.id,
                    title: transaction.description,
                    amount: transaction.amount,
                    date: transaction.date,
                    category: transaction.category,
                    description: `Parsed from ${originalname}`,
                    source: 'parsed'
                });
            }
            count++;
        }

        uploadedStatement.status = 'processed';
        uploadedStatement.transactionCount = count;
        await uploadedStatement.save();

        res.status(200).json({
            message: `Successfully processed ${count} transactions`,
            transactionCount: count
        });
    } catch (error) {
        uploadedStatement.status = 'failed';
        await uploadedStatement.save();
        res.status(500);
        throw new Error(`Parsing failed: ${error.message}`);
    }
});

// @desc    Get upload history
// @route   GET /api/upload/history
// @access  Private
const getUploadHistory = asyncHandler(async (req, res) => {
    const history = await UploadedStatement.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(history);
});

module.exports = {
    uploadStatement,
    getUploadHistory
};
