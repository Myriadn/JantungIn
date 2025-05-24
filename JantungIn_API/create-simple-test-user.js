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

    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (masked)' : 'Not set');

    // Create a unique email to avoid conflicts
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    // Test NIK
    const testNIK = '3507261401980001';
    const encryptedNIK = User.encryptNIK(testNIK);
    console.log(`Test NIK: ${testNIK}`);
    console.log(`Encrypted NIK: ${encryptedNIK}`);
    
    // Create user
    console.log(`Creating test user with email: ${uniqueEmail}`);
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const testUser = await User.create({
        name: 'Test User',
        email: uniqueEmail,
        nik_encrypted: encryptedNIK,
        password: hashedPassword,
        role: 'user',
      });
      
      console.log('User created successfully:');
      console.log(`ID: ${testUser.id}`);
      console.log(`Email: ${testUser.email}`);
      console.log(`NIK (encrypted): ${testUser.nik_encrypted}`);
    } catch (createError) {
      console.error('Error creating user:', createError.message);
      if (createError.name === 'SequelizeUniqueConstraintError') {
        console.error('Duplicate entry. This NIK or email may already exist in the database.');
      }
      throw createError;
    }

    // List all users to verify
    console.log('\nVerifying users in database...');
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    
    console.log(`Found ${users.length} users in database`);
    if (users.length > 0) {
      console.table(users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      })));
    }

  } catch (error) {
    console.error('Fatal error:', error);
    if (error.parent) {
      console.error('Parent error:', error.parent);
    }
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

createTestUser();
