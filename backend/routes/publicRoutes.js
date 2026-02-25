const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// @route   GET /api/public/products
// @desc    Get all active products (public - no auth)
router.get('/products', async (req, res) => {
    try {
        const { category, bestsellers, newarrivals, limit } = req.query;
        let query = { isActive: { $ne: false } };

        if (category) {
            const cat = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
            if (cat) query.category = cat._id;
        }
        if (bestsellers === 'true') query.isBestSeller = true;
        if (newarrivals === 'true') query.isNewArrival = true;

        let q = Product.find(query).populate('category', 'name').sort('-createdAt');
        if (limit) q = q.limit(parseInt(limit));

        const products = await q;
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/public/products/:id
// @desc    Get single product by ID (public)
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/public/categories
// @desc    Get all categories (public)
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: { $ne: false } }).sort('name');
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
