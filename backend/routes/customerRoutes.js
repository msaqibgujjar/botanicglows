const express = require('express');
const router = express.Router();
const { getCustomers, getCustomer, toggleBlock, deleteCustomer, getCustomerOrders } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id/block', toggleBlock);
router.delete('/:id', authorize('SuperAdmin', 'Admin'), deleteCustomer);
router.get('/:id/orders', getCustomerOrders);

module.exports = router;
