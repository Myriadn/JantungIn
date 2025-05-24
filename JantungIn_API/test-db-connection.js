'use strict';

require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  // Get the database URL from environment variables
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set in environment variables');
    return;
  }
  
  console.log('Database URL is set');
  
  // Create a new Sequelize instance
  const sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
  
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Run a simple query to verify database functionality
    const [results] = await sequelize.query('SELECT NOW() as current_time');
    console.log('Current database time:', results[0].current_time);
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('Connection closed');
  }
}

testDatabaseConnection();
