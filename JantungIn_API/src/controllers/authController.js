'use strict';

const Boom = require('@hapi/boom');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { findUsersByEncryptedNIK } = require('../services/nikService');

const register = async (request, h) => {
  try {
    const { name, email, nik, password, dateOfBirth } = request.payload;

    // Validasi NIK (harus 16 digit)
    if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
      return Boom.badRequest('NIK harus 16 digit angka');
    }

    // Cek apakah NIK sudah digunakan
    const existingUsers = await User.findAll({ scope: 'withNIK' });
    for (const user of existingUsers) {
      if (user.getNIK() === nik) {
        return Boom.conflict('NIK sudah terdaftar');
      }
    }

    // Cek email jika diisi
    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return Boom.conflict('Email sudah terdaftar');
      }
    }

    // Enkripsi NIK
    const nik_encrypted = User.encryptNIK(nik);

    // Create user with Sequelize
    const user = await User.create({
      name,
      email: email || null, // Email opsional
      nik_encrypted,
      password, // Password akan di-hash sebelum disimpan
      dateOfBirth,
      role: 'user', // Default role
    });

    // Generate JWT token for authentication
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return h
      .response({
        statusCode: 201,
        message: 'User registered successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        },
      })
      .code(201);
  } catch (error) {
    console.error('Registration error:', error);
    return Boom.badImplementation('Error registering user');
  }
};

const login = async (request, h) => {
  try {
    const { nik, password } = request.payload;

    console.log(`Login attempt with NIK: ${nik}`);

    // Validasi NIK (harus 16 digit)
    if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
      console.log('NIK validation failed');
      return Boom.badRequest('NIK harus 16 digit angka');
    }    // Cari user berdasarkan NIK
    const users = await User.findAll({ 
      scope: 'withCredentials',
      attributes: { include: ['nik_encrypted', 'password'] }
    });
    console.log(`Found ${users.length} users to check against`);
    
    // Cari user dengan NIK yang cocok
    let foundUser = null;
    for (const user of users) {
      const decryptedNik = user.getNIK();
      console.log(`Comparing with user: ${user.id}, Decrypted NIK: ${decryptedNik}`);
      if (decryptedNik === nik) {
        foundUser = user;
        console.log(`Match found for user: ${user.id}`);
        break;
      }
    }

    if (!foundUser) {
      console.log('No user found with matching NIK');
      return Boom.unauthorized('NIK atau password tidak valid');
    }

    // Verifikasi password
    const isValid = await foundUser.verifyPassword(password);
    console.log(`Password verification result: ${isValid}`);
    if (!isValid) {
      console.log('Password validation failed');
      return Boom.unauthorized('NIK atau password tidak valid');
    }

    // Generate JWT token
    const token = generateToken({
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
    });

    return h.response({
      statusCode: 200,
      message: 'Login berhasil',
      data: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Boom.badImplementation('Error during login');
  }
};

const getProfile = async (request, h) => {
  try {
    const { id } = request.auth.credentials;

    // Get user from PostgreSQL
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return Boom.notFound('User not found');
    }

    return h.response({
      statusCode: 200,
      message: 'Profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    return Boom.badImplementation('Error retrieving profile');
  }
};

const updateProfile = async (request, h) => {
  try {
    const { id } = request.auth.credentials;
    const { name, dateOfBirth } = request.payload;

    // For PostgreSQL with Sequelize
    const user = await User.findByPk(id);
    if (!user) {
      return Boom.notFound('User not found');
    }

    await user.update({
      name: name || user.name,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
    });

    return h.response({
      statusCode: 200,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    return Boom.badImplementation('Error updating profile', error);
  }
};

const loginWithEmail = async (request, h) => {
  try {
    const { email, password } = request.payload;
    console.log(`Login attempt with email: ${email}`);

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('No user found with this email');
      return Boom.unauthorized('Email atau password tidak valid');
    }

    // Verifikasi password
    const isValid = await user.verifyPassword(password);
    console.log(`Password verification result: ${isValid}`);
    if (!isValid) {
      console.log('Password validation failed');
      return Boom.unauthorized('Email atau password tidak valid');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return h.response({
      statusCode: 200,
      message: 'Login berhasil',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error('Login with email error:', error);
    return Boom.badImplementation('Error during login with email');
  }
};

// Endpoint diagnostik untuk troubleshooting masalah NIK
const debugNIK = async (request, h) => {
  try {
    console.log('Starting NIK debugging...');
    
    // Cek semua NIK terenkripsi di database
    const users = await User.findAll({
      scope: 'withCredentials',
      attributes: ['id', 'name', 'email', 'nik_encrypted']
    });
    
    console.log(`Found ${users.length} users in database`);
    
    // Daftar NIK terenkripsi
    console.log('--- DAFTAR NIK TERENKRIPSI ---');
    const userDetails = [];
    
    for (const user of users) {
      console.log(`User ID: ${user.id}, Encrypted NIK: ${user.nik_encrypted}`);
      
      // Coba dekripsi NIK
      const decryptedNIK = user.getNIK();
      console.log(`Decrypted NIK: ${decryptedNIK || 'Failed to decrypt'}`);
      
      userDetails.push({
        id: user.id,
        name: user.name,
        email: user.email,
        hasEncryptedNIK: user.nik_encrypted ? 'Yes' : 'No',
        decryptedNIK: decryptedNIK || 'Failed to decrypt'
      });
    }
    
    // Cek kunci enkripsi
    let keyStr = process.env.ENCRYPTION_KEY || 'fallback_encryption_key_for_development';
    if (keyStr.length < 32) {
      keyStr = keyStr.padEnd(32, '0');
    } else if (keyStr.length > 32) {
      keyStr = keyStr.substring(0, 32);
    }
    
    console.log(`Using encryption key (first 5 chars): ${keyStr.substring(0, 5)}... (length: ${keyStr.length})`);
    
    // Tes enkripsi dan dekripsi
    const testNIK = '1234567890123456';
    const encrypted = User.encryptNIK(testNIK);
    console.log(`Test encryption: ${testNIK} -> ${encrypted}`);
    
    const decrypted = User.decryptNIK(encrypted);
    console.log(`Test decryption: ${encrypted} -> ${decrypted}`);
    
    return h.response({
      statusCode: 200,
      message: 'NIK debugging completed',
      data: {
        userCount: users.length,
        users: userDetails,
        encryptionTest: {
          original: testNIK,
          encrypted: encrypted,
          decrypted: decrypted,
          successful: testNIK === decrypted
        }
      },
    });
  } catch (error) {
    console.error('NIK debugging error:', error);
    return Boom.badImplementation('Error during NIK debugging');
  }
};

// Endpoint untuk update NIK langsung
const updateUserNIK = async (request, h) => {
  try {
    const { userId, newNIK } = request.payload;
    
    // Validasi NIK
    if (!newNIK || newNIK.length !== 16 || !/^\d+$/.test(newNIK)) {
      return Boom.badRequest('NIK harus 16 digit angka');
    }
    
    // Ambil user
    const user = await User.findByPk(userId);
    if (!user) {
      return Boom.notFound('User not found');
    }
    
    // Enkripsi NIK baru
    const nik_encrypted = User.encryptNIK(newNIK);
    
    // Update NIK
    await user.update({ nik_encrypted });
    
    return h.response({
      statusCode: 200,
      message: 'NIK updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      },
    });
  } catch (error) {
    console.error('NIK update error:', error);
    return Boom.badImplementation('Error updating NIK');
  }
};

module.exports = {
  register,
  login,
  loginWithEmail,
  getProfile,
  updateProfile,
  debugNIK,
  updateUserNIK,
};
