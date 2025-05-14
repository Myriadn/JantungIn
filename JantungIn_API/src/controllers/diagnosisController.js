'use strict';

const Boom = require('@hapi/boom');
const { Diagnosis } = require('../models');
const { predictCardiovascularDisease } = require('../services/predictionService');

const createDiagnosis = async (request, h) => {
  try {
    const { id: userId } = request.auth.credentials;
    const diagnosisData = request.payload;

    // Prediksi penyakit jantung dari service
    const { resultPercentage, cardiovascularRisk } =
      await predictCardiovascularDisease(diagnosisData);

    // Simpan data diagnosis dan hasil prediksi
    const diagnosis = await Diagnosis.create({
      userId,
      ...diagnosisData,
      resultPercentage,
      cardiovascularRisk,
    });

    return h
      .response({
        statusCode: 201,
        message: 'Diagnosis created successfully',
        data: {
          id: diagnosis.id,
          resultPercentage,
          cardiovascularRisk,
          createdAt: diagnosis.createdAt,
        },
      })
      .code(201);
  } catch (error) {
    return Boom.badImplementation('Error creating diagnosis', error);
  }
};

const getDiagnosisById = async (request, h) => {
  try {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    const diagnosis = await Diagnosis.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!diagnosis) {
      return Boom.notFound('Diagnosis not found');
    }

    return h.response({
      statusCode: 200,
      message: 'Diagnosis retrieved successfully',
      data: diagnosis,
    });
  } catch (error) {
    return Boom.badImplementation('Error retrieving diagnosis', error);
  }
};

const getUserDiagnoses = async (request, h) => {
  try {
    const { id: userId } = request.auth.credentials;

    const diagnoses = await Diagnosis.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return h.response({
      statusCode: 200,
      message: 'Diagnoses retrieved successfully',
      data: diagnoses,
    });
  } catch (error) {
    return Boom.badImplementation('Error retrieving diagnoses', error);
  }
};

module.exports = {
  createDiagnosis,
  getDiagnosisById,
  getUserDiagnoses,
};
