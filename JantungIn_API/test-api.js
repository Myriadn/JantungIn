const axios = require('axios');

async function testEndpoints() {
  const baseUrl = 'http://localhost:3000';
  const endpoints = ['/', '/api-docs', '/docs', '/api-docs.html'];

  console.log('Testing API documentation access:');

  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting ${baseUrl}${endpoint}`);
      const response = await axios.get(`${baseUrl}${endpoint}`);
      console.log(`✅ Status: ${response.status} - ${response.statusText}`);
      console.log(`Content-Type: ${response.headers['content-type']}`);
    } catch (error) {
      if (error.response) {
        console.error(`❌ Error: ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.error(`❌ Error: ${error.message}`);
      }
    }
  }
}

testEndpoints();
