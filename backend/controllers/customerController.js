const User = require('../models/User');
const Order = require('../models/Order');
const APIFeatures = require('../utils/apiFeatures');

// GET /api/admin/customers
exports.getCustomers = async (req, res, next) => {
    try {
        const total = await User.countDocuments();
        const features = new APIFeatures(User.find(), req.query)
            .search(['name', 'email'])
            .filter()
            .sort()
            .paginate();

        const customers = await features.query;

        res.status(200).json({
            success: true,
            count: customers.length,
            total,
            page: features.page,
            pages: Math.ceil(total / features.limit),
            data: customers,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/customers/:id
exports.getCustomer = async (req, res, next) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/customers/:id/block
exports.toggleBlock = async (req, res, next) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        customer.isBlocked = !customer.isBlocked;
        await customer.save();

        res.status(200).json({
            success: true,
            message: customer.isBlocked ? 'Customer blocked' : 'Customer unblocked',
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/admin/customers/:id
exports.deleteCustomer = async (req, res, next) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Customer deleted' });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/customers/:id/orders
exports.getCustomerOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.params.id })
            .sort({ createdAt: -1 })
            .select('totalAmount orderStatus paymentStatus createdAt');

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};
