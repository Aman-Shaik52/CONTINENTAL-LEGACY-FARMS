const authService = require('../services/authService');

console.log('===== AUTH SERVICE =====');
console.log(authService);
console.log('========================');

const signup = async (req, res) => {
  await authService.signup(req.body);
  return res.status(200).json({
    success: true,
    message: 'Email OTP sent. Verify email to continue.',
  });
};

const verifyEmailOtp = async (req, res) => {
  await authService.verifyEmailOtp(req.body);
  return res.status(200).json({
    success: true,
    message: 'Email verified successfully. Send phone OTP to continue.',
  });
};

const sendPhoneOtp = async (req, res) => {
  await authService.sendPhoneOtp(req.body);
  return res.status(200).json({
    success: true,
    message: 'Phone OTP sent successfully',
  });
};

const verifyPhoneOtp = async (req, res) => {
  const data = await authService.verifyPhoneOtp(req.body);
  return res.status(201).json({
    success: true,
    message: 'Phone verified and account created successfully',
    ...data,
  });
};

const login = async (req, res) => {
  const data = await authService.login(req.body);
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    ...data,
  });
};

const logout = async (req, res) => {
  await authService.logout();
  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body);
  return res.status(200).json({
    success: true,
    message: 'Reset OTP sent to phone',
  });
};

const verifyResetOtp = async (req, res) => {
  await authService.verifyResetOtp(req.body);
  return res.status(200).json({
    success: true,
    message: 'Reset OTP verified. You can now reset password.',
  });
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.body);
  return res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
};

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
