const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { authRateLimiter } = require('../middlewares/rateLimitMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authRateLimiter);

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validateRequest,
  asyncHandler(authController.signup)
);

router.post(
  '/verify-email-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp')
      .trim()
      .matches(/^\d{6}$/)
      .withMessage('OTP must be a 6-digit number'),
  ],
  validateRequest,
  asyncHandler(authController.verifyEmailOtp)
);

router.post(
  '/send-phone-otp',
  [body('email').isEmail().withMessage('Valid email is required')],
  validateRequest,
  asyncHandler(authController.sendPhoneOtp)
);

router.post(
  '/verify-phone-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp')
      .trim()
      .matches(/^\d{6}$/)
      .withMessage('OTP must be a 6-digit number'),
  ],
  validateRequest,
  asyncHandler(authController.verifyPhoneOtp)
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  asyncHandler(authController.login)
);

router.post('/logout', asyncHandler(authController.logout));

router.post(
  '/forgot-password',
  [body('phone').trim().notEmpty().withMessage('Phone is required')],
  validateRequest,
  asyncHandler(authController.forgotPassword)
);

router.post(
  '/verify-reset-otp',
  [
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('otp')
      .trim()
      .matches(/^\d{6}$/)
      .withMessage('OTP must be a 6-digit number'),
  ],
  validateRequest,
  asyncHandler(authController.verifyResetOtp)
);

router.post(
  '/reset-password',
  [
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('newPassword must be at least 8 characters long'),
  ],
  validateRequest,
  asyncHandler(authController.resetPassword)
);

module.exports = router;
