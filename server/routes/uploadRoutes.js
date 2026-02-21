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

module.exports = router;
