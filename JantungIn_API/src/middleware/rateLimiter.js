const rateLimit = require('express-rate-limit');

// Rate limiting middleware to prevent brute force attacks
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes by default
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again later',
  };

  return rateLimit({
    ...defaultOptions,
    ...options,
  });
};

// Specific limiters for different endpoints
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later',
});

module.exports = {
  createRateLimiter,
  authLimiter,
};
