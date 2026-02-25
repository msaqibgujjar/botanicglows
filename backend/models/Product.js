const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    images: [{
        type: String,
    }],
    ingredients: {
        type: String,
        default: '',
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isNewArrival: {
        type: Boolean,
        default: false,
    },
    isBestSeller: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function () {
    if (this.discount > 0) {
        return +(this.price * (1 - this.discount / 100)).toFixed(2);
    }
    return this.price;
});

productSchema.set('toJSON', { virtuals: true });

// Index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
