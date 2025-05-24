'use strict';

require('dotenv').config();
const { sequelize } = require('./src/config/database');
const { User } = require('./src/models');

async function inspectDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check database connection info
    console.log('\n--- DATABASE CONNECTION INFO ---');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set (masked for security)' : 'Not set');
    
    // Check what users exist in the database (with raw SQL for absolute certainty)
    console.log('\n--- ALL USERS IN DATABASE (RAW SQL) ---');
    const [rawUsers] = await sequelize.query('SELECT * FROM "Users"');
    console.log(`Found ${rawUsers.length} users with raw SQL query`);
    if (rawUsers.length > 0) {
      // Only show safe fields, not passwords or encrypted data
      const safeUsers = rawUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        hasNikEncrypted: user.nik_encrypted ? 'Yes' : 'No',
        hasPassword: user.password ? 'Yes' : 'No'
      }));
      console.table(safeUsers);
    }

    // Try to get users with NIK
    console.log('\n--- USERS WITH NIK (SEQUELIZE) ---');
    const usersWithNik = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'nik_encrypted'],
      scope: 'withNIK',
    });

    console.log(`Found ${usersWithNik.length} users with Sequelize query (withNIK scope)`);
    
    for (const user of usersWithNik) {
      console.log(`User ID: ${user.id}, Name: ${user.name}, Has NIK: ${user.nik_encrypted ? 'Yes' : 'No'}`);
      if (user.nik_encrypted) {
        const decryptedNik = user.getNIK();
        console.log(`  Decrypted NIK: ${decryptedNik || 'Failed to decrypt'}`);
      }
    }

    // Check if database has the right tables and columns
    console.log('\n--- DATABASE STRUCTURE ---');
    const [userTableInfo] = await sequelize.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'Users\'');
    console.table(userTableInfo);

  } catch (error) {
    console.error('Error:', error);
    console.error(error.stack);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

inspectDatabase();

inspectDatabase();
