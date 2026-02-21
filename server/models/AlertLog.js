const mongoose = require('mongoose');

const alertLogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    budget: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Budget'
    },
    type: {
        type: String,
        enum: ['70%', '90%', '100%'],
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const AlertLog = mongoose.model('AlertLog', alertLogSchema);

module.exports = AlertLog;
