const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const redisClient = require('../config/redisClient'); // Adjust path to your Redis client
dotenv.config();

const verifyTokens = async (req, res, next) => {
  const accessToken = req.headers['authorization']?.split(' ')[1];
  const refreshToken = req.headers['x-refresh-token'];

  if (!accessToken && !refreshToken) {
    console.log("No tokens provided.");
    return next(); // No tokens, proceed to login/register
  }

  try {
    // Check if the access token is blacklisted
    if (accessToken) {
      const isBlacklisted = await redisClient.get(accessToken);
      if (isBlacklisted) {
        console.log("Access token is blacklisted.");
        return next();
      }
    }

    // Verify Access Token
    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (!err) {
        console.log("User is already logged in.");
        console.log(decodedToken.roleName);
        console.log(decodedToken);

        const roleName=decodedToken.roleName ;
        
        console.log("Sending response:", { accessToken, refreshToken, roleName });
        return res.status(200).json({ 
          accessToken, 
          refreshToken, 
          roleName // Extract role from token
        });
      }

      if (err.name === 'TokenExpiredError' && refreshToken) {
        // Access token expired, verify refresh token
        const isRefreshTokenBlacklisted = await redisClient.get(refreshToken);
        if (isRefreshTokenBlacklisted) {
          console.log("Refresh token is blacklisted.");
          return next();
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decodedRefreshToken) => {
          if (err) {
            console.log("Refresh token is invalid or expired.");
            return next();
          }

          // Issue new access token with the same role
          const newAccessToken = jwt.sign(
            { userId: decodedRefreshToken.userId, roleName: decodedRefreshToken.roleName },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
          );

          res.setHeader('authorization', `Bearer ${newAccessToken}`);
          return res.status(200).json({ 
            message: 'New access token issued.', 
            accessToken: newAccessToken,
            refreshToken: refreshToken,
            roleName: decodedRefreshToken.roleName // Use role from token
          });
        });
      } else {
        console.log("No valid tokens. Proceeding to login/register.");
        return next();
      }
    });
  } catch (err) {
    console.error('Error in token verification:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = verifyTokens;
