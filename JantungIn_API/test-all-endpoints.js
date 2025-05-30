// test-all-endpoints.js
// Comprehensive test for JantungIn API endpoints
const axios = require('axios');

// Configure axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  validateStatus: () => true, // Always return promise (no rejections)
});

// Test data
const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  nik: '1234567890123456',
  password: 'password123',
  dateOfBirth: '1990-01-01',
};

const testAdmin = {
  username: 'admin',
  password: 'admin123',
};

const testDiagnosis = {
  age: 45,
  sex: 'Male',
  chestPainType: 'Typical Angina',
  restingEcgResults: 'Normal',
  fastingBloodSugar: 120,
  restingBloodPressure: 130,
  maximumHeartRate: 150,
  exerciseInducedAngina: 'Yes',
  stSegment: 'Upsloping',
  majorVessels: 2,
  thalassemia: 'Normal',
  serumCholesterol: 210,
  stDepression: 0.5,
};

// Global variables to store data between tests
let userToken = '';
let adminToken = '';
let diagnosisId = '';

/**
 * Log the response in a formatted way
 */
function logResponse(endpoint, response, startTime) {
  const duration = Date.now() - startTime;
  const status = response.status;
  const statusText = response.statusText;

  // Determine if the test passed based on status code
  const isPassed = status >= 200 && status < 400;
  const resultSymbol = isPassed ? '✅' : '❌';

  console.log(`\n${resultSymbol} ${endpoint}`);
  console.log(`Status: ${status} ${statusText} (${duration}ms)`);

  // Log a truncated response if it exists
  if (response.data) {
    const responseStr = JSON.stringify(response.data);
    console.log(
      `Response: ${responseStr.length > 100 ? responseStr.substring(0, 100) + '...' : responseStr}`
    );
  }

  return isPassed;
}

/**
 * Test documentation endpoints
 */
async function testDocEndpoints() {
  console.log('\n=== TESTING DOCUMENTATION ENDPOINTS ===');

  const docEndpoints = ['/', '/api-docs', '/docs', '/api-docs.html'];
  let passCount = 0;

  for (const endpoint of docEndpoints) {
    const startTime = Date.now();
    const response = await api.get(endpoint);

    if (logResponse(endpoint, response, startTime)) {
      passCount++;
    }
  }

  console.log(`\n${passCount}/${docEndpoints.length} documentation endpoints passed.`);
  return passCount === docEndpoints.length;
}

/**
 * Test authentication endpoints
 */
