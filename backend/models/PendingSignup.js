const mongoose = require('mongoose');

const pendingSignupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailOtp: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    emailOtpExpiresAt: {
      type: Date,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailOtpAttempts: {
      type: Number,
      default: 0,
    },
    emailOtpResendCount: {
      type: Number,
      default: 0,
    },
    emailOtpLastSentAt: {
      type: Date,
      default: Date.now,
    },
    phoneOtp: {
      type: String,
      minlength: 6,
      maxlength: 6,
    },
    phoneOtpExpiresAt: {
      type: Date,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneOtpAttempts: {
      type: Number,
      default: 0,
    },
    phoneOtpResendCount: {
      type: Number,
      default: 0,
    },
    phoneOtpLastSentAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PendingSignup', pendingSignupSchema);
