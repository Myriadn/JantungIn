'use strict';

// Script to check required environment variables before starting the app
const requiredEnvVars = ['JWT_SECRET', 'JWT_EXPIRATION', 'ENCRYPTION_KEY'];

const productionOnlyVars = [
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_PORT',
  'ALLOWED_ORIGINS',
];

// Check for required env vars in all environments
const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

// Check for production-only vars if in production
const missingProdVars =
  process.env.NODE_ENV === 'production'
    ? productionOnlyVars.filter((envVar) => !process.env[envVar])
    : [];

// Combine missing vars
const allMissingVars = [...missingVars, ...missingProdVars];

if (allMissingVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', '⚠️ Environment validation failed!');
  console.error(
    '\x1b[31m%s\x1b[0m',
    `Missing required environment variables: ${allMissingVars.join(', ')}`
  );

  if (process.env.NODE_ENV === 'production') {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Production environment requires all variables to be set. Exiting...'
    );
    process.exit(1);
  } else {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      'Development environment: Using default values for missing variables.'
    );

    // Set default values for development
    if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'dev_jwt_secret_for_testing_only';
    if (!process.env.JWT_EXPIRATION) process.env.JWT_EXPIRATION = '1d';
    if (!process.env.ENCRYPTION_KEY)
      process.env.ENCRYPTION_KEY = 'dev-encryption-key-32-chars-long!';
  }
} else {
  console.log('\x1b[32m%s\x1b[0m', '✅ Environment validation passed!');
}

// Warn about sensitive data in non-production
if (process.env.NODE_ENV !== 'production') {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '⚠️ Running in development mode. Do not use with real patient data!'
  );
}
