const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },
    resendCount: {
      type: Number,
      default: 0,
    },
    verifyAttempts: {
      type: Number,
      default: 0,
    },
    otpLastSentAt: {
      type: Date,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
