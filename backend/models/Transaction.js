const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['CreditCard', 'JazzCash', 'EasyPaisa', 'CashOnDelivery'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
    },
    stripePaymentIntentId: {
        type: String,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
}, {
    timestamps: true,
});

transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
