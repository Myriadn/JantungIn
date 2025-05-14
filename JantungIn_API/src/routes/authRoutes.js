'use strict';

const Joi = require('@hapi/joi');
const authController = require('../controllers/authController');

module.exports = [
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
  {
    method: 'GET',
    path: '/api/auth/profile',
    options: {
      auth: 'jwt',
      handler: authController.getProfile,
    },
  },
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
];
