'use strict';

const {
  sequelize,
  dynamoDB,
  useDynamoDB,
  testConnection,
  initializeDatabase,
} = require('../config/database');
const User = require('./User');
const Diagnosis = require('./Diagnosis');

// For SQL databases only
const syncDatabase = async (force = false) => {
  if (useDynamoDB) {
    console.log('Using DynamoDB, no need to sync models');
    return;
  }

  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  dynamoDB,
  useDynamoDB,
  testConnection,
  initializeDatabase,
  syncDatabase,
  User,
  Diagnosis,
};
