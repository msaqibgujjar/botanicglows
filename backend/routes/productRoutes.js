const express = require('express');
const router = express.Router();
const {
    getProducts, getProduct, createProduct, updateProduct, deleteProduct,
    getCategories, createCategory, updateCategory, deleteCategory,
    productValidation,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../utils/multerConfig');

router.use(protect);

// Products
router.route('/')
    .get(getProducts)
    .post(upload.array('images', 5), productValidation, validate, createProduct);

router.route('/:id')
    .get(getProduct)
    .put(upload.array('images', 5), updateProduct)
    .delete(authorize('SuperAdmin', 'Admin'), deleteProduct);

// Categories
router.route('/categories/all')
    .get(getCategories)
    .post(authorize('SuperAdmin', 'Admin'), createCategory);

router.route('/categories/:id')
    .put(authorize('SuperAdmin', 'Admin'), updateCategory)
    .delete(authorize('SuperAdmin'), deleteCategory);

module.exports = router;
