// // utils/tokenUtils.js

// const jwt = require('jsonwebtoken');

// // Helper function to generate tokens
// const generateTokens = (userId,roleName) => {
//   const accessToken = jwt.sign({ userId , roleName}, process.env.JWT_SECRET, {
//     expiresIn: '15m', // Access token expiry time
//   });

//   const refreshToken = jwt.sign({ userId,roleName }, process.env.JWT_SECRET_REFRESH, {
//     expiresIn: '7d', // Refresh token expiry time
//   });

//   return { accessToken, refreshToken };
// };

// module.exports = { generateTokens };
const jwt = require('jsonwebtoken');

const generateTokens = (userId, roleName, permissions = [],name,email,signedUserId) => {
  const accessToken = jwt.sign(
    { userId, roleName, permissions ,name,email,signedUserId},
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId ,signedUserId},
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
