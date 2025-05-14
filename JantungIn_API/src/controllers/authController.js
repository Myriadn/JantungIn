'use strict';

const Boom = require('@hapi/boom');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

const register = async (request, h) => {
  try {
    const { name, email, password, dateOfBirth } = request.payload;

    // Cek apakah email sudah digunakan
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return Boom.conflict('Email already registered');
    }

    // Create user with either Sequelize or DynamoDB
    const user = await User.create({
      name,
      email,
      password, // Password akan di-hash sebelum disimpan
      dateOfBirth,
    });

    // Generate JWT token for authentication
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return h
      .response({
        statusCode: 201,
        message: 'User registered successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
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
    const { email, password } = request.payload;

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return Boom.unauthorized('Invalid email or password');
    } // Verifikasi password
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return Boom.unauthorized('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return h.response({
      statusCode: 200,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
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

    // Handle both Sequelize and DynamoDB models
    let user;
    if (require('../models').useDynamoDB) {
      user = await User.findOne({ where: { id } });
      if (user) {
        delete user.password; // Remove password from response
      }
    } else {
      user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
      });
    }

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

    // Handle both Sequelize and DynamoDB models
    let updatedUser;
    if (require('../models').useDynamoDB) {
      // For DynamoDB
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return Boom.notFound('User not found');
      }

      const updateData = {
        name: name || user.name,
        dateOfBirth: dateOfBirth || user.dateOfBirth,
      };

      updatedUser = await User.update(updateData, { where: { id } });
    } else {
      // For SQL database with Sequelize
      const user = await User.findByPk(id);
      if (!user) {
        return Boom.notFound('User not found');
      }

      await user.update({
        name: name || user.name,
        dateOfBirth: dateOfBirth || user.dateOfBirth,
      });

      updatedUser = user;
    }

    return h.response({
      statusCode: 200,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        dateOfBirth: updatedUser.dateOfBirth,
      },
    });
  } catch (error) {
    return Boom.badImplementation('Error updating profile', error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
