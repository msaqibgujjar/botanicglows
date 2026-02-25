const express = require('express');
const router = express.Router();
const { getStats, getSalesAnalytics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getStats);
router.get('/sales', getSalesAnalytics);

module.exports = router;
