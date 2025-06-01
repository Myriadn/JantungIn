'use strict';

const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const Boom = require('@hapi/boom');

const authPlugin = {
  name: 'auth',
  version: '1.0.0',
  register: async (server) => {
    // Daftarkan auth scheme
    server.auth.scheme('jwt', (server, options) => {
      return {
        authenticate: async (request, h) => {
          try {
            // Cek apakah header auth ada
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
              return h.unauthenticated(new Error('Missing or invalid authentication token'));
            } // Extract token dari header
            const token = authHeader.substring(7);

            let decoded;
            try {
              decoded = verifyToken(token); // Cari user berdasarkan id dari token
            } catch (error) {
              console.error('Token verification error:', error.message);
              return h.unauthenticated(new Error(error.message || 'Invalid token'));
            }

            // For PostgreSQL with Sequelize
            const user = await User.findByPk(decoded.id);

            if (!user) {
              return h.unauthenticated(new Error('User not found'));
            } // Set credentials untuk request
            return h.authenticated({
              credentials: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              },
            });
          } catch (error) {
            return h.unauthenticated(new Error('Invalid token'));
          }
        },
      };
    }); // Daftarkan strategy auth dengan scheme jwt
    server.auth.strategy('jwt', 'jwt'); // Middleware untuk memeriksa akses berdasarkan role
    server.ext('onPreHandler', (request, h) => {
      const route = request.route;

      // Jika route memerlukan role tertentu
      if (route.settings.app && route.settings.app.requiredRoles) {
        const requiredRoles = route.settings.app.requiredRoles;
        const userRole = request.auth.credentials ? request.auth.credentials.role : null;

        // Jika user tidak memiliki role yang diperlukan
        if (!userRole || !requiredRoles.includes(userRole)) {
          throw Boom.forbidden('Akses ditolak. Anda tidak memiliki hak akses yang cukup.');
        }

        // Additional security for admin/doctor roles in production
        if (
          process.env.NODE_ENV === 'production' &&
          (userRole === 'admin' || userRole === 'doctor')
        ) {
          // Check for sensitive operations
          const sensitiveOperations = ['DELETE', 'PUT', 'POST'];
          if (sensitiveOperations.includes(request.method.toUpperCase())) {
            // Implement additional security measures like checking for specific headers or session data
            // For example, checking if a recent auth confirmation was done
            const lastAuthTime = request.auth.credentials.lastAuthTime || 0;
            const currentTime = Date.now();

            // If the last auth was more than 30 minutes ago, require re-authentication for sensitive operations
            if (currentTime - lastAuthTime > 30 * 60 * 1000) {
              throw Boom.unauthorized(
                'Session timeout for sensitive operation. Please re-authenticate.'
              );
            }
          }
        }
      }

      // Jika route hanya bisa diakses dari localhost (only in development)
      if (
        process.env.NODE_ENV !== 'production' &&
        route.settings.app &&
        route.settings.app.localhostOnly
      ) {
        const clientIp = request.info.remoteAddress;
        const allowedIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

        if (!allowedIPs.includes(clientIp)) {
          throw Boom.forbidden(
            'Akses ditolak. Route ini hanya bisa diakses dari localhost dalam mode development.'
          );
        }
      }

      return h.continue;
    });

    // Jangan set default strategy, agar routes yang tidak memerlukan auth bisa diakses
  },
};

module.exports = authPlugin;
