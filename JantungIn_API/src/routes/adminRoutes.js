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
      // Rute untuk pasien (user)
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

      // Rute untuk manajemen admin/dokter
      {
        method: 'GET',
        path: '/api/admin/admins',
        handler: adminController.getAllAdmins,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan semua data admin/dokter',
          app: {
            requiredRoles: ['admin'],
            localhostOnly: true,
          },
        },
      },
      {
        method: 'POST',
        path: '/api/admin/admins',
        handler: adminController.createAdminUser,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Membuat user admin/dokter baru',
          app: {
            requiredRoles: ['admin'],
            localhostOnly: true,
          },
        },
      },

      // Rute untuk manajemen user (common)
      {
        method: 'PUT',
        path: '/api/admin/users/{id}',
        handler: adminController.updateUser,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mengubah data user',
          app: {
            requiredRoles: ['admin'],
            localhostOnly: true,
          },
        },
      },
      {
        method: 'DELETE',
        path: '/api/admin/users/{id}',
        handler: adminController.deleteUser,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Menghapus user',
          app: {
            requiredRoles: ['admin'],
            localhostOnly: true,
          },
        },
      },
      {
        method: 'POST',
        path: '/api/admin/users/{id}/reset-password',
        handler: adminController.resetUserPassword,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Reset password user',
          app: {
            requiredRoles: ['admin'],
            localhostOnly: true,
          },
        },
      },
      // Rute untuk statistik
      {
        method: 'GET',
        path: '/api/admin/statistics/diagnosis',
        handler: adminController.getDiagnosisStatistics,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan statistik diagnosa',
          app: {
            requiredRoles: ['admin', 'dokter'],
            localhostOnly: true,
          },
        },
      },
      // Rute untuk dashboard admin
      {
        method: 'GET',
        path: '/api/admin/dashboard',
        handler: adminController.getAdminDashboard,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan data dashboard admin',
          app: {
            requiredRoles: ['admin', 'dokter'],
            localhostOnly: true,
          },
        },
      },
      // Rute untuk profil admin
      {
        method: 'GET',
        path: '/api/admin/profile',
        handler: adminController.getAdminProfile,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan profil admin yang sedang login',
          app: {
            requiredRoles: ['admin', 'dokter'],
            localhostOnly: true,
          },
        },
      },

      // Rute untuk mengganti password admin
      {
        method: 'POST',
        path: '/api/admin/change-password',
        handler: adminController.changeAdminPassword,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mengganti password admin yang sedang login',
          app: {
            requiredRoles: ['admin', 'dokter'],
            localhostOnly: true,
          },
        },
      },
    ]);
  },
};
