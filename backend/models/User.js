const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'Pakistan' },
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    totalOrders: {
        type: Number,
        default: 0,
    },
    totalSpent: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
