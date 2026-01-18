const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

const startServer = async () => {
    try {
        await connectDB();

        // Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());

        // CORS configuration
        const corsOptions = {
            origin: process.env.NODE_ENV === 'production'
                ? [process.env.FRONTEND_URL]
                : ['http://localhost:5173'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        };
        app.use(cors(corsOptions));

        // Routes
        app.use('/api/users', require('./routes/userRoutes'));
        app.use('/api/income', require('./routes/incomeRoutes'));
        app.use('/api/expense', require('./routes/expenseRoutes'));
        app.use('/api/categories', require('./routes/categoryRoutes'));
        app.use('/api/budget', require('./routes/budgetRoutes'));
        app.use('/api/summary', require('./routes/summaryRoutes'));

        app.get('/', (req, res) => {
            res.send('API is running...');
        });

        // Error Handling
        app.use(notFound);
        app.use(errorHandler);

        app.listen(port, () => console.log(`Server started on port ${port}`));
    } catch (error) {
        console.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

