'use strict';

const { sequelize, testConnection } = require('../config/database');
const User = require('./user');
const Diagnosis = require('./diagnosis');

const syncDatabase = async (force = false) => {
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
  testConnection,
  syncDatabase,
  User,
  Diagnosis,
};
