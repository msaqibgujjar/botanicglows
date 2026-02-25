const { body } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const APIFeatures = require('../utils/apiFeatures');

// Validation rules
exports.productValidation = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

// GET /api/admin/products
exports.getProducts = async (req, res, next) => {
    try {
        const total = await Product.countDocuments();
        const features = new APIFeatures(Product.find().populate('category', 'name'), req.query)
            .search(['name', 'description'])
            .filter()
            .sort()
            .paginate();

        const products = await features.query;

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: features.page,
            pages: Math.ceil(total / features.limit),
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/products/:id
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/products
exports.createProduct = async (req, res, next) => {
    try {
        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map((file) => `/uploads/${file.filename}`);
        }

        const product = await Product.create(req.body);
        const populated = await Product.findById(product._id).populate('category', 'name');

        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Handle uploaded images (append to existing)
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => `/uploads/${file.filename}`);
            req.body.images = [...(product.images || []), ...newImages];
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('category', 'name');

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
};

// ---------- CATEGORY MANAGEMENT ----------

// GET /api/admin/categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort('name');
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/categories
exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/categories/:id
exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/admin/categories/:id
exports.deleteCategory = async (req, res, next) => {
    try {
        // Check if products use this category
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete: ${productCount} products use this category`,
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        next(error);
    }
};
