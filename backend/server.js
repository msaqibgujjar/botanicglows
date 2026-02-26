const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ─── Security Middleware ─────────────────────────────────
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// ─── Body Parsers ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ─── Rate Limiting ───────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Static Files (uploads) ─────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ─── API Routes ──────────────────────────────────────────
app.use('/api/admin/auth', require('./routes/authRoutes'));
app.use('/api/admin/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin/products', require('./routes/productRoutes'));
app.use('/api/admin/orders', require('./routes/orderRoutes'));
app.use('/api/admin/customers', require('./routes/customerRoutes'));
app.use('/api/admin/content', require('./routes/contentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin/shipping', require('./routes/shippingRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Botanic Glows API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Error Handler ───────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🌿 Botanic Glows API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

module.exports = app;
