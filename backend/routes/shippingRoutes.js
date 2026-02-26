const express = require('express');
const router = express.Router();
const ShippingRate = require('../models/ShippingRate');
const pakistanCities = require('../data/pakistanCities');
const { protect } = require('../middleware/auth');

// All admin routes require auth
router.use(protect);

// GET /api/admin/shipping — get all shipping rates
router.get('/', async (req, res) => {
    try {
        const rates = await ShippingRate.find().sort({ province: 1, city: 1 });
        res.json({ success: true, data: rates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/admin/shipping/cities — get province/city list
router.get('/cities', async (req, res) => {
    res.json({ success: true, data: pakistanCities });
});

// PUT /api/admin/shipping/rate — set rate for a city (upsert)
router.put('/rate', async (req, res) => {
    try {
        const { province, city, rate } = req.body;
        if (!province || !city || rate === undefined) {
            return res.status(400).json({ success: false, message: 'Province, city, and rate are required' });
        }
        const shippingRate = await ShippingRate.findOneAndUpdate(
            { province, city },
            { province, city, rate: Number(rate) },
            { upsert: true, new: true, runValidators: true }
        );
        res.json({ success: true, data: shippingRate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/admin/shipping/bulk — set rates for multiple cities at once
router.put('/bulk', async (req, res) => {
    try {
        const { rates } = req.body; // [{ province, city, rate }]
        const ops = rates.map(r => ({
            updateOne: {
                filter: { province: r.province, city: r.city },
                update: { province: r.province, city: r.city, rate: Number(r.rate) },
                upsert: true,
            }
        }));
        await ShippingRate.bulkWrite(ops);
        const all = await ShippingRate.find().sort({ province: 1, city: 1 });
        res.json({ success: true, data: all });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/admin/shipping/:id — delete a rate
router.delete('/:id', async (req, res) => {
    try {
        await ShippingRate.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Rate deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
