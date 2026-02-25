const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin || !admin.isActive) {
            return res.status(401).json({ success: false, message: 'Not authorized, admin not found or inactive' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
};

// Role-based access control
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.admin.role}' is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
