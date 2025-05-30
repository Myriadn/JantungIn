'use strict';

const setupController = require('../controllers/setupController');

module.exports = {
  name: 'setup-routes',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/api/setup/admin',
        handler: setupController.setupAdmin,
        options: {
          auth: false,
          tags: ['api', 'setup'],
          description: 'Setup the initial admin account',
          app: {
            localhostOnly: true, // Hanya bisa diakses dari localhost
          },
        },
      },
      {
        method: 'GET',
        path: '/api/setup/admin-check',
        handler: setupController.checkAdminAccount,
        options: {
          auth: false,
          tags: ['api', 'setup'],
          description: 'Check existing admin accounts',
          app: {
            localhostOnly: true, // Hanya bisa diakses dari localhost
          },
        },
      },
    ]);
  },
};
