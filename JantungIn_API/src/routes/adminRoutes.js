'use strict';

const adminController = require('../controllers/adminController');

module.exports = {
  name: 'admin-routes',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/admin/login',
        handler: adminController.adminLogin,
        options: {
          auth: false,
          tags: ['api', 'admin'],
          description: 'Login khusus admin/dokter',
          app: {
            // localhostOnly: true, // Hanya bisa diakses dari localhost & Production later
          },
        },
      },
      // Rute untuk pasien (user)
      {
        method: 'GET',
        path: '/api/v1/admin/patients',
        handler: adminController.getAllPatients,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan semua data pasien',
          app: {
            requiredRoles: ['admin', 'dokter'], // Hanya admin/dokter yang bisa akses
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },
      {
        method: 'GET',
        path: '/api/v1/admin/patients/{id}',
        handler: adminController.getPatientById,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan data pasien berdasarkan ID',
          app: {
            requiredRoles: ['admin', 'dokter'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },
      {
        method: 'POST',
        path: '/api/v1/admin/patients/find',
        handler: adminController.findPatientByNik,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mencari pasien berdasarkan NIK',
          app: {
            requiredRoles: ['admin', 'dokter'],
          },
        },
      },
      {
        method: 'GET',
        path: '/api/v1/admin/patients/search',
        handler: adminController.searchPatients,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mencari pasien berdasarkan nama atau NIK',
          app: {
            requiredRoles: ['admin', 'dokter'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },

      // Rute untuk manajemen admin/dokter
      {
        method: 'GET',
        path: '/api/v1/admin/admins',
        handler: adminController.getAllAdmins,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan semua data admin/dokter',
          app: {
            requiredRoles: ['admin'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },
      {
        method: 'POST',
        path: '/api/v1/admin/admins',
        handler: adminController.createAdminUser,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Membuat user admin/dokter baru',
          app: {
            requiredRoles: ['admin'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },

      // Rute untuk manajemen user (common)
      {
        method: 'PUT',
        path: '/api/v1/admin/users/{id}',
        handler: adminController.updateUser,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mengubah data user',
          app: {
            requiredRoles: ['admin'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },
      {
        method: 'DELETE',
        path: '/api/v1/admin/users/{id}',
        handler: adminController.deleteUser,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Menghapus user',
          app: {
            requiredRoles: ['admin'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },
      {
        method: 'POST',
        path: '/api/v1/admin/users/{id}/reset-password',
        handler: adminController.resetUserPassword,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Reset password user',
          app: {
            requiredRoles: ['admin'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },
      // Rute untuk statistik
      {
        method: 'GET',
        path: '/api/v1/admin/statistics/diagnosis',
        handler: adminController.getDiagnosisStatistics,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan statistik diagnosa',
          app: {
            requiredRoles: ['admin', 'dokter'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },
      // Rute untuk dashboard admin
      {
        method: 'GET',
        path: '/api/v1/admin/dashboard',
        handler: adminController.getAdminDashboard,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan data dashboard admin',
          app: {
            requiredRoles: ['admin', 'dokter'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },
      // Rute untuk profil admin
      {
        method: 'GET',
        path: '/api/v1/admin/profile',
        handler: adminController.getAdminProfile,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mendapatkan profil admin yang sedang login',
          app: {
            requiredRoles: ['admin', 'dokter'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },

      // Rute untuk mengganti password admin
      {
        method: 'POST',
        path: '/api/v1/admin/change-password',
        handler: adminController.changeAdminPassword,
        options: {
          auth: 'jwt',
          tags: ['api', 'admin'],
          description: 'Mengganti password admin yang sedang login',
          app: {
            requiredRoles: ['admin', 'dokter'],
            // localhostOnly: true, // Dinonaktifkan untuk presentasi
          },
        },
      },
    ]);
  },
};
