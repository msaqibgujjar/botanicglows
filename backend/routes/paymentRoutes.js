const express = require('express');
const router = express.Router();
const { createPaymentIntent, verifyPayment, handleWebhook, createCODOrder, getTransactions } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Webhook must use raw body (before JSON parsing)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Public payment routes
router.post('/create-intent', createPaymentIntent);
router.post('/verify', verifyPayment);
router.post('/cod', createCODOrder);

// Admin-only transaction history
router.get('/transactions', protect, getTransactions);

module.exports = router;
