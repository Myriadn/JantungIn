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
          email: Joi.string().email().required(),
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
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
          dateOfBirth: Joi.date(),
        }),
      },
      handler: authController.register,
    },
  },
  // Rute dengan prefix /api
  {
    method: 'POST',
    path: '/api/auth/login',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
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
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
      },
      handler: authController.login,
    },
  },
  // Rute dengan prefix /api
  {
    method: 'GET',
    path: '/api/auth/profile',
    options: {
      auth: 'jwt',
      handler: authController.getProfile,
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
