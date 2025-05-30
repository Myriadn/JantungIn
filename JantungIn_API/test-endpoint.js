const axios = require('axios');

async function testEndpoint() {
  try {
    console.log('Testing endpoint http://localhost:3000/');
    const response = await axios.get('http://localhost:3000/');
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);
    console.log('Response received successfully!');
  } catch (error) {
    if (error.response) {
      console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}

testEndpoint();
