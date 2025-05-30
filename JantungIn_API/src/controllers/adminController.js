'use strict';

const Boom = require('@hapi/boom');
const { User, Diagnosis, sequelize } = require('../models');
const { generateToken } = require('../utils/jwt');
const { Op } = require('sequelize');

// Fungsi login khusus untuk admin/dokter
const adminLogin = async (request, h) => {
  try {
    const { username, password } = request.payload;
    console.log(`Attempting admin login with username: ${username}`);

    // Cari user berdasarkan email sebagai username, dengan scope eksplisit
    const admin = await User.scope('withCredentials').findOne({
      where: {
        email: username,
        role: {
          [Op.in]: ['admin', 'dokter'], // Menggunakan Op.in untuk array di Sequelize
        },
      },
    });

    console.log(`Admin found: ${admin ? 'Yes' : 'No'}`);
    if (admin) {
      console.log(`Admin role: ${admin.role}`);
      console.log(`Password included: ${admin.password ? 'Yes' : 'No'}`);
    }

    if (!admin) {
      return Boom.unauthorized('Username atau password tidak valid');
    }

    // Verifikasi password
    const isValid = await admin.verifyPassword(password);
    if (!isValid) {
      return Boom.unauthorized('Username atau password tidak valid');
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    return h.response({
      statusCode: 200,
      message: 'Login berhasil',
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return Boom.badImplementation('Error during login');
  }
};

// Fungsi untuk mendapatkan data semua pasien (user)
const getAllPatients = async (request, h) => {
  try {
    const patients = await User.findAll({
      where: { role: 'user' },
      attributes: { exclude: ['password'] },
    });

    return h.response({
      statusCode: 200,
      message: 'Data pasien berhasil diambil',
      data: patients,
    });
  } catch (error) {
    console.error('Get patients error:', error);
    return Boom.badImplementation('Error mengambil data pasien');
  }
};

// Fungsi untuk mendapatkan data satu pasien berdasarkan id
const getPatientById = async (request, h) => {
  try {
    const { id } = request.params;

    const patient = await User.findOne({
      where: {
        id,
        role: 'user',
      },
      attributes: { exclude: ['password'] },
    });

    if (!patient) {
      return Boom.notFound('Pasien tidak ditemukan');
    }

    return h.response({
      statusCode: 200,
      message: 'Data pasien berhasil diambil',
      data: patient,
    });
  } catch (error) {
    console.error('Get patient error:', error);
    return Boom.badImplementation('Error mengambil data pasien');
  }
};

// Fungsi untuk mencari pasien berdasarkan NIK
const findPatientByNik = async (request, h) => {
  try {
    const { nik } = request.payload;

    // Validasi NIK
    if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
      return Boom.badRequest('NIK harus 16 digit angka');
    }

    // Cari semua user dengan scope untuk akses nik_encrypted
    const users = await User.findAll({
      where: { role: 'user' },
      scope: 'withNIK',
      attributes: { exclude: ['password'] },
    });

    // Cari user dengan NIK yang cocok
    let patient = null;
    for (const user of users) {
      if (user.getNIK() === nik) {
        patient = user;
        break;
      }
    }

    if (!patient) {
      return Boom.notFound('Pasien dengan NIK tersebut tidak ditemukan');
    }

    return h.response({
      statusCode: 200,
      message: 'Data pasien berhasil ditemukan',
      data: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        dateOfBirth: patient.dateOfBirth,
      },
    });
  } catch (error) {
    console.error('Find patient error:', error);
    return Boom.badImplementation('Error mencari data pasien');
  }
};

// Fungsi untuk membuat user baru (admin/dokter) oleh admin
const createAdminUser = async (request, h) => {
  try {
    const { name, email, password, role, nik, dateOfBirth } = request.payload;

    // Validasi role
    if (!['admin', 'dokter'].includes(role)) {
      return Boom.badRequest('Role harus admin atau dokter');
    }

    // Validasi NIK
    if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
      return Boom.badRequest('NIK harus 16 digit angka');
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return Boom.conflict('Email sudah terdaftar');
    }

    // Enkripsi NIK
    const nik_encrypted = User.encryptNIK(nik);

    // Buat user baru
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      nik_encrypted,
      dateOfBirth: dateOfBirth || null,
    });

    return h
      .response({
        statusCode: 201,
        message: `${role === 'admin' ? 'Admin' : 'Dokter'} berhasil dibuat`,
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      })
      .code(201);
  } catch (error) {
    console.error('Create admin user error:', error);
    return Boom.badImplementation('Error membuat user admin/dokter');
  }
};

// Fungsi untuk mengedit user oleh admin
const updateUser = async (request, h) => {
  try {
    const { id } = request.params;
    const { name, email, role, dateOfBirth } = request.payload;

    // Cari user yang akan diedit
    const user = await User.findByPk(id);
    if (!user) {
      return Boom.notFound('User tidak ditemukan');
    }

    // Validasi role jika ada
    if (role && !['user', 'admin', 'dokter'].includes(role)) {
      return Boom.badRequest('Role tidak valid');
    }

    // Update data user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
    });

    return h.response({
      statusCode: 200,
      message: 'User berhasil diperbarui',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return Boom.badImplementation('Error memperbarui user');
  }
};

