const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);

        if (error.message.includes('ECONNREFUSED')) {
            console.error('\n' + '='.repeat(50));
            console.error('DATABASE CONNECTION ERROR:');
            console.error('It looks like your local MongoDB service is not running.');
            console.error('To fix this, either:');
            console.error('1. Start your local MongoDB service.');
            console.error('2. Update MONGO_URI in .env with a MongoDB Atlas connection string.');
            console.error('='.repeat(50) + '\n');
        }

        process.exit(1);
    }
};

module.exports = connectDB;
