// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const redisClient = require('../config/redisClient'); // Adjust path to your Redis client
// dotenv.config();

// const verifyTokens = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
//   const refreshToken = req.headers['x-refresh-token'];

//   if (!accessToken && !refreshToken) {
//     console.log("No tokens provided.");
//     return next(); // No tokens, proceed to login/register
//   }

//   try {
//     // Check if access token is blacklisted
//     if (accessToken) {
//       const isBlacklisted = await redisClient.get(accessToken);
//       if (isBlacklisted) {
//         console.log("Access token is blacklisted.");
//         return next(); // Stop execution
//       }
//     }

//     // Verify Access Token
//     try {
//       const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
//       console.log("User is already logged in:", decodedToken);

//       return res.status(200).json({
//         accessToken,
//         refreshToken,
//         roleName: decodedToken.roleName, // Extract role from token
//       });
//     } catch (err) {
//       if (err.name === 'TokenExpiredError' && refreshToken) {
//         // Access token expired, verify refresh token
//         const isRefreshTokenBlacklisted = await redisClient.get(refreshToken);
//         if (isRefreshTokenBlacklisted) {
//           console.log("Refresh token is blacklisted.");
//           return next(); // Stop execution
//         }

//         try {
          
//           const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

//           // Fetch user role and permissions from the database
//           const user = await prisma.user.findUnique({
//             where: { id: decoded.userId },
//             include: {
//               role: {
//                 include: {
//                   rolePermissions: {
//                     include: { permission: true },
//                   },
//                 },
//               },
//             },
//           });
      
//           if (!user) throw new Error("User not found");
      
//           const roleName = user.role?.name || 'EMPLOYEE';
//           const permissions = user.role?.rolePermissions.map((rp) => rp.permission.name) || [];
      
//           // Generate new access token
//           const newAccessToken = jwt.sign(
//             { userId: user.id, roleName, permissions },
//             process.env.JWT_SECRET,
//             { expiresIn: '1m' }
//           );

//           res.setHeader('authorization', `Bearer ${newAccessToken}`);
//           return res.status(200).json({
//             message: 'New access token issued.',
//             accessToken: newAccessToken,
//             refreshToken,
//             roleName: decodedRefreshToken.roleName, // Use role from token
//           });
//         } catch (refreshErr) {
//           console.log("Refresh token is invalid or expired.");
//           return next(); // Stop execution
//         }
//       } else {
//         console.log("Invalid tokens. Proceeding to login/register.");
//         return next(); // Stop execution
//       }
//     }
//   } catch (err) {
//     console.error('Error in token verification:', err);
//     return res.status(500).json({ message: 'Internal server error.' });
//   }
// };

// module.exports = verifyTokens;


const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const redisClient = require('../config/redisClient'); // Adjust path to your Redis client
const prisma = require('../models/prisma/prismaClient');
dotenv.config();

const verifyTokens = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const refreshToken = req.headers['x-refresh-token'];

  if (!accessToken && !refreshToken) {
    console.log("No tokens provided.");
    return next(); // No tokens, proceed to login/register
  }

  try {
    // Check if access token is blacklisted
    if (accessToken) {
      const isBlacklisted = await redisClient.get(accessToken);
      if (isBlacklisted) {
        console.log("Access token is blacklisted.");
        return next(); // Stop execution
      }
    }

    // Verify Access Token
    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      console.log("User is already logged in:", decodedToken);

      return res.status(200).json({
        accessToken,
        refreshToken,
        roleName: decodedToken.roleName, // Extract role from token
        permissions: decodedToken.permissions, // Include permissions
        signedUserId:decodedToken.signedUserId,
        name:decodedToken.name,
        email:decodedToken.email
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        // Access token expired, verify refresh token
        const isRefreshTokenBlacklisted = await redisClient.get(refreshToken);
        if (isRefreshTokenBlacklisted) {
          console.log("Refresh token is blacklisted.");
          return res.status(401).json({ message: "Refresh token is blacklisted." });
        }

        try {
          const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

          // Fetch user role and permissions from the database
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          });

          if (!user) {
            console.log("User not found.");
            return res.status(404).json({ message: "User not found." });
          }

          const roleName = user.role?.name || 'EMPLOYEE';
          const permissions = user.role?.rolePermissions.map((rp) => rp.permission.name) || [];

          // Generate new access token
          const newAccessToken = jwt.sign(
            { userId: user.id, roleName, permissions ,name:user.name,email:user.email},
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Set to 15 minutes
          );

          res.setHeader('authorization', `Bearer ${newAccessToken}`);
          return res.status(200).json({
            message: 'New access token issued.',
            accessToken: newAccessToken,
            refreshToken: refreshToken, // Keep the same refresh token
            roleName,
            permissions,
            signedUserId:decoded.signedUserId,
            name:user.name,
            email:user.email
          });
        } catch (refreshErr) {
          console.log("Refresh token is invalid or expired.");
          return res.status(401).json({ message: "Invalid or expired refresh token." });
        }
      } else {
        console.log("Invalid tokens. Proceeding to login/register.");
        return res.status(401).json({ message: "Invalid or expired access token." });
      }
    }
  } catch (err) {
    console.error('Error in token verification:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = verifyTokens;
