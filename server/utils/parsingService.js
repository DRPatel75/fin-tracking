const csv = require('csv-parser');
const pdf = require('pdf-parse');
const fs = require('fs');
const { Readable } = require('stream');

const CATEGORY_KEYWORDS = {
    'Food': ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'bakery', 'kfc', 'mcdonalds', 'starbucks'],
    'Transport': ['uber', 'ola', 'rapido', 'metro', 'fuel', 'petrol', 'diesel', 'irctc', 'bus', 'train'],
    'Shopping': ['amazon', 'flipkart', 'myntra', 'nykaa', 'retail', 'mall', 'fashion', 'grocery', 'blinkit', 'zepto'],
    'Utilities': ['recharge', 'electricity', 'water', 'gas', 'bill', 'wifi', 'internet', 'broadband', 'jio', 'airtel'],
    'Entertainment': ['netflix', 'prime', 'hotstar', 'cinema', 'theatre', 'movie', 'game', 'spotify'],
    'Health': ['pharmacy', 'hospital', 'doctor', 'clinic', 'medical', 'medicine', 'gym', 'fitness']
};

/**
 * Detect category based on transaction description
 * @param {string} description 
 * @returns {string}
 */
const detectCategory = (description) => {
    const desc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => desc.includes(keyword))) {
            return category;
        }
    }
    return 'Other';
};

/**
 * Parse CSV Bank Statement
 * @param {Buffer} buffer 
 * @returns {Promise<Array>}
 */
const parseCSV = (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = Readable.from(buffer);

        stream
            .pipe(csv())
            .on('data', (data) => {
                // Expected columns: Date, Amount, Description, Type
                // We'll normalize these
                const normalized = {
                    date: new Date(data.Date || data.date || Date.now()),
                    amount: parseFloat(data.Amount || data.amount || 0),
                    description: data.Description || data.description || 'No description',
                    type: (data.Type || data.type || 'expense').toLowerCase(),
                    category: detectCategory(data.Description || data.description || ''),
                    source: 'parsed'
                };
                results.push(normalized);
            })
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
};

/**
 * Parse PDF Bank Statement (Basic extraction)
 * @param {Buffer} buffer 
 * @returns {Promise<Array>}
 */
const parsePDF = async (buffer) => {
    const data = await pdf(buffer);
    const lines = data.text.split('\n');
    const transactions = [];

    // Simple regex pattern for common transaction formats: Date Amount Description
    // This is a naive implementation and might need adjustment based on specific PDF formats
    const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
    const amountRegex = /(-?\d+\.?\d*)/;

    lines.forEach(line => {
        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
            const date = new Date(dateMatch[0]);
            // Search for amount after date
            const remainingLine = line.replace(dateMatch[0], '');
            const amountMatch = remainingLine.match(amountRegex);

            if (amountMatch) {
                const amount = Math.abs(parseFloat(amountMatch[0]));
                const description = remainingLine.replace(amountMatch[0], '').trim() || 'Parsed Transaction';
                const type = parseFloat(amountMatch[0]) < 0 ? 'expense' : 'income'; // Just a guess if amount is negative

                transactions.push({
                    date,
                    amount,
                    description,
                    type,
                    category: detectCategory(description),
                    source: 'parsed'
                });
            }
        }
    });

    return transactions;
};

module.exports = {
    parseCSV,
    parsePDF,
    detectCategory
};
