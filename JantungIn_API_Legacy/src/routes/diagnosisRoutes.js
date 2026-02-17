'use strict';

const Joi = require('@hapi/joi');
const diagnosisController = require('../controllers/diagnosisController');

module.exports = [
  {
    method: 'POST',
    path: '/api/v1/diagnosis',
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          patientId: Joi.string().uuid(), // Opsional, hanya untuk admin/dokter
          age: Joi.number().integer().required(),
          sex: Joi.string().valid('Male', 'Female').required(),
          chestPainType: Joi.string().required(),
          restingEcgResults: Joi.string().required(),
          fastingBloodSugar: Joi.number().required(),
          restingBloodPressure: Joi.number().required(),
          maximumHeartRate: Joi.number().integer().required(),
          exerciseInducedAngina: Joi.string().valid('Yes', 'No').required(),
          stSegment: Joi.string().required(),
          majorVessels: Joi.number().integer().min(0).max(3).required(),
          thalassemia: Joi.string().required(),
          serumCholesterol: Joi.number().required(),
          stDepression: Joi.number().required(),
        }),
      },
      handler: diagnosisController.createDiagnosis,
      app: {
        requiredRoles: ['admin', 'dokter'], // Hanya admin/dokter yang bisa melakukan diagnosis
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/diagnosis/{id}',
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
      handler: diagnosisController.getDiagnosisById,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/diagnosis/history',
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          patientId: Joi.string().uuid(), // Opsional, hanya untuk admin/dokter
        }).unknown(true),
      },
      handler: diagnosisController.getUserDiagnoses,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/admin/diagnosis/all',
    options: {
      auth: 'jwt',
      handler: diagnosisController.getAllDiagnoses,
      app: {
        requiredRoles: ['admin', 'dokter'], // Hanya admin/dokter yang bisa melihat semua diagnosis
        // localhostOnly: true, // Dinonaktifkan untuk presentasi
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/admin/diagnosis/patient/{patientId}',
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          patientId: Joi.string().uuid().required(),
        }),
      },
      handler: diagnosisController.getPatientDiagnoses,
      app: {
        requiredRoles: ['admin', 'dokter'], // Hanya admin/dokter yang bisa melihat diagnosis pasien
      },
    },
  },
];
