'use strict';

require('dotenv').config();
const { sequelize } = require('./src/config/database');
const { User } = require('./src/models');
const bcrypt = require('bcrypt');

async function createTestUser() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Test the encryption function
    const testNIK = '3507261401980001';
    const encryptedNIK = User.encryptNIK(testNIK);
    console.log(`Test NIK: ${testNIK}`);
    console.log(`Encrypted NIK: ${encryptedNIK}`);
    
    const decryptedNIK = User.decryptNIK(encryptedNIK);
    console.log(`Decrypted NIK: ${decryptedNIK}`);
    console.log(`Encryption/Decryption test passed: ${decryptedNIK === testNIK}`);

    // Create a test user
    console.log('\nCreating test user...');
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      nik_encrypted: encryptedNIK,
      password: hashedPassword,
      role: 'user',
    });

    console.log(`Test user created with ID: ${testUser.id}`);
    console.log(`Name: ${testUser.name}`);
    console.log(`Email: ${testUser.email}`);
    console.log(`Password (hashed): ${hashedPassword.substring(0, 10)}...`);
    console.log(`NIK (encrypted): ${encryptedNIK}`);
    console.log(`Role: ${testUser.role}`);

    // Verify the user was created and can be retrieved
    console.log('\nVerifying user can be retrieved...');
    const retrievedUser = await User.findByPk(testUser.id, {
      scope: 'withNIK'
    });

    if (retrievedUser) {
      console.log('User successfully retrieved from database');
      console.log(`Encrypted NIK from database: ${retrievedUser.nik_encrypted}`);
      
      const decryptedNIKFromDB = retrievedUser.getNIK();
      console.log(`Decrypted NIK from database: ${decryptedNIKFromDB}`);
      console.log(`NIK verification passed: ${decryptedNIKFromDB === testNIK}`);
    } else {
      console.log('Failed to retrieve user from database');
    }

    // Create an admin user
    console.log('\nCreating admin user...');
    const adminPassword = 'admin123';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminTestNIK = '3507261401980002';
    const encryptedAdminNIK = User.encryptNIK(adminTestNIK);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      nik_encrypted: encryptedAdminNIK,
      password: hashedAdminPassword,
      role: 'admin',
    });

    console.log(`Admin user created with ID: ${adminUser.id}`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`NIK (encrypted): ${encryptedAdminNIK}`);
    console.log(`Role: ${adminUser.role}`);

    // List all users to verify
    console.log('\nListing all users...');
    const allUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    
    console.table(allUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })));

  } catch (error) {
    console.error('Error:', error);
    console.error(error.stack);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

createTestUser();
