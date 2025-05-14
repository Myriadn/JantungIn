'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
require('dotenv').config();

// Import models
const { testConnection, syncDatabase } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');

// Import middleware/plugins
const authPlugin = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            // In prod, log a limited error message and throw the default Bad Request error.
            console.error('ValidationError:', err.message);
            throw Boom.badRequest('Invalid request payload');
          } else {
            // During development, log and respond with the full error.
            console.error(err);
            throw err;
          }
        },
      },
    },
  });

  // Register plugins
  await server.register([authPlugin, errorHandler]);

  // Add routes
  server.route([...authRoutes, ...diagnosisRoutes]);

  // Add health check route
  server.route({
    method: 'GET',
    path: '/health',
    options: {
      auth: false,
    },
    handler: () => {
      return { status: 'UP', timestamp: new Date().toISOString() };
    },
  });

  // Default route for non-existent paths
  server.route({
    method: '*',
    path: '/{any*}',
    handler: () => {
      return Boom.notFound('Endpoint not found');
    },
  });

  // Test database connection
  await testConnection();

  // Sync database models (only in development)
  if (process.env.NODE_ENV === 'development') {
    await syncDatabase(false); // Set to true to force recreate tables
  }

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  return server;
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

// Start server if file is run directly
if (!module.parent) {
  init();
}

module.exports = { init };
