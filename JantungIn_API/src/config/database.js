'use strict';

const { Sequelize } = require('sequelize');
const AWS = require('aws-sdk');
require('dotenv').config();

// Check if we should use DynamoDB (for production) or MySQL/PostgreSQL (for development)
const useDynamoDB = process.env.USE_DYNAMODB === 'true';

// Configure SQL database (MySQL or PostgreSQL)
const sequelize = useDynamoDB
  ? null
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT || 'mysql', // Use MySQL by default, can be changed to postgres
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production',
      },
    });

// Configure DynamoDB
let dynamoDB = null;
if (useDynamoDB) {
  AWS.config.update({
    region: process.env.AWS_REGION || 'ap-southeast-1', // Default to Asia Pacific (Singapore)
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // Create DynamoDB client
  dynamoDB = new AWS.DynamoDB.DocumentClient();
}

// Test the database connection
const testConnection = async () => {
  if (useDynamoDB) {
    try {
      // Test DynamoDB connection by listing tables
      const dynamoDBClient = new AWS.DynamoDB();
      await dynamoDBClient.listTables().promise();
      console.log('DynamoDB connection established successfully.');
    } catch (error) {
      console.error('Unable to connect to DynamoDB:', error);
      process.exit(1);
    }
  } else {
    try {
      // Test SQL database connection
      await sequelize.authenticate();
      console.log('SQL Database connection established successfully.');
    } catch (error) {
      console.error('Unable to connect to the SQL database:', error);
      process.exit(1);
    }
  }
};

// Create DynamoDB tables if they don't exist
const createDynamoDBTables = async () => {
  if (!useDynamoDB) return;

  const dynamoDBClient = new AWS.DynamoDB();

  // Check if Users table exists
  try {
    await dynamoDBClient.describeTable({ TableName: 'Users' }).promise();
  } catch (error) {
    if (error.code === 'ResourceNotFoundException') {
      // Create Users table
      const usersParams = {
        TableName: 'Users',
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'email', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'EmailIndex',
            KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
          },
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      };

      await dynamoDBClient.createTable(usersParams).promise();
      console.log('Users table created successfully.');
    }
  }

  // Check if Diagnoses table exists
  try {
    await dynamoDBClient.describeTable({ TableName: 'Diagnoses' }).promise();
  } catch (error) {
    if (error.code === 'ResourceNotFoundException') {
      // Create Diagnoses table
      const diagnosesParams = {
        TableName: 'Diagnoses',
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'userId', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'UserIdIndex',
            KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
          },
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      };

      await dynamoDBClient.createTable(diagnosesParams).promise();
      console.log('Diagnoses table created successfully.');
    }
  }
};

// Initialize database
const initializeDatabase = async () => {
  await testConnection();

  if (useDynamoDB) {
    await createDynamoDBTables();
  } else {
    // Sync SQL database models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
  }
};

module.exports = {
  sequelize,
  dynamoDB,
  useDynamoDB,
  testConnection,
  initializeDatabase,
};
