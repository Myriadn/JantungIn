'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

// Sequelize model definition for PostgreSQL
const Diagnosis = sequelize.define('Diagnosis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true, // Bisa null untuk backward compatibility
    references: {
      model: User,
      key: 'id',
    },
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chestPainType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  restingEcgResults: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fastingBloodSugar: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  restingBloodPressure: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  maximumHeartRate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  exerciseInducedAngina: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stSegment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  majorVessels: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  thalassemia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serumCholesterol: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stDepression: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  resultPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cardiovascularRisk: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prediction: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Berisiko', // Default value untuk backward compatibility
  },
});

// Definisi relasi
User.hasMany(Diagnosis, { foreignKey: 'userId', as: 'patientDiagnoses' });
Diagnosis.belongsTo(User, { foreignKey: 'userId', as: 'patient' });

// Relasi untuk pembuat diagnosis (dokter/admin)
User.hasMany(Diagnosis, { foreignKey: 'createdBy', as: 'createdDiagnoses' });
Diagnosis.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = Diagnosis;
