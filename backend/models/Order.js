const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: String,
    image: String,
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
    },
    customerEmail: {
        type: String,
        required: [true, 'Customer email is required'],
    },
    customerPhone: {
        type: String,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: 0,
    },
    paymentMethod: {
        type: String,
        enum: ['CreditCard', 'JazzCash', 'EasyPaisa', 'CashOnDelivery'],
        required: [true, 'Payment method is required'],
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending',
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: String,
        zipCode: String,
        country: { type: String, default: 'Pakistan' },
    },
    trackingNumber: {
        type: String,
        default: '',
    },
    stripePaymentIntentId: {
        type: String,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

// Index for searching orders
orderSchema.index({ customerName: 'text', customerEmail: 'text' });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
