const express = require('express');
const router = express.Router();
const { getOrders, getOrder, updateOrder, getInvoice } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);
router.get('/:id/invoice', getInvoice);

module.exports = router;
