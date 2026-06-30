const User = require('../models/User');
const PendingSignup = require('../models/PendingSignup');
const PasswordReset = require('../models/PasswordReset');

const { sendOtpEmail } = require('../utils/email');
const AppError = require('../utils/AppError');

const {
  generateOtp,
  otpExpiryDate,
  isExpired,
  hasCooldown,
} = require('./otpService');

const { createAccessToken } = require('./tokenService');

const {
  OTP_RESEND_LIMIT,
  OTP_VERIFY_ATTEMPT_LIMIT,
  PENDING_SIGNUP_TTL_MINUTES,
  PASSWORD_RESET_TTL_MINUTES,
} = require('../utils/constants');

const normalizeEmail = (email = '') =>
  email.toLowerCase().trim();

const normalizePhone = (phone = '') =>
  phone.replace(/\s+/g, '').trim();

const isValidPhone = (phone) =>
  /^\+[1-9]\d{7,14}$/.test(phone);



// ==================== SIGNUP ====================

const signup = async ({ name, email, phone, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  if (!isValidPhone(normalizedPhone)) {
    throw new AppError(
      'Invalid phone number format. Example: +14155552671',
      400
    );
  }

  const existingUser = await User.findOne({
    $or: [
      { email: normalizedEmail },
      { phone: normalizedPhone },
    ],
  });

  if (existingUser) {
    throw new AppError(
      'User with this email or phone already exists',
      400
    );
  }

  const emailOtp = generateOtp();

  await PendingSignup.findOneAndUpdate(
    { email: normalizedEmail },
    {
      name,
      email: normalizedEmail,
      phone: normalizedPhone,
      password,

      emailOtp,
      emailOtpExpiresAt: otpExpiryDate(),

      emailVerified: false,
      emailOtpAttempts: 0,
      emailOtpResendCount: 0,
      emailOtpLastSentAt: new Date(),

      phoneOtp: undefined,
      phoneOtpExpiresAt: undefined,
      phoneVerified: false,
      phoneOtpAttempts: 0,
      phoneOtpResendCount: 0,
      phoneOtpLastSentAt: undefined,

      expiresAt: new Date(
        Date.now() +
        PENDING_SIGNUP_TTL_MINUTES * 60 * 1000
      ),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  try {
    await sendOtpEmail({
      email: normalizedEmail,
      otp: emailOtp,
    });
  } catch (error) {
    await PendingSignup.deleteOne({
      email: normalizedEmail,
    });

    throw error;
  }
};



// ==================== VERIFY EMAIL OTP ====================

const verifyEmailOtp = async ({ email, otp }) => {
  const normalizedEmail = normalizeEmail(email);

  const pending = await PendingSignup.findOne({
    email: normalizedEmail,
  });

  if (!pending) {
    throw new AppError(
      'No signup request found or request expired',
      400
    );
  }

  if (
    pending.emailOtpAttempts >=
    OTP_VERIFY_ATTEMPT_LIMIT
  ) {
    throw new AppError(
      'Too many invalid OTP attempts. Start signup again.',
      429
    );
  }

  if (isExpired(pending.emailOtpExpiresAt)) {
    await PendingSignup.deleteOne({
      email: normalizedEmail,
    });

    throw new AppError(
      'Email OTP expired',
      400
    );
  }

  if (pending.emailOtp !== String(otp).trim()) {
    pending.emailOtpAttempts += 1;

    await pending.save();

    throw new AppError(
      'Invalid OTP',
      400
    );
  }

  pending.emailVerified = true;
  pending.emailOtpAttempts = 0;

  pending.expiresAt = new Date(
    Date.now() +
    PENDING_SIGNUP_TTL_MINUTES * 60 * 1000
  );

  await pending.save();
};

// ==================== SEND PHONE OTP ====================

const sendPhoneOtp = async ({ email }) => {
  const normalizedEmail = normalizeEmail(email);

  const pending = await PendingSignup.findOne({
    email: normalizedEmail,
  });

  if (!pending) {
    throw new AppError(
      'No signup request found or request expired',
      400
    );
  }

  if (!pending.emailVerified) {
    throw new AppError(
      'Verify email first before requesting phone OTP',
      400
    );
  }

  if (pending.phoneOtpResendCount >= OTP_RESEND_LIMIT) {
    throw new AppError(
      'Phone OTP resend limit reached. Start signup again.',
      429
    );
  }

  if (hasCooldown(pending.phoneOtpLastSentAt)) {
    throw new AppError(
      'Please wait before requesting another OTP',
      429
    );
  }

  const existingPhone = await User.findOne({
    phone: pending.phone,
  });

  if (existingPhone) {
    await PendingSignup.deleteOne({
      email: normalizedEmail,
    });

    throw new AppError(
      'Phone number already registered',
      400
    );
  }

  const phoneOtp = generateOtp();

  pending.phoneOtp = phoneOtp;
  pending.phoneOtpExpiresAt = otpExpiryDate();
  pending.phoneOtpAttempts = 0;
  pending.phoneOtpResendCount += 1;
  pending.phoneOtpLastSentAt = new Date();

  pending.expiresAt = new Date(
    Date.now() +
      PENDING_SIGNUP_TTL_MINUTES * 60 * 1000
  );

  await pending.save();

  await sendOtpSms({
    phone: pending.phone,
    otp: phoneOtp,
  });
};



// ==================== VERIFY PHONE OTP ====================

const verifyPhoneOtp = async ({ email, otp }) => {
  const normalizedEmail = normalizeEmail(email);

  const pending = await PendingSignup.findOne({
    email: normalizedEmail,
  });

  if (!pending) {
    throw new AppError(
      'No signup request found or request expired',
      400
    );
  }

  if (!pending.emailVerified) {
    throw new AppError(
      'Verify email first before phone verification',
      400
    );
  }

  if (!pending.phoneOtp) {
    throw new AppError(
      'No phone OTP found. Request phone OTP first.',
      400
    );
  }

  if (
    pending.phoneOtpAttempts >=
    OTP_VERIFY_ATTEMPT_LIMIT
  ) {
    throw new AppError(
      'Too many invalid OTP attempts. Start signup again.',
      429
    );
  }

  if (isExpired(pending.phoneOtpExpiresAt)) {
    throw new AppError(
      'Phone OTP expired',
      400
    );
  }

  if (pending.phoneOtp !== String(otp).trim()) {
    pending.phoneOtpAttempts += 1;

    await pending.save();

    throw new AppError(
      'Invalid OTP',
      400
    );
  }

  const duplicate = await User.findOne({
    $or: [
      { email: pending.email },
      { phone: pending.phone },
    ],
  });

  if (duplicate) {
    await PendingSignup.deleteOne({
      email: normalizedEmail,
    });

    throw new AppError(
      'User already exists',
      400
    );
  }

  const user = await User.create({
    name: pending.name,
    email: pending.email,
    phone: pending.phone,
    password: pending.password,
    role: 'user',
  });

  await PendingSignup.deleteOne({
    email: normalizedEmail,
  });

  return {
    token: createAccessToken(user),

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};



// ==================== LOGIN ====================

const login = async ({ email, password }) => {
  const user = await User.findOne({
    email: normalizeEmail(email),
  });

  if (!user) {
    throw new AppError(
      'Invalid credentials',
      400
    );
  }

  const isMatch = await user.comparePassword(
    password
  );

  if (!isMatch) {
    throw new AppError(
      'Invalid credentials',
      400
    );
  }

  return {
    token: createAccessToken(user),

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};



// ==================== LOGOUT ====================

const logout = async () => true;

// ==================== FORGOT PASSWORD ====================

const forgotPassword = async ({ phone }) => {
  const normalizedPhone = normalizePhone(phone);

  if (!isValidPhone(normalizedPhone)) {
    throw new AppError(
      'Invalid phone number format. Example: +14155552671',
      400
    );
  }

  const user = await User.findOne({
    phone: normalizedPhone,
  });

  if (!user) {
    throw new AppError(
      'No account found with this phone number',
      404
    );
  }

  const existingReset = await PasswordReset.findOne({
    phone: normalizedPhone,
  });

  if (existingReset) {
    if (existingReset.resendCount >= OTP_RESEND_LIMIT) {
      throw new AppError(
        'Reset OTP resend limit reached. Try later.',
        429
      );
    }

    if (hasCooldown(existingReset.otpLastSentAt)) {
      throw new AppError(
        'Please wait before requesting another OTP',
        429
      );
    }
  }

  const otp = generateOtp();

  const resetDoc = await PasswordReset.findOneAndUpdate(
    { phone: normalizedPhone },
    {
      otp,
      otpExpiresAt: otpExpiryDate(),
      resendCount: (existingReset?.resendCount || 0) + 1,
      verifyAttempts: 0,
      otpLastSentAt: new Date(),
      verified: false,
      expiresAt: new Date(
        Date.now() +
          PASSWORD_RESET_TTL_MINUTES * 60 * 1000
      ),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  try {
    await sendOtpSms({
      phone: normalizedPhone,
      otp,
    });
  } catch (error) {
    await PasswordReset.deleteOne({
      _id: resetDoc._id,
    });

    throw error;
  }
};



// ==================== VERIFY RESET OTP ====================

const verifyResetOtp = async ({ phone, otp }) => {
  const normalizedPhone = normalizePhone(phone);

  const resetDoc = await PasswordReset.findOne({
    phone: normalizedPhone,
  });

  if (!resetDoc) {
    throw new AppError(
      'No password reset request found or request expired',
      400
    );
  }

  if (
    resetDoc.verifyAttempts >=
    OTP_VERIFY_ATTEMPT_LIMIT
  ) {
    throw new AppError(
      'Too many invalid OTP attempts. Restart password reset.',
      429
    );
  }

  if (isExpired(resetDoc.otpExpiresAt)) {
    await PasswordReset.deleteOne({
      phone: normalizedPhone,
    });

    throw new AppError(
      'Reset OTP expired',
      400
    );
  }

  if (resetDoc.otp !== String(otp).trim()) {
    resetDoc.verifyAttempts += 1;

    await resetDoc.save();

    throw new AppError(
      'Invalid OTP',
      400
    );
  }

  resetDoc.verified = true;
  resetDoc.verifyAttempts = 0;

  resetDoc.expiresAt = new Date(
    Date.now() +
      PASSWORD_RESET_TTL_MINUTES * 60 * 1000
  );

  await resetDoc.save();
};



// ==================== RESET PASSWORD ====================

const resetPassword = async ({
  phone,
  newPassword,
}) => {
  const normalizedPhone = normalizePhone(phone);

  const resetDoc = await PasswordReset.findOne({
    phone: normalizedPhone,
  });

  if (!resetDoc || !resetDoc.verified) {
    throw new AppError(
      'OTP verification required before changing password',
      400
    );
  }

  const user = await User.findOne({
    phone: normalizedPhone,
  });

  if (!user) {
    throw new AppError(
      'No account found with this phone number',
      404
    );
  }

  user.password = newPassword;

  await user.save();

  await PasswordReset.deleteOne({
    phone: normalizedPhone,
  });
};



// ==================== EXPORTS ====================

module.exports = {
  signup,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
  login,
  logout,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};