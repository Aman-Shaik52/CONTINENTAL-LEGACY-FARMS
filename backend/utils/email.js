const nodemailer = require('nodemailer');
const { OTP_EXPIRY_MINUTES } = require('./constants');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOSTNAME_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?$/;

const validateSmtpConfig = () => {
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missing = requiredVars.filter((key) => !process.env[key]?.trim());

  if (missing.length) {
    throw new Error(`Missing SMTP configuration: ${missing.join(', ')}`);
  }

  const host = process.env.SMTP_HOST.trim();

  if (EMAIL_REGEX.test(host)) {
    throw new Error(
      `SMTP_HOST must be a mail server hostname (e.g. smtp.gmail.com), not an email address. Current value: ${host}`
    );
  }

  if (!HOSTNAME_REGEX.test(host)) {
    throw new Error(`SMTP_HOST is not a valid hostname: ${host}`);
  }

  const user = process.env.SMTP_USER.trim();
  if (!EMAIL_REGEX.test(user)) {
    throw new Error('SMTP_USER must be a valid email address');
  }
};

const createTransporter = () => {
  validateSmtpConfig();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST.trim(),
    port: Number(process.env.SMTP_PORT),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER.trim(),
      pass: process.env.SMTP_PASS,
    },
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
    },
  });

  return transporter;
};

const sendOtpEmail = async ({ email, otp }) => {
  const recipient = email?.trim();
  if (!recipient || !EMAIL_REGEX.test(recipient)) {
    throw new Error('A valid recipient email is required');
  }

  let transporter;

  try {
    transporter = createTransporter();
    await transporter.verify();
  } catch (error) {
    const hint =
      error.code === 'ESOCKET' || error.message?.includes('certificate')
        ? ' If on local dev, check antivirus TLS inspection or set SMTP_TLS_REJECT_UNAUTHORIZED=false temporarily.'
        : '';

    console.error('[email] SMTP connection failed:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      code: error.code,
      message: error.message,
    });
    throw new Error(`SMTP connection failed: ${error.message}.${hint}`);
  }

  const from = (process.env.SMTP_FROM || process.env.SMTP_USER).trim();

  try {
    const info = await transporter.sendMail({
      from,
      to: recipient,
      subject: 'Your email verification OTP',
      text: `Your OTP is ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>.</p><p>It will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
    });

    console.info('[email] OTP sent successfully:', {
      to: recipient,
      messageId: info.messageId,
    });

    return info;
  } catch (error) {
    console.error('[email] Failed to send OTP:', {
      to: recipient,
      code: error.code,
      message: error.message,
    });
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

module.exports = { sendOtpEmail, createTransporter, validateSmtpConfig };
