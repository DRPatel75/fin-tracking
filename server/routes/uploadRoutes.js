const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadStatement, getUploadHistory } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { checkBudgets } = require('../utils/cronService');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.mimetype === 'application/pdf' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and PDF files are allowed'), false);
        }
    }
});

router.post('/', protect, upload.single('file'), uploadStatement);
router.get('/history', protect, getUploadHistory);

// Manual trigger for testing alerts
router.post('/test-alerts', protect, async (req, res) => {
    await checkBudgets();
    res.status(200).json({ message: 'Budget check triggered' });
});

// Direct test email
router.post('/send-test-email', protect, async (req, res) => {
    try {
        const { sendEmail } = require('../utils/emailService');
        await sendEmail({
            email: req.user.email,
            subject: 'FinTracker AI - Test Email',
            html: '<h3>Test Successful!</h3><p>Your SMTP configuration is working correctly.</p>'
        });
        res.status(200).json({ message: 'Test email sent' });
    } catch (err) {
        console.error('Test email failed:', err);
        res.status(500).json({ message: 'Failed to send test email', error: err.message });
    }
});

module.exports = router;
