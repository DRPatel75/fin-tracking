const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: String,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    month: {
        type: String, // e.g., "January" or number 1
        required: true
    },
    year: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
