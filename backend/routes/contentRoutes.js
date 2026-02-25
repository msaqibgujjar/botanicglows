const express = require('express');
const router = express.Router();
const { getContent, updateContent, getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Blog routes (must come before :type to avoid conflict)
router.route('/blog')
    .get(getBlogs)
    .post(authorize('SuperAdmin', 'Admin'), createBlog);

router.route('/blog/:id')
    .get(getBlog)
    .put(authorize('SuperAdmin', 'Admin'), updateBlog)
    .delete(authorize('SuperAdmin', 'Admin'), deleteBlog);

// CMS content routes
router.route('/:type')
    .get(getContent)
    .put(authorize('SuperAdmin', 'Admin'), updateContent);

module.exports = router;
