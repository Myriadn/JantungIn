'use strict';

const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Configure in-memory SQLite database for testing
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: console.log
});

// Encryption functions (copied from User model)
const encryptNIK = (nik) => {
  const algorithm = 'aes-256-cbc';
  
  let keyStr = 'test_encryption_key_12345678901234';
  if (keyStr.length < 32) {
    keyStr = keyStr.padEnd(32, '0');
  } else if (keyStr.length > 32) {
    keyStr = keyStr.substring(0, 32);
  }
  
  const key = Buffer.from(keyStr, 'utf-8');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(nik, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decryptNIK = (encryptedNIK) => {
  try {
    console.log(`Attempting to decrypt: ${encryptedNIK}`);
    
    if (!encryptedNIK || !encryptedNIK.includes(':')) {
      console.error(`Invalid encrypted NIK format: ${encryptedNIK}`);
      return null;
    }
    
    const algorithm = 'aes-256-cbc';
    
    let keyStr = 'test_encryption_key_12345678901234';
    if (keyStr.length < 32) {
      keyStr = keyStr.padEnd(32, '0');
    } else if (keyStr.length > 32) {
      keyStr = keyStr.substring(0, 32);
    }
    
    console.log(`Using key (first 5 chars): ${keyStr.substring(0, 5)}... (length: ${keyStr.length})`);
    
    const key = Buffer.from(keyStr, 'utf-8');
    const textParts = encryptedNIK.split(':');
    
    console.log(`IV part length: ${textParts[0].length}, Encrypted part length: ${textParts[1]?.length || 0}`);
    
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = Buffer.from(textParts[1], 'hex');
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted += decipher.final('utf8');
    
    console.log(`Successfully decrypted to: ${decrypted}`);
    return decrypted;
  } catch (error) {
    console.error(`Decryption error:`, error);
    return null;
  }
};

// Create User model
const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  nik_encrypted: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'user',
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      }
    }
  }
});

// Add NIK methods
User.prototype.getNIK = function() {
  try {
    if (this.nik_encrypted) {
      const decrypted = decryptNIK(this.nik_encrypted);
      console.log(`Decrypted NIK for user ${this.id}: ${decrypted}`);
      return decrypted;
    }
    return null;
  } catch (error) {
    console.error(`Error decrypting NIK for user ${this.id}:`, error);
    return null;
  }
};

User.verifyPassword = async function(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
};

// Test function
async function testInMemoryDatabase() {
  try {
    // Sync model with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // Test NIK encryption/decryption
    const testNIK = '3507261401980001';
    const encryptedNIK = encryptNIK(testNIK);
    console.log(`Test NIK: ${testNIK}`);
    console.log(`Encrypted NIK: ${encryptedNIK}`);
    
    const decryptedNIK = decryptNIK(encryptedNIK);
    console.log(`Decrypted NIK: ${decryptedNIK}`);
    console.log(`Encryption/Decryption test passed: ${decryptedNIK === testNIK}\n`);
    
    // Create test user
    console.log('Creating test user...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      nik_encrypted: encryptedNIK,
      password: 'password123',
      role: 'user',
    });
    
    console.log('Test user created:');
    console.log(testUser.toJSON());
    
    // Retrieve user and test NIK decryption
    console.log('\nRetrieving user from database...');
    const retrievedUser = await User.findByPk(testUser.id);
    
    if (retrievedUser) {
      console.log('User retrieved successfully');
      console.log(`User ID: ${retrievedUser.id}`);
      console.log(`Name: ${retrievedUser.name}`);
      console.log(`Email: ${retrievedUser.email}`);
      console.log(`Encrypted NIK: ${retrievedUser.nik_encrypted}`);
      
      const retrievedNIK = retrievedUser.getNIK();
      console.log(`Decrypted NIK: ${retrievedNIK}`);
      console.log(`NIK verification passed: ${retrievedNIK === testNIK}`);
    } else {
      console.log('Failed to retrieve user');
    }
    
    // Test login with NIK
    console.log('\nTesting login with NIK...');
    
    // Find all users
    const users = await User.findAll();
    console.log(`Found ${users.length} users in database`);
    
    // Find user with matching NIK
    let foundUser = null;
    for (const user of users) {
      const decryptedUserNIK = user.getNIK();
      console.log(`Comparing with user: ${user.id}, Decrypted NIK: ${decryptedUserNIK}`);
      
      if (decryptedUserNIK === testNIK) {
        foundUser = user;
        console.log(`Match found for user: ${user.id}`);
        break;
      }
    }
    
    if (foundUser) {
      console.log('Login successful');
      const isPasswordValid = await User.verifyPassword('password123', foundUser.password);
      console.log(`Password verification: ${isPasswordValid ? 'Passed' : 'Failed'}`);
    } else {
      console.log('Login failed: No user found with matching NIK');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the test
testInMemoryDatabase();
