// sessionStore.js
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redisClient = require('./redisClient'); // Import Redis client

// Initialize RedisStore with the Redis client
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:', // Optional, customize your key prefix
});

// Initialize session middleware
module.exports = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
});
