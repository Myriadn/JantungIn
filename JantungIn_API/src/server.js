'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Inert = require('@hapi/inert');
const Path = require('path');
require('dotenv').config();

// Import models
const { useDynamoDB, initializeDatabase } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');

// Import seed utility
const { createInitialAdmin } = require('./utils/seed');

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
  await server.register([authPlugin, errorHandler, Inert]);

  // Register routes
  await server.register([require('./routes/adminRoutes'), require('./routes/setupRoutes')]);

  // Serve static files from public folder with higher priority
  server.route({
    method: 'GET',
    path: '/{param*}',
    options: {
      auth: false,
      handler: {
        directory: {
          path: Path.join(__dirname, '../public'),
          index: ['index.html'],
          listing: false,
          defaultExtension: 'html',
        },
      },
    },
  });

  // Add explicit route for API documentation
  server.route({
    method: 'GET',
    path: '/docs',
    options: {
      auth: false,
    },
    handler: (request, h) => {
      return h.redirect('/api-docs.html');
    },
  });

  // Add routes
  server.route([...authRoutes, ...diagnosisRoutes]);

  // Print registered routes for debugging
  console.log('Registered routes:');
  server.table().forEach((route) => {
    console.log(`${route.method}\t${route.path}`);
  }); // Add health check route
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

  // Add api-docs route for direct access
  server.route({
    method: 'GET',
    path: '/api-docs',
    options: {
      auth: false,
    },
    handler: (request, h) => {
      return h.redirect('/api-docs.html');
    },
  });

  // Default route for non-existent API paths
  server.route({
    method: '*',
    path: '/api/{any*}',
    handler: () => {
      return Boom.notFound('Endpoint not found');
    },
  }); // Initialize database (either SQL or DynamoDB)
  await initializeDatabase();

  console.log(`Database connection established successfully.`);

  // Create initial admin account if not exists
  await createInitialAdmin();

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
