// redisClient.js
const { createClient } = require('redis');

// Initialize Redis client
const redisClient = createClient();

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
