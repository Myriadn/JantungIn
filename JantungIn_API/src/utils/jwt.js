'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d'; // Default 1 day if not specified

// Generate token untuk user
const generateToken = (userData) => {
  // Handle case when userData is already in the right format or is a model instance
  const payload = {
    id: userData.id,
    email: userData.email || '',
    name: userData.name || '',
    role: userData.role || 'user',
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Verifikasi token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error.message);

    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired, please login again');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token format');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
