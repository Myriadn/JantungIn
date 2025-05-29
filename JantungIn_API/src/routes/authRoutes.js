'use strict';

const Joi = require('@hapi/joi');
const authController = require('../controllers/authController');

module.exports = [
  // Rute dengan prefix /api
  {
    method: 'POST',
    path: '/api/auth/register',
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
  // Rute alternatif tanpa prefix /api
  {
    method: 'POST',
    path: '/auth/register',
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
  }, // Rute dengan prefix /api
  {
    method: 'POST',
    path: '/api/auth/login',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          nik: Joi.string().length(16).pattern(/^\d+$/).required(), // Login dengan NIK
          password: Joi.string().required(),
        }),
      },
      handler: authController.login,
    },
  },
  // Rute alternatif tanpa prefix /api
  {
    method: 'POST',
    path: '/auth/login',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          nik: Joi.string().length(16).pattern(/^\d+$/).required(), // Login dengan NIK
          password: Joi.string().required(),
        }),
      },
      handler: authController.login,
    },
  }, // Login dengan email (fallback) dengan prefix /api
  {
    method: 'POST',
    path: '/api/auth/login-email',
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
  }, // Debugging endpoint untuk NIK
  {
    method: 'GET',
    path: '/api/auth/debug-nik',
    options: {
      auth: false,
      handler: authController.debugNIK,
    },
  },
  // Update NIK endpoint
  {
    method: 'PUT',
    path: '/api/auth/update-nik',
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
  // Rute alternatif tanpa prefix /api
  {
    method: 'GET',
    path: '/auth/profile',
    options: {
      auth: 'jwt',
      handler: authController.getProfile,
    },
  },
  // Rute dengan prefix /api
  {
    method: 'PUT',
    path: '/api/auth/profile',
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
  // Rute alternatif tanpa prefix /api
  {
    method: 'PUT',
    path: '/auth/profile',
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
