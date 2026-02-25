const express = require('express');
const router = express.Router();
const { login, register, changePassword, getMe, loginValidation, registerValidation, passwordValidation } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

router.post('/login', loginLimiter, loginValidation, validate, login);
router.post('/register', protect, authorize('SuperAdmin'), registerValidation, validate, register);
router.put('/password', protect, passwordValidation, validate, changePassword);
router.get('/me', protect, getMe);

module.exports = router;
