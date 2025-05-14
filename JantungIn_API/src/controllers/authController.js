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

    const user = await User.create({
      name,
      email,
      password, // Password akan di-hash oleh hook beforeCreate
      dateOfBirth,
    });

    const token = generateToken(user);

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
    return Boom.badImplementation('Error registering user', error);
  }
};

const login = async (request, h) => {
  try {
    const { email, password } = request.payload;

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return Boom.unauthorized('Invalid email or password');
    }

    // Verifikasi password
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return Boom.unauthorized('Invalid email or password');
    }

    const token = generateToken(user);

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
    return Boom.badImplementation('Error during login', error);
  }
};

const getProfile = async (request, h) => {
  try {
    const { id } = request.auth.credentials;

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
    return Boom.badImplementation('Error retrieving profile', error);
  }
};

const updateProfile = async (request, h) => {
  try {
    const { id } = request.auth.credentials;
    const { name, dateOfBirth } = request.payload;

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

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
