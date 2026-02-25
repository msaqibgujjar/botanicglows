const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// GET /api/admin/dashboard/stats
exports.getStats = async (req, res, next) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments();

        // Revenue from paid / delivered orders
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Low stock products (stock < 10)
        const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 }, isActive: true });

        // Recent orders (last 10)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('customerName totalAmount orderStatus paymentStatus createdAt');

        // Order status counts
        const orderStatusCounts = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalProducts,
                totalCustomers,
                totalRevenue,
                lowStockProducts,
                recentOrders,
                orderStatusCounts: orderStatusCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/dashboard/sales?period=weekly|monthly
exports.getSalesAnalytics = async (req, res, next) => {
    try {
        const period = req.query.period || 'weekly';
        const now = new Date();
        let startDate;
        let groupFormat;

        if (period === 'monthly') {
            startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
            groupFormat = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };
        } else {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            groupFormat = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' },
            };
        }

        const salesData = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, orderStatus: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: groupFormat,
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        ]);

        res.status(200).json({
            success: true,
            period,
            data: salesData,
        });
    } catch (error) {
        next(error);
    }
};
