const mongoose = require('mongoose');

const shippingRateSchema = new mongoose.Schema({
    province: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});

// Unique combination of province + city
shippingRateSchema.index({ province: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('ShippingRate', shippingRateSchema);
