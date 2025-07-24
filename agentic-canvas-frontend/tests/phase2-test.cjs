// tests/phase2-test.js
const axios = require('axios');

const ADD_URL = 'http://localhost:3001/add-text';
const CLEAR_URL = 'http://localhost:3001/clear';
const REMOVE_URL = 'http://localhost:3001/remove-element';

async function runTest() {
  console.log('--- Running Phase 2 Test ---');

  try {
    // 1. Test: Send an ADD_ELEMENT command
    console.log('\n[Test 1/3] Sending ADD_ELEMENT command...');
    let response = await axios.post(ADD_URL);
    console.log('Server response:', response.data);
    if (response.status !== 200) throw new Error('ADD_ELEMENT test failed');

    // 2. Test: Send a CLEAR_CANVAS command
    console.log('\n[Test 2/3] Sending CLEAR_CANVAS command...');
    response = await axios.post(CLEAR_URL);
    console.log('Server response:', response.data);
    if (response.status !== 200) throw new Error('CLEAR_CANVAS test failed');
    
    // 3. Test: Send an invalid command to an endpoint requiring a body
    console.log('\n[Test 3/3] Sending an invalid request (missing body)...');
    try {
        // This endpoint expects a body with an 'id', so sending nothing should fail.
        await axios.post(REMOVE_URL, {});
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log('Server correctly rejected invalid request with status 400.');
        } else {
            throw new Error('Invalid command test failed. Server did not respond as expected.');
        }
    }


    console.log('\n--- Phase 2 Test Completed Successfully ---\n');

  } catch (error) {
    console.error('\n--- Phase 2 Test Failed ---');
    if (error.response) {
      console.error('Error response from server:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
        console.error('Error: Connection refused. Is the test server running? (node test-server.cjs)');
    } 
    else {
      console.error('An unexpected error occurred:', error.message);
    }
    process.exit(1); // Exit with error code
  }
}

runTest();