// Fungsi untuk menghapus user oleh admin
const deleteUser = async (request, h) => {
  try {
    const { id } = request.params;

    // Cari user yang akan dihapus
    const user = await User.findByPk(id);
    if (!user) {
      return Boom.notFound('User tidak ditemukan');
    }

    // Hapus user
    await user.destroy();

    return h.response({
      statusCode: 200,
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return Boom.badImplementation('Error menghapus user');
  }
};

// Fungsi untuk mendapatkan semua admin/dokter
const getAllAdmins = async (request, h) => {
  try {
    const admins = await User.findAll({
      where: { role: ['admin', 'dokter'] },
      attributes: { exclude: ['password'] },
    });

    return h.response({
      statusCode: 200,
      message: 'Data admin/dokter berhasil diambil',
      data: admins,
    });
  } catch (error) {
    console.error('Get admins error:', error);
    return Boom.badImplementation('Error mengambil data admin/dokter');
  }
};

// Fungsi untuk reset password user oleh admin
const resetUserPassword = async (request, h) => {
  try {
    const { id } = request.params;
    const { newPassword } = request.payload;

    if (!newPassword || newPassword.length < 6) {
      return Boom.badRequest('Password baru harus minimal 6 karakter');
    }

    // Cari user yang akan direset passwordnya
    const user = await User.findByPk(id);
    if (!user) {
      return Boom.notFound('User tidak ditemukan');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return h.response({
      statusCode: 200,
      message: 'Password user berhasil direset',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return Boom.badImplementation('Error mereset password user');
  }
};

// Fungsi untuk mendapatkan statistik diagnosa
const getDiagnosisStatistics = async (request, h) => {
  try {
    // Statistik jumlah diagnosa berdasarkan hasil prediksi
    const predictionStats = await Diagnosis.findAll({
      attributes: ['prediction', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['prediction'],
    });

    // Total diagnosa
    const totalDiagnosis = await Diagnosis.count();

    // Diagnosa 7 hari terakhir
    const lastWeekDiagnosis = await Diagnosis.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return h.response({
      statusCode: 200,
      message: 'Statistik diagnosa berhasil diambil',
      data: {
        totalDiagnosis,
        lastWeekDiagnosis,
        predictionDistribution: predictionStats,
      },
    });
  } catch (error) {
    console.error('Get diagnosis statistics error:', error);
    return Boom.badImplementation('Error mengambil statistik diagnosa');
  }
};

// Fungsi untuk mendapatkan data dashboard admin
const getAdminDashboard = async (request, h) => {
  try {
    // Statistik jumlah user berdasarkan role
    const userStats = await User.findAll({
      attributes: ['role', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['role'],
    });

    // Total user
    const totalUsers = await User.count();

    // User 7 hari terakhir
    const lastWeekUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Statistik jumlah diagnosa berdasarkan hasil prediksi
    const predictionStats = await Diagnosis.findAll({
      attributes: ['prediction', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['prediction'],
    });

    // Total diagnosa
    const totalDiagnosis = await Diagnosis.count();

    // Diagnosa 7 hari terakhir
    const lastWeekDiagnosis = await Diagnosis.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Statistik cardiovascular risk
    const riskStats = await Diagnosis.findAll({
      attributes: ['cardiovascularRisk', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['cardiovascularRisk'],
    });

    return h.response({
      statusCode: 200,
      message: 'Data dashboard berhasil diambil',
      data: {
        users: {
          total: totalUsers,
          newLastWeek: lastWeekUsers,
          byRole: userStats,
        },
        diagnoses: {
          total: totalDiagnosis,
          newLastWeek: lastWeekDiagnosis,
          byPrediction: predictionStats,
          byRisk: riskStats,
        },
      },
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    return Boom.badImplementation('Error mengambil data dashboard');
  }
};

// Fungsi untuk mendapatkan profil admin/dokter yang sedang login
const getAdminProfile = async (request, h) => {
  try {
    const { id } = request.auth.credentials;

    const admin = await User.findOne({
      where: {
        id,
        role: ['admin', 'dokter'],
      },
      attributes: { exclude: ['password'] },
    });

    if (!admin) {
      return Boom.notFound('Profil admin tidak ditemukan');
    }

    return h.response({
      statusCode: 200,
      message: 'Profil admin berhasil diambil',
      data: admin,
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    return Boom.badImplementation('Error mengambil profil admin');
  }
};

// Fungsi untuk mengganti password admin yang sedang login
const changeAdminPassword = async (request, h) => {
  try {
    const { id } = request.auth.credentials;
    const { currentPassword, newPassword } = request.payload;

    if (!newPassword || newPassword.length < 6) {
      return Boom.badRequest('Password baru harus minimal 6 karakter');
    }

    // Cari admin yang sedang login
    const admin = await User.findOne({
      where: {
        id,
        role: ['admin', 'dokter'],
      },
      scope: 'withCredentials',
    });

    if (!admin) {
      return Boom.notFound('Admin tidak ditemukan');
    }

    // Verifikasi password lama
    const isValid = await admin.verifyPassword(currentPassword);
    if (!isValid) {
      return Boom.badRequest('Password lama tidak valid');
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return h.response({
      statusCode: 200,
      message: 'Password berhasil diubah',
    });
  } catch (error) {
    console.error('Change admin password error:', error);
    return Boom.badImplementation('Error mengubah password');
  }
};

module.exports = {
  adminLogin,
  getAllPatients,
  getPatientById,
  findPatientByNik,
  createAdminUser,
  updateUser,
  deleteUser,
  getAllAdmins,
  resetUserPassword,
  getDiagnosisStatistics,
  getAdminDashboard,
  getAdminProfile,
  changeAdminPassword,
};
