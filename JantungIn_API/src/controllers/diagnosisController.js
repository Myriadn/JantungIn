'use strict';

const Boom = require('@hapi/boom');
const { Diagnosis } = require('../models');
const { predictCardiovascularDisease } = require('../services/predictionService');

const createDiagnosis = async (request, h) => {
  try {
    const { id: creatorId, role } = request.auth.credentials;
    const { patientId, ...diagnosisData } = request.payload;

    // Tentukan userId berdasarkan peran
    // Jika admin/dokter, gunakan patientId dari payload
    // Jika user biasa, gunakan userId dari token (tidak bisa diagnose orang lain)
    let userId = creatorId;

    if (role === 'admin' || role === 'dokter') {
      if (patientId) {
        userId = patientId;
      }
    } else if (patientId && patientId !== creatorId) {
      // User biasa mencoba diagnosa orang lain
      return Boom.forbidden('Anda tidak memiliki izin untuk mendiagnosa pasien lain');
    } // Prediksi penyakit jantung dari service
    const { resultPercentage, cardiovascularRisk, prediction } =
      await predictCardiovascularDisease(diagnosisData);

    // Simpan data diagnosis dan hasil prediksi
    const diagnosis = await Diagnosis.create({
      userId,
      createdBy: creatorId, // Tambahkan field createdBy untuk tracking siapa yang buat
      ...diagnosisData,
      resultPercentage,
      cardiovascularRisk,
      prediction,
    });

    return h
      .response({
        statusCode: 201,
        message: 'Diagnosis created successfully',
        data: {
          id: diagnosis.id,
          userId,
          resultPercentage,
          cardiovascularRisk,
          createdAt: diagnosis.createdAt || new Date().toISOString(),
        },
      })
      .code(201);
  } catch (error) {
    console.error('Error creating diagnosis:', error);
    return Boom.badImplementation('Error creating diagnosis');
  }
};

const getDiagnosisById = async (request, h) => {
  try {
    const { id } = request.params;
    const { id: userId, role } = request.auth.credentials;

    // Buat query berdasarkan peran
    const query = { where: { id } };

    // Jika bukan admin/dokter, batasi hanya melihat diagnosis sendiri
    if (role !== 'admin' && role !== 'dokter') {
      query.where.userId = userId;
    }

    const diagnosis = await Diagnosis.findOne(query);

    if (!diagnosis) {
      return Boom.notFound('Diagnosis not found');
    }

    return h.response({
      statusCode: 200,
      message: 'Diagnosis retrieved successfully',
      data: diagnosis,
    });
  } catch (error) {
    console.error('Error retrieving diagnosis:', error);
    return Boom.badImplementation('Error retrieving diagnosis');
  }
};

const getUserDiagnoses = async (request, h) => {
  try {
    const { id: userId, role } = request.auth.credentials;
    const { patientId } = request.query;

    // Buat query berdasarkan peran
    const query = { order: [['createdAt', 'DESC']] };

    // Jika admin/dokter dan ada patientId yang diberikan, lihat diagnosis pasien tersebut
    if ((role === 'admin' || role === 'dokter') && patientId) {
      query.where = { userId: patientId };
    } else {
      // Jika user biasa atau admin/dokter tanpa patientId, lihat diagnosis sendiri
      query.where = { userId };
    }

    // For PostgreSQL with Sequelize
    const diagnoses = await Diagnosis.findAll(query);

    return h.response({
      statusCode: 200,
      message: 'Diagnoses retrieved successfully',
      data: diagnoses,
    });
  } catch (error) {
    console.error('Error retrieving diagnoses:', error);
    return Boom.badImplementation('Error retrieving diagnoses');
  }
};

// Mendapatkan semua diagnosis (hanya untuk admin/dokter)
const getAllDiagnoses = async (request, h) => {
  try {
    // For PostgreSQL with Sequelize
    const diagnoses = await Diagnosis.findAll({
      order: [['createdAt', 'DESC']],
    });

    return h.response({
      statusCode: 200,
      message: 'All diagnoses retrieved successfully',
      data: diagnoses,
    });
  } catch (error) {
    console.error('Error retrieving all diagnoses:', error);
    return Boom.badImplementation('Error retrieving all diagnoses');
  }
};

module.exports = {
  createDiagnosis,
  getDiagnosisById,
  getUserDiagnoses,
  getAllDiagnoses,
};
