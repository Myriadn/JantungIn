'use strict';

const Joi = require('@hapi/joi');
const authController = require('../controllers/authController');

module.exports = [
  // Rute dengan prefix /api/v1
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email(), // Email optional
          nik: Joi.string().length(16).pattern(/^\d+$/).required(), // NIK harus 16 digit angka
          password: Joi.string().min(6).required(),
          dateOfBirth: Joi.date(),
        }),
      },
      handler: authController.register,
    },
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          nik: Joi.string().length(16).pattern(/^\d+$/).required(),
          password: Joi.string().required(),
        }),
      },
      handler: authController.login,
    },
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login-email',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
      },
      handler: authController.loginWithEmail,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/auth/debug-nik',
    options: {
      auth: false,
      handler: authController.debugNIK,
    },
  },
  {
    method: 'PUT',
    path: '/api/v1/auth/update-nik',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          userId: Joi.string().uuid().required(),
          newNIK: Joi.string().length(16).pattern(/^\d+$/).required(),
        }),
      },
      handler: authController.updateUserNIK,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/auth/profile',
    options: {
      auth: 'jwt',
      handler: authController.getProfile,
    },
  },
  {
    method: 'PUT',
    path: '/api/v1/auth/profile',
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string(),
          dateOfBirth: Joi.date(),
        }),
      },
      handler: authController.updateProfile,
    },
  },
];
