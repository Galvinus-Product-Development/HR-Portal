// // redisClient.js
// const { createClient } = require('redis');

// // Initialize Redis client
// const redisClient = createClient();

// // Handle connection errors
// redisClient.on('error', (err) => {
//   console.error('Redis Client Error:', err);
// });

// // Handle successful connection
// redisClient.on('ready', () => {
//   console.log('Redis Client is successfully connected to the server!');
// });

// // Connect the Redis client
// redisClient.connect()
//   .then(() => {
//     console.log('Redis Client Connection Attempt Successful!');
//   })
//   .catch((err) => {
//     console.error('Redis Client Connection Failed:', err);
//   });

// module.exports = redisClient;



const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',  // Use ENV variable or default to localhost
    port: process.env.REDIS_PORT || 6379,        // Use ENV variable or default to 6379
  }
});

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Handle successful connection
redisClient.on('ready', () => {
  console.log('Redis Client is successfully connected to the server!');
});

// Connect the Redis client
redisClient.connect()
  .then(() => {
    console.log('Redis Client Connection Attempt Successful!');
  })
  .catch((err) => {
    console.error('Redis Client Connection Failed:', err);
  });

module.exports = redisClient;
