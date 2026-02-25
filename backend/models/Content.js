const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        enum: ['homepage', 'about', 'faq', 'banners'],
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Content', contentSchema);
