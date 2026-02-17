'use strict';

const { sequelize, testConnection, initializeDatabase } = require('../config/database');
const User = require('./User');
const Diagnosis = require('./Diagnosis');

// For SQL database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('PostgreSQL database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase,
  syncDatabase,
  User,
  Diagnosis,
};