async function testAuthEndpoints() {
  console.log('\n=== TESTING AUTHENTICATION ENDPOINTS ===');
  const endpoints = [];
  let passCount = 0;

  // Register user
  let startTime = Date.now();
  let response = await api.post('/auth/register', testUser);
  if (logResponse('POST /auth/register', response, startTime)) {
    passCount++;
  }
  endpoints.push('register');

  // Login user
  startTime = Date.now();
  response = await api.post('/auth/login', {
    nik: testUser.nik,
    password: testUser.password,
  });
  if (logResponse('POST /auth/login', response, startTime)) {
    passCount++;
    if (response.data && response.data.token) {
      userToken = response.data.token;
      console.log('✅ User token received');
    }
  }
  endpoints.push('login');

  // Get profile
  if (userToken) {
    startTime = Date.now();
    response = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (logResponse('GET /auth/profile', response, startTime)) {
      passCount++;
    }
    endpoints.push('profile');

    // Update profile
    startTime = Date.now();
    response = await api.put(
      '/auth/profile',
      { name: 'Updated Test User' },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    if (logResponse('PUT /auth/profile', response, startTime)) {
      passCount++;
    }
    endpoints.push('update-profile');
  }

  console.log(`\n${passCount}/${endpoints.length} authentication endpoints passed.`);
  return passCount === endpoints.length;
}

/**
 * Test diagnosis endpoints
 */
async function testDiagnosisEndpoints() {
  console.log('\n=== TESTING DIAGNOSIS ENDPOINTS ===');
  const endpoints = [];
  let passCount = 0;

  if (!userToken) {
    console.log('❌ Cannot test diagnosis endpoints: No user token available');
    return false;
  }

  // Create diagnosis
  let startTime = Date.now();
  let response = await api.post('/api/diagnosis', testDiagnosis, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  if (logResponse('POST /api/diagnosis', response, startTime)) {
    passCount++;
    if (response.data && response.data.id) {
      diagnosisId = response.data.id;
      console.log('✅ Diagnosis ID received:', diagnosisId);
    }
  }
  endpoints.push('create-diagnosis');

  // Get diagnosis history
  startTime = Date.now();
  response = await api.get('/api/diagnosis/history', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  if (logResponse('GET /api/diagnosis/history', response, startTime)) {
    passCount++;
  }
  endpoints.push('diagnosis-history');

  // Get diagnosis by ID
  if (diagnosisId) {
    startTime = Date.now();
    response = await api.get(`/api/diagnosis/${diagnosisId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (logResponse(`GET /api/diagnosis/${diagnosisId}`, response, startTime)) {
      passCount++;
    }
    endpoints.push('diagnosis-by-id');
  }

  console.log(`\n${passCount}/${endpoints.length} diagnosis endpoints passed.`);
  return passCount === endpoints.length;
}

/**
 * Test admin endpoints (basic access only)
 */
async function testAdminEndpoints() {
  console.log('\n=== TESTING ADMIN ENDPOINTS ===');
  const endpoints = [];
  let passCount = 0;

  // Admin login
  let startTime = Date.now();
  let response = await api.post('/api/admin/login', testAdmin);
  if (logResponse('POST /api/admin/login', response, startTime)) {
    passCount++;
    if (response.data && response.data.token) {
      adminToken = response.data.token;
      console.log('✅ Admin token received');
    }
  }
  endpoints.push('admin-login');

  if (adminToken) {
    // Get admin profile
    startTime = Date.now();
    response = await api.get('/api/admin/profile', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (logResponse('GET /api/admin/profile', response, startTime)) {
      passCount++;
    }
    endpoints.push('admin-profile');

    // Get all patients
    startTime = Date.now();
    response = await api.get('/api/admin/patients', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (logResponse('GET /api/admin/patients', response, startTime)) {
      passCount++;
    }
    endpoints.push('admin-patients');

    // Get dashboard data
    startTime = Date.now();
    response = await api.get('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (logResponse('GET /api/admin/dashboard', response, startTime)) {
      passCount++;
    }
    endpoints.push('admin-dashboard');
  }

  console.log(`\n${passCount}/${endpoints.length} admin endpoints passed.`);
  return passCount === endpoints.length;
}

/**
 * Health check endpoint
 */
async function testHealthEndpoint() {
  console.log('\n=== TESTING HEALTH ENDPOINT ===');

  const startTime = Date.now();
  const response = await api.get('/health');

  const passed = logResponse('GET /health', response, startTime);
  console.log(`\n${passed ? 1 : 0}/1 health endpoint passed.`);
  return passed;
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🔍 Starting comprehensive JantungIn API endpoint tests...');
  console.log('📌 Server URL:', api.defaults.baseURL);

  let results = {
    documentation: await testDocEndpoints(),
    health: await testHealthEndpoint(),
    auth: await testAuthEndpoints(),
    diagnosis: await testDiagnosisEndpoints(),
    admin: await testAdminEndpoints(),
  };

  console.log('\n=== TEST SUMMARY ===');
  let passedCategories = 0;
  for (const [category, passed] of Object.entries(results)) {
    console.log(`${passed ? '✅' : '❌'} ${category}`);
    if (passed) passedCategories++;
  }

  const totalCategories = Object.keys(results).length;
  console.log(`\n${passedCategories}/${totalCategories} test categories passed.`);

  if (passedCategories === totalCategories) {
    console.log('\n🎉 All endpoint tests passed! The JantungIn API is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Review the output above for details.');
  }
}

// Run the tests
runAllTests().catch((error) => {
  console.error('❌ Error running tests:', error.message);
});
