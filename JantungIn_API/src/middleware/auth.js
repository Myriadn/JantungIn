'use strict';

const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const Boom = require('@hapi/boom');

const authPlugin = {
  name: 'auth',
  version: '1.0.0',
  register: async (server) => {
    // Register auth scheme
    server.auth.scheme('jwt', (server, options) => {
      return {
        authenticate: async (request, h) => {
          try {
            // Check if auth header exists and has correct format
            const authHeader = request.headers.authorization;
            if (!authHeader) {
              console.log('Missing authorization header');
              return h.unauthenticated(Boom.unauthorized('Missing authentication token'));
            }

            if (!authHeader.startsWith('Bearer ')) {
              console.log('Invalid authorization header format');
              return h.unauthenticated(Boom.unauthorized('Invalid authentication token format'));
            } // Extract token
            const token = authHeader.substring(7);
            console.log('Verifying token...');

            let decoded;
            try {
              decoded = verifyToken(token);
              console.log('Token verified for user:', decoded.id);
            } catch (error) {
              console.error('Token verification failed:', error.message);
              return h.unauthenticated(Boom.unauthorized(error.message || 'Invalid token'));
            } // Find user and validate credentials
            const user = await User.findByPk(decoded.id);
            if (!user) {
              console.log('User not found for token:', decoded.id);
              return h.unauthenticated(Boom.unauthorized('User not found'));
            }

            console.log('Authentication successful for user:', user.id); // Set credentials for request
            return h.authenticated({
              credentials: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                lastAuthTime: Date.now(), // Add timestamp for session management
              },
            });
          } catch (error) {
            console.error('Authentication error:', error);
            return h.unauthenticated(Boom.unauthorized('Authentication failed'));
          }
        },
      };
    }); // Register jwt as default strategy
    server.auth.strategy('jwt', 'jwt'); // Middleware to check role-based access
    server.ext('onPreHandler', (request, h) => {
      const route = request.route;

      // Check for required roles
      if (route.settings.app?.requiredRoles) {
        const requiredRoles = route.settings.app.requiredRoles;
        const userRole = request.auth.credentials?.role;

        console.log('Checking role access:', {
          required: requiredRoles,
          user: userRole,
        });

        if (!userRole || !requiredRoles.includes(userRole)) {
          return Boom.forbidden('Access denied. Insufficient privileges.');
        }
      }

      return h.continue;
    });
  },
};

module.exports = authPlugin;
