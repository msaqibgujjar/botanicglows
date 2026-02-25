const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

// Initialize Stripe only if key is set
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here') {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// POST /api/payments/create-intent
exports.createPaymentIntent = async (req, res, next) => {
    try {
        if (!stripe) {
            return res.status(503).json({
                success: false,
                message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in .env',
            });
        }

        const { amount, currency = 'usd', orderId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Valid amount is required' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe uses cents
            currency,
            metadata: { orderId: orderId || '' },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/payments/verify
exports.verifyPayment = async (req, res, next) => {
    try {
        if (!stripe) {
            return res.status(503).json({ success: false, message: 'Stripe is not configured' });
        }

        const { paymentIntentId, orderId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update order payment status
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    paymentStatus: 'Paid',
                    stripePaymentIntentId: paymentIntentId,
                });

                // Create transaction record
                const order = await Order.findById(orderId);
                if (order) {
                    await Transaction.create({
                        order: orderId,
                        amount: order.totalAmount,
                        paymentMethod: 'CreditCard',
                        status: 'Completed',
                        stripePaymentIntentId: paymentIntentId,
                    });
                }
            }

            res.status(200).json({ success: true, message: 'Payment verified', status: paymentIntent.status });
        } else {
            res.status(400).json({ success: false, message: 'Payment not completed', status: paymentIntent.status });
        }
    } catch (error) {
        next(error);
    }
};

// POST /api/payments/webhook
exports.handleWebhook = async (req, res, next) => {
    try {
        if (!stripe) {
            return res.status(503).json({ success: false, message: 'Stripe is not configured' });
        }

        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            return res.status(400).json({ success: false, message: `Webhook error: ${err.message}` });
        }

        // Handle specific events
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const orderId = paymentIntent.metadata.orderId;
                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Paid' });
                    await Transaction.findOneAndUpdate(
                        { stripePaymentIntentId: paymentIntent.id },
                        { status: 'Completed' }
                    );
                }
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const orderId = paymentIntent.metadata.orderId;
                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Failed' });
                    await Transaction.findOneAndUpdate(
                        { stripePaymentIntentId: paymentIntent.id },
                        { status: 'Failed' }
                    );
                }
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        next(error);
    }
};

// POST /api/payments/cod
exports.createCODOrder = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.paymentMethod = 'CashOnDelivery';
        order.paymentStatus = 'Pending';
        await order.save();

        // Create transaction record
        await Transaction.create({
            order: orderId,
            amount: order.totalAmount,
            paymentMethod: 'CashOnDelivery',
            status: 'Pending',
        });

        res.status(200).json({ success: true, message: 'COD order confirmed', data: order });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/payments/transactions
exports.getTransactions = async (req, res, next) => {
    try {
        const total = await Transaction.countDocuments();
        const features = new APIFeatures(Transaction.find().populate('order', 'customerName customerEmail totalAmount'), req.query)
            .filter()
            .sort()
            .paginate();

        const transactions = await features.query;

        // Revenue summary
        const summary = await Transaction.aggregate([
            {
                $group: {
                    _id: '$status',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            count: transactions.length,
            total,
            summary: summary.reduce((acc, item) => {
                acc[item._id] = { total: item.total, count: item.count };
                return acc;
            }, {}),
            data: transactions,
        });
    } catch (error) {
        next(error);
    }
};
