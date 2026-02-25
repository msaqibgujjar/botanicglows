const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const Admin = require('../models/Admin');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// Validation rules
exports.loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

exports.registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['SuperAdmin', 'Admin', 'Staff']).withMessage('Invalid role'),
];

exports.passwordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// POST /api/admin/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (!admin.isActive) {
            return res.status(401).json({ success: false, message: 'Account is deactivated' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save({ validateBeforeSave: false });

        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/auth/register (SuperAdmin only)
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const admin = await Admin.create({ name, email, password, role: role || 'Admin' });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/auth/password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.admin._id).select('+password');
        const isMatch = await admin.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        admin.password = newPassword;
        await admin.save();

        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            token,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/auth/me
exports.getMe = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.admin._id);
        res.status(200).json({
            success: true,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                lastLogin: admin.lastLogin,
            },
        });
    } catch (error) {
        next(error);
    }
};
