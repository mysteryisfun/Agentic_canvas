// tests/test-runner.cjs
const axios = require('axios');

const SERVER_URL = 'http://localhost:3001/command';

// Simple sleep function to pause between commands
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
  console.log('--- Running Phase 3 Test ---');

  try {
    // 1. Clear the canvas to start fresh
    console.log('\n[Test 1/3] Clearing the canvas...');
    await axios.post(SERVER_URL, { command: 'CLEAR_CANVAS', payload: null });
    console.log('Canvas cleared.');
    await sleep(1000); // Wait 1 second

    // 2. Add a text element
    console.log('\n[Test 2/3] Sending ADD_ELEMENT command for TEXT...');
    const textCommand = {
      command: 'ADD_ELEMENT',
      payload: {
        id: `text-${Date.now()}`,
        type: 'text',
        content: 'This is a dynamically rendered text block.',
        position: { x: 50, y: 50 },
        size: { width: 250, height: 60 }
      }
    };
    let response = await axios.post(SERVER_URL, textCommand);
    console.log('Server response:', response.data.message);
    if (response.status !== 200) throw new Error('ADD_ELEMENT (text) test failed');
    
    await sleep(3000); // Wait 3 seconds to see the text

    // 3. Add an image element
    console.log('\n[Test 3/3] Sending ADD_ELEMENT command for IMAGE...');
    const imageCommand = {
        command: 'ADD_ELEMENT',
        payload: {
          id: `image-${Date.now()}`,
          type: 'image',
          // Using a reliable placeholder image service
          content: 'https://via.placeholder.com/300x150.png?text=Dynamic+Image',
          position: { x: 50, y: 150 },
          size: { width: 300, height: 150 }
        }
      };
    response = await axios.post(SERVER_URL, imageCommand);
    console.log('Server response:', response.data.message);
    if (response.status !== 200) throw new Error('ADD_ELEMENT (image) test failed');

    console.log('\n--- Phase 3 Test Completed Successfully ---');
    console.log('Check the browser to see the text and image elements.');

  } catch (error) {
    console.error('\n--- Phase 3 Test Failed ---');
    if (error.response) {
      console.error('Error response from server:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
        console.error('Error: Connection refused. Is the test server running? (node test-server.js)');
    } else {
      console.error('An unexpected error occurred:', error.message);
    }
    process.exit(1);
  }
}

runTest();
