const Content = require('../models/Content');
const BlogPost = require('../models/BlogPost');
const APIFeatures = require('../utils/apiFeatures');

// ---------- CMS CONTENT (homepage, about, FAQ, banners) ----------

// GET /api/admin/content/:type
exports.getContent = async (req, res, next) => {
    try {
        const { type } = req.params;
        let content = await Content.findOne({ type });

        if (!content) {
            // Return default content
            const defaults = {
                homepage: { heroTitle: 'Welcome to Botanic Glows', heroSubtitle: 'Natural beauty starts here', aboutText: '' },
                about: { title: 'About Botanic Glows', description: '' },
                faq: { items: [] },
                banners: { items: [] },
            };
            content = { type, data: defaults[type] || {} };
        }

        res.status(200).json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/content/:type
exports.updateContent = async (req, res, next) => {
    try {
        const { type } = req.params;

        const content = await Content.findOneAndUpdate(
            { type },
            { type, data: req.body.data, updatedBy: req.admin._id },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

// ---------- BLOG POSTS ----------

// GET /api/admin/content/blog
exports.getBlogs = async (req, res, next) => {
    try {
        const total = await BlogPost.countDocuments();
        const features = new APIFeatures(BlogPost.find(), req.query)
            .search(['title', 'content'])
            .filter()
            .sort()
            .paginate();

        const blogs = await features.query;

        res.status(200).json({
            success: true,
            count: blogs.length,
            total,
            page: features.page,
            pages: Math.ceil(total / features.limit),
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/content/blog/:id
exports.getBlog = async (req, res, next) => {
    try {
        const blog = await BlogPost.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/content/blog
exports.createBlog = async (req, res, next) => {
    try {
        const blog = await BlogPost.create(req.body);
        res.status(201).json({ success: true, data: blog });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/content/blog/:id
exports.updateBlog = async (req, res, next) => {
    try {
        const blog = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/admin/content/blog/:id
exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await BlogPost.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }
        res.status(200).json({ success: true, message: 'Blog post deleted' });
    } catch (error) {
        next(error);
    }
};
