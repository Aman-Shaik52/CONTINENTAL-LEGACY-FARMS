const jwt = require('jsonwebtoken');

const createAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

module.exports = { createAccessToken };
