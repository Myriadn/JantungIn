# JantungIn API Testing Guide

This document provides instructions for testing the JantungIn API and verifying that all endpoints are working as expected.

## Prerequisites

Before running the tests, make sure:

1. The JantungIn API server is running on `http://localhost:3000`
2. The database is properly set up and connected
3. Node.js is installed on your system

## Available Test Scripts

The repository contains several test scripts to help verify different aspects of the API:

### 1. Basic API Documentation Access Test (`test-api.js`)

Tests that the API documentation is accessible through various URLs.

```bash
node test-api.js
```

### 2. Single Endpoint Test (`test-endpoint.js`)

Tests a single endpoint to verify basic server functionality.

```bash
node test-endpoint.js
```

### 3. Comprehensive Endpoint Test (`test-all-endpoints.js`)

Tests all major endpoints in the API, including:

- Documentation endpoints
- Health check endpoint
- Authentication endpoints (register, login, profile)
- Diagnosis endpoints (create, history, details)
- Admin endpoints (login, profile, patients list, dashboard)

```bash
node test-all-endpoints.js
```

## Running the Comprehensive Test

To run a full test of all major endpoints:

1. Start the JantungIn API server:

   ```bash
   npm run dev
   ```

2. In a separate terminal, run the comprehensive test:

   ```bash
   node test-all-endpoints.js
   ```

3. Review the test results in the console.

## Customizing the Test

You can modify the test data in `test-all-endpoints.js` to match your environment:

- `testUser`: User credentials for registration and login tests
- `testAdmin`: Admin credentials for admin endpoint tests
- `testDiagnosis`: Sample diagnosis data for testing diagnosis creation

## Manual Testing with Postman

For more detailed testing, you can use the provided Postman collection:

1. Open Postman
2. Import the collection from `postman/JantungIn APi.postman_collection.json`
3. Import the environment variables from `postman/JantungIn Variabel.postman_environment.json`
4. Run the requests manually or use Postman's Collection Runner

## Notes on Failed Tests

If some tests fail, check the following:

1. Server is running and accessible
2. Database is properly connected
3. Required dependencies are installed
4. Environment variables are correctly set
5. Admin account exists in the database

For admin endpoint tests, you may need to adjust the admin credentials in the test file to match an existing admin account in your database.

## Troubleshooting

- **Authentication Failures**: Check that JWT secret is properly configured
- **Database Errors**: Verify database connection settings
- **404 Errors**: Ensure routes are correctly registered
- **500 Errors**: Check server logs for detailed error messages
