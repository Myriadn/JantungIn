'use strict';

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configure PostgreSQL database using connection URL for Supabase
const DATABASE_URL = process.env.DATABASE_URL;

console.log('Attempting to connect to database');

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    match: [
      /ConnectionError/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /SequelizeConnectionAcquireTimeoutError/,
      /ECONNRESET/,
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ENOTFOUND/,
    ],
    max: 5,
  },
});

// Test the database connection
const testConnection = async () => {
  try {
    // Test PostgreSQL database connection
    await sequelize.authenticate();
    console.log('PostgreSQL Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
    process.exit(1);
  }
};

// Initialize database
const initializeDatabase = async () => {
  await testConnection();

  // Sync PostgreSQL database models
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
};

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase,
};
