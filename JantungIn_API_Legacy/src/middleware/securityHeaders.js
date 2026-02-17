// Security headers middleware for Hapi.js
const securityHeaders = async (server) => {
  // Register security headers as extension points
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (!response.isBoom) {
      // Set security headers for non-error responses
      response.header('X-Content-Type-Options', 'nosniff');
      response.header('X-Frame-Options', 'DENY');
      response.header('X-XSS-Protection', '1; mode=block');
      response.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

      // Content Security Policy
      const cspHeader =
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: blob:; " +
        "connect-src 'self' " +
        (process.env.ALLOWED_ORIGINS || '') +
        '; ' +
        "font-src 'self'; " +
        "object-src 'none'; " +
        "media-src 'self'; " +
        "frame-src 'none'";

      response.header('Content-Security-Policy', cspHeader);
    }
    return h.continue;
  });

  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    server.ext('onRequest', (request, h) => {
      // Check if we're behind a proxy (like Railway)
      const forwardedProto = request.headers['x-forwarded-proto'];
      if (forwardedProto && forwardedProto !== 'https' && request.headers['x-forwarded-for']) {
        const host = request.headers.host;
        const url = request.url.path;
        return h.redirect(`https://${host}${url}`).takeover();
      }
      return h.continue;
    });
  }

  return server;
};

module.exports = securityHeaders;

module.exports = securityHeaders;
