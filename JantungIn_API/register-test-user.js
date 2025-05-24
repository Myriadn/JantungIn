'use strict';

require('dotenv').config();
const { sequelize } = require('./src/config/database');
const { User } = require('./src/models');
const bcrypt = require('bcrypt');

async function registerUser() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Create a unique user
    const timestamp = Date.now();
    const testNIK = '3507261401980099';
    const email = `user${timestamp}@example.com`;
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Encrypt NIK
    const encryptedNIK = User.encryptNIK(testNIK);
    console.log(`Original NIK: ${testNIK}`);
    console.log(`Encrypted NIK: ${encryptedNIK}`);
    
    // Verify encryption works
    const decryptedNIK = User.decryptNIK(encryptedNIK);
    console.log(`Decrypted NIK: ${decryptedNIK}`);
    console.log(`Encryption test passed: ${decryptedNIK === testNIK}`);

    // Create the user
    console.log(`Creating user with email: ${email} and NIK: ${testNIK}`);
    
    const user = await User.create({
      name: 'Test User',
      email: email,
      nik_encrypted: encryptedNIK,
      password: hashedPassword,
      role: 'user',
    });
    
    console.log('User created successfully:');
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`NIK (use this to login): ${testNIK}`);
    console.log(`Password: password123`);
    
    // Verify the user was created correctly
    const retrievedUser = await User.findByPk(user.id, {
      scope: 'withNIK'
    });
    
    if (retrievedUser) {
      console.log('\nUser successfully retrieved from database:');
      console.log(`Retrieved NIK encrypted: ${retrievedUser.nik_encrypted}`);
      
      const retrievedDecryptedNIK = retrievedUser.getNIK();
      console.log(`Retrieved NIK decrypted: ${retrievedDecryptedNIK}`);
      console.log(`NIK verification: ${retrievedDecryptedNIK === testNIK ? 'Success' : 'Failed'}`);
    } else {
      console.log('Failed to retrieve user from database');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

registerUser();
