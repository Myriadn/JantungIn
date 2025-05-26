'use strict';

const Joi = require('@hapi/joi');
const diagnosisController = require('../controllers/diagnosisController');

module.exports = [
  {
    method: 'POST',
    path: '/api/diagnosis',
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
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
    },
  },
  {
    method: 'GET',
    path: '/api/diagnosis/{id}',
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
    path: '/api/diagnosis/history',
    options: {
      auth: 'jwt',
      handler: diagnosisController.getUserDiagnoses,
    },
  },
];
