const Boom = require('@hapi/boom');

// Simple in-memory store for rate limiting
const ipRequestStore = new Map();

// Helper to clear expired entries (call periodically)
const clearExpiredEntries = () => {
  const now = Date.now();
  for (const [ip, data] of ipRequestStore.entries()) {
    if (data.resetTime < now) {
      ipRequestStore.delete(ip);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(clearExpiredEntries, 5 * 60 * 1000);

// Rate limiting middleware for Hapi.js
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes by default
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
  };

  const settings = {
    ...defaultOptions,
    ...options,
  };

  return (request, h) => {
    const ip = request.info.remoteAddress;
    const now = Date.now();

    // Initialize or get existing data for this IP
    if (!ipRequestStore.has(ip)) {
      ipRequestStore.set(ip, {
        count: 1,
        resetTime: now + settings.windowMs,
      });
      return h.continue;
    }

    const data = ipRequestStore.get(ip);

    // Check if the window has expired and reset if needed
    if (data.resetTime < now) {
      ipRequestStore.set(ip, {
        count: 1,
        resetTime: now + settings.windowMs,
      });
      return h.continue;
    }

    // Increment count
    data.count += 1;

    // Check if over limit
    if (data.count > settings.max) {
      const timeLeft = Math.ceil((data.resetTime - now) / 1000 / 60);
      return Boom.tooManyRequests(`${settings.message}. Try again in ${timeLeft} minutes.`);
    }

    return h.continue;
  };
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
