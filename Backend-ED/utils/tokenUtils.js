// utils/tokenUtils.js

const jwt = require('jsonwebtoken');

// Helper function to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token expiry time
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: '7d', // Refresh token expiry time
  });

  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
