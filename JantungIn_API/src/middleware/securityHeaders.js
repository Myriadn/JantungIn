const helmet = require('helmet');

// Security headers middleware using helmet
const securityHeaders = (server) => {
  // Apply Helmet's security headers
  server.use(helmet());

  // Additional Content Security Policy settings
  server.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Modify as needed for your app
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", process.env.ALLOWED_ORIGINS?.split(',') || []],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    })
  );

  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    server.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        // Check if request is from Railway's proxy
        if (req.headers['x-forwarded-for']) {
          return res.redirect(`https://${req.headers.host}${req.url}`);
        }
      }
      next();
    });
  }

  return server;
};

module.exports = securityHeaders;
