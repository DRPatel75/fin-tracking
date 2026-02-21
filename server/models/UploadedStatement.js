const mongoose = require('mongoose');

const uploadedStatementSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['csv', 'pdf'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'failed'],
        default: 'pending'
    },
    transactionCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const UploadedStatement = mongoose.model('UploadedStatement', uploadedStatementSchema);

module.exports = UploadedStatement;
