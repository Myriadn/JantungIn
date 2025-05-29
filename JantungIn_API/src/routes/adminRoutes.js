'use strict';

const adminController = require('../controllers/adminController');

module.exports = {
  name: 'admin-routes',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/api/admin/login',
        handler: adminController.adminLogin,
        options: {
          auth: false,
          tags: ['api', 'admin'],
          description: 'Login khusus admin/dokter',
          app: {
            localhostOnly: true, // Hanya bisa diakses dari localhost
          },
        },
      },
      {
        method: 'GET',
        path: '/api/admin/patients',
        handler: adminController.getAllPatients,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan semua data pasien',
          app: {
            requiredRoles: ['admin', 'dokter'], // Hanya admin/dokter yang bisa akses
            localhostOnly: true,
          },
        },
      },
      {
        method: 'GET',
        path: '/api/admin/patients/{id}',
        handler: adminController.getPatientById,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan data pasien berdasarkan ID',
          app: {
            requiredRoles: ['admin', 'dokter'],
            localhostOnly: true,
          },
        },
      },
      {
        method: 'POST',
        path: '/api/admin/patients/find',
        handler: adminController.findPatientByNik,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mencari pasien berdasarkan NIK',
          app: {
            requiredRoles: ['admin', 'dokter'],
            localhostOnly: true,
          },
        },
      },
    ]);
  },
};
