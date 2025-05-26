'use strict';

const { DataTypes } = require('sequelize');
const { sequelize, dynamoDB, useDynamoDB } = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

let User;

if (!useDynamoDB) {
  // Sequelize model definition (for MySQL/PostgreSQL)
  User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  // Instance method untuk verifikasi password
  User.prototype.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };
} else {
  // DynamoDB model wrapper
  User = {
    // Create a new user
    create: async function (userData) {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const params = {
        TableName: 'Users',
        Item: {
          id,
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          dateOfBirth: userData.dateOfBirth,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ConditionExpression: 'attribute_not_exists(id)',
      };

      await dynamoDB.put(params).promise();

      const user = params.Item;
      delete user.password;

      return user;
    },

    // Find a user by their email
    findOne: async function (options) {
      if (options.where && options.where.email) {
        const params = {
          TableName: 'Users',
          IndexName: 'EmailIndex',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': options.where.email,
          },
        };

        const result = await dynamoDB.query(params).promise();

        if (result.Items && result.Items.length > 0) {
          const user = result.Items[0];

          // Add method to verify password
          user.verifyPassword = async function (password) {
            return bcrypt.compare(password, user.password);
          };

          return user;
        }

        return null;
      } else if (options.where && options.where.id) {
        const params = {
          TableName: 'Users',
          Key: {
            id: options.where.id,
          },
        };

        const result = await dynamoDB.get(params).promise();

        if (result.Item) {
          const user = result.Item;

          // Add method to verify password
          user.verifyPassword = async function (password) {
            return bcrypt.compare(password, user.password);
          };

          return user;
        }

        return null;
      }

      throw new Error('Must provide email or id in where clause');
    },

    // Update a user
    update: async function (user, options) {
      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.keys(user).forEach((key) => {
        if (key !== 'id' && key !== 'email') {
          // Don't update primary key or email
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = user[key];
        }
      });

      // Always update the updatedAt timestamp
      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      const params = {
        TableName: 'Users',
        Key: {
          id: options.where.id,
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      };

      const result = await dynamoDB.update(params).promise();

      return result.Attributes;
    },
  };
}
User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
