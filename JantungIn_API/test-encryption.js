'use strict';

const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Use the DATABASE_URL from .env
require('dotenv').config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Simple test to verify our encryption/decryption logic
async function testEncryptionDecryption() {
  console.log('TESTING ENCRYPTION/DECRYPTION LOGIC');
  
  // Define encryption key
  const encryptionKey = process.env.ENCRYPTION_KEY || 'fallback_encryption_key_for_development';
  console.log(`Using encryption key (first 5 chars): ${encryptionKey.substring(0, 5)}...`);
  
  // NIK to test
  const testNIK = '3507261401980001';
  console.log(`Original NIK: ${testNIK}`);
  
  // Encryption function
  const encrypt = (text) => {
    const algorithm = 'aes-256-cbc';
    
    // Ensure key is the right length for AES-256
    let keyStr = encryptionKey;
    if (keyStr.length < 32) {
      keyStr = keyStr.padEnd(32, '0');
    } else if (keyStr.length > 32) {
      keyStr = keyStr.substring(0, 32);
    }
    
    const key = Buffer.from(keyStr, 'utf-8');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  };
  
  // Decryption function
  const decrypt = (encryptedText) => {
    const algorithm = 'aes-256-cbc';
    
    // Ensure key is the right length for AES-256
    let keyStr = encryptionKey;
    if (keyStr.length < 32) {
      keyStr = keyStr.padEnd(32, '0');
    } else if (keyStr.length > 32) {
      keyStr = keyStr.substring(0, 32);
    }
    
    const key = Buffer.from(keyStr, 'utf-8');
    const textParts = encryptedText.split(':');
    
    if (textParts.length !== 2) {
      throw new Error('Invalid encrypted format');
    }
    
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedData = Buffer.from(textParts[1], 'hex');
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData);
    decrypted += decipher.final('utf8');
    
    return decrypted;
  };
  
  // Test encryption
  const encrypted = encrypt(testNIK);
  console.log(`Encrypted: ${encrypted}`);
  
  // Test decryption
  const decrypted = decrypt(encrypted);
  console.log(`Decrypted: ${decrypted}`);
  
  // Verify
  console.log(`Verification: ${decrypted === testNIK ? 'SUCCESS' : 'FAILED'}`);
}

// Run test function
async function runTest() {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection successful.');
    
    // Test encryption/decryption
    await testEncryptionDecryption();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close connection
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

runTest();
