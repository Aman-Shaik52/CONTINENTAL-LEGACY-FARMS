const {
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
} = require('../utils/constants');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const otpExpiryDate = () => new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

const isExpired = (expiresAt) => !expiresAt || new Date(expiresAt).getTime() < Date.now();

const hasCooldown = (lastSentAt) => {
  if (!lastSentAt) {
    return false;
  }

  const diffSeconds = (Date.now() - new Date(lastSentAt).getTime()) / 1000;
  return diffSeconds < OTP_RESEND_COOLDOWN_SECONDS;
};

module.exports = {
  generateOtp,
  otpExpiryDate,
  isExpired,
  hasCooldown,
};
