// CommonJS style for compatibility
const nodeFetch = require('node-fetch');

// Test configuration
const baseUrl = 'http://localhost:3000'; // Backend URL
const frontendOrigin = 'http://localhost:5173'; // Frontend Origin

const endpoints = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/refresh-token',
  '/api/auth/resend-verification',
  '/api/auth/verify-email/test-token'
];

async function testCors() {
  console.log('Testing CORS configuration...\n');
  
  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint}`;
    
    try {
      // First do an OPTIONS preflight request
      console.log(`Testing OPTIONS ${endpoint}...`);
      const preflightResponse = await nodeFetch(url, {
        method: 'OPTIONS',
        headers: {
          'Origin': frontendOrigin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      });
      
      console.log(`Status: ${preflightResponse.status}`);
      
      // Check CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': preflightResponse.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': preflightResponse.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': preflightResponse.headers.get('Access-Control-Allow-Headers'),
        'Access-Control-Allow-Credentials': preflightResponse.headers.get('Access-Control-Allow-Credentials')
      };
      
      console.log('CORS Headers:', corsHeaders);
      
      // Check if the frontend origin is allowed
      if (corsHeaders['Access-Control-Allow-Origin'] === frontendOrigin || 
          corsHeaders['Access-Control-Allow-Origin'] === '*') {
        console.log('✓ Origin is allowed');
      } else {
        console.log(`✗ Origin is not allowed: ${corsHeaders['Access-Control-Allow-Origin']}`);
      }
      
      // Check if credentials are allowed
      if (corsHeaders['Access-Control-Allow-Credentials'] === 'true') {
        console.log('✓ Credentials are allowed');
      } else {
        console.log('✗ Credentials are not allowed');
      }
      
      // Check if required methods are allowed
      if (corsHeaders['Access-Control-Allow-Methods'] && 
          corsHeaders['Access-Control-Allow-Methods'].includes('POST')) {
        console.log('✓ POST method is allowed');
      } else {
        console.log('✗ POST method is not allowed');
      }
      
      // Check if required headers are allowed
      if (corsHeaders['Access-Control-Allow-Headers'] && 
          corsHeaders['Access-Control-Allow-Headers'].includes('Content-Type') &&
          corsHeaders['Access-Control-Allow-Headers'].includes('Authorization')) {
        console.log('✓ Required headers are allowed');
      } else {
        console.log('✗ Some required headers may not be allowed');
      }
      
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error.message);
    }
    
    console.log('-----------------------------------');
  }
}

testCors().catch(err => console.error('Test failed:', err));
