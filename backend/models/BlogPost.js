const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
        type: String,
        required: [true, 'Blog content is required'],
    },
    image: {
        type: String,
        default: '',
    },
    author: {
        type: String,
        default: 'Botanic Glows',
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft',
    },
    tags: [{
        type: String,
    }],
}, {
    timestamps: true,
});

blogPostSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);
