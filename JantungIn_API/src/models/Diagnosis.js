'use strict';

const { DataTypes } = require('sequelize');
const { sequelize, dynamoDB, useDynamoDB } = require('../config/database');
const User = require('./User');
const { v4: uuidv4 } = require('uuid');

let Diagnosis;

if (!useDynamoDB) {
  // Sequelize model definition (for MySQL/PostgreSQL)
  Diagnosis = sequelize.define('Diagnosis', {
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
  });

  // Definisi relasi
  User.hasMany(Diagnosis, { foreignKey: 'userId' });
  Diagnosis.belongsTo(User, { foreignKey: 'userId' });
} else {
  // DynamoDB model wrapper
  Diagnosis = {
    // Create a new diagnosis
    create: async function (diagnosisData) {
      const id = uuidv4();

      const params = {
        TableName: 'Diagnoses',
        Item: {
          id,
          userId: diagnosisData.userId,
          age: diagnosisData.age,
          sex: diagnosisData.sex,
          chestPainType: diagnosisData.chestPainType,
          restingEcgResults: diagnosisData.restingEcgResults,
          fastingBloodSugar: diagnosisData.fastingBloodSugar,
          restingBloodPressure: diagnosisData.restingBloodPressure,
          maximumHeartRate: diagnosisData.maximumHeartRate,
          exerciseInducedAngina: diagnosisData.exerciseInducedAngina,
          stSegment: diagnosisData.stSegment,
          majorVessels: diagnosisData.majorVessels,
          thalassemia: diagnosisData.thalassemia,
          serumCholesterol: diagnosisData.serumCholesterol,
          stDepression: diagnosisData.stDepression,
          resultPercentage: diagnosisData.resultPercentage,
          cardiovascularRisk: diagnosisData.cardiovascularRisk,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ConditionExpression: 'attribute_not_exists(id)',
      };

      await dynamoDB.put(params).promise();

      return params.Item;
    },

    // Find a diagnosis by ID
    findOne: async function (options) {
      if (options.where && options.where.id) {
        const params = {
          TableName: 'Diagnoses',
          Key: {
            id: options.where.id,
          },
        };

        const result = await dynamoDB.get(params).promise();
        return result.Item || null;
      } else if (options.where && options.where.userId && options.where.id) {
        // Find specific diagnosis for a user
        const params = {
          TableName: 'Diagnoses',
          KeyConditionExpression: 'id = :id',
          FilterExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':id': options.where.id,
            ':userId': options.where.userId,
          },
        };

        const result = await dynamoDB.query(params).promise();
        return result.Items && result.Items.length > 0 ? result.Items[0] : null;
      }

      throw new Error('Must provide id or both userId and id in where clause');
    },

    // Find all diagnoses for a specific user
    findAll: async function (options) {
      if (options.where && options.where.userId) {
        const params = {
          TableName: 'Diagnoses',
          IndexName: 'UserIdIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': options.where.userId,
          },
        };

        const result = await dynamoDB.query(params).promise();
        return result.Items || [];
      }

      // Get all diagnoses if no filter is specified
      if (!options.where) {
        const params = {
          TableName: 'Diagnoses',
        };

        const result = await dynamoDB.scan(params).promise();
        return result.Items || [];
      }

      throw new Error('Unsupported query parameters');
    },
  };
}

module.exports = Diagnosis;
