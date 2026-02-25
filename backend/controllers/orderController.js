const Order = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const APIFeatures = require('../utils/apiFeatures');

// GET /api/admin/orders
exports.getOrders = async (req, res, next) => {
    try {
        const total = await Order.countDocuments();
        const features = new APIFeatures(Order.find(), req.query)
            .search(['customerName', 'customerEmail'])
            .filter()
            .sort()
            .paginate();

        const orders = await features.query;

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page: features.page,
            pages: Math.ceil(total / features.limit),
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/orders/:id
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email phone');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/orders/:id
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const { orderStatus, paymentStatus, trackingNumber } = req.body;

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

        // If delivered, mark payment as paid (for COD)
        if (orderStatus === 'Delivered' && order.paymentMethod === 'CashOnDelivery') {
            order.paymentStatus = 'Paid';
        }

        // If cancelled, restore product stock
        if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity },
                });
            }
        }

        await order.save();

        // Update transaction status if exists
        if (paymentStatus) {
            const statusMap = { Paid: 'Completed', Refunded: 'Refunded', Failed: 'Failed', Pending: 'Pending' };
            await Transaction.findOneAndUpdate(
                { order: order._id },
                { status: statusMap[paymentStatus] || 'Pending' }
            );
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/orders/:id/invoice
exports.getInvoice = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email phone');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const invoice = {
            invoiceNumber: `INV-${order._id.toString().slice(-8).toUpperCase()}`,
            date: order.createdAt,
            customer: {
                name: order.customerName,
                email: order.customerEmail,
                phone: order.customerPhone,
                address: order.shippingAddress,
            },
            items: order.items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
            })),
            subtotal: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            total: order.totalAmount,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
        };

        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
};
