// Using native fetch in Node.js for versions 18+
// If you're using an older version of Node.js, uncomment the line below:
// import fetch from 'node-fetch';

// For ESM compatibility
import('node-fetch').then(({ default: fetch }) => {

// Rest of the code here

// Test configuration
const baseUrl = 'http://localhost:3000'; // Change this to your backend URL
const apiEndpoints = [
  { url: '/api/auth/register', method: 'POST', data: { email: 'test@example.com', password: 'Password123!' } },
  { url: '/api/auth/login', method: 'POST', data: { email: 'test@example.com', password: 'Password123!' } },
  { url: '/api/auth/refresh-token', method: 'POST', data: {} },
  { url: '/api/auth/resend-verification', method: 'POST', data: { email: 'test@example.com' } }
];

// Function to make request and handle CORS issues
async function testEndpoint(endpoint) {
  const { url, method, data } = endpoint;
  const fullUrl = `${baseUrl}${url}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173' // Simulating origin from frontend
    },
    credentials: 'include',
    body: method !== 'GET' ? JSON.stringify(data) : undefined
  };

  try {
    console.log(`Testing ${method} ${fullUrl}...`);
    const response = await fetch(fullUrl, options);
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    
    // Check for CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Expose-Headers': response.headers.get('Access-Control-Expose-Headers')
    };
    
    console.log('CORS Headers:', corsHeaders);
    
    // Analyze CORS setup
    if (!corsHeaders['Access-Control-Allow-Origin']) {
      console.log('⚠️ Missing Access-Control-Allow-Origin header');
    } else if (corsHeaders['Access-Control-Allow-Origin'] !== 'http://localhost:5173' && 
               corsHeaders['Access-Control-Allow-Origin'] !== '*') {
      console.log('⚠️ Origin not allowed:', corsHeaders['Access-Control-Allow-Origin']);
    }
    
    if (!corsHeaders['Access-Control-Allow-Credentials'] && options.credentials === 'include') {
      console.log('⚠️ Missing Access-Control-Allow-Credentials header (needed for credentials: include)');
    }
    
    // Get response body
    let responseBody;
    try {
      responseBody = await response.json();
      console.log('Response:', responseBody);
    } catch (e) {
      console.log('Error parsing response:', e.message);
    }
    
    console.log('-----------------------------------');
    
    return { success: response.status >= 200 && response.status < 400, response, corsHeaders };
  } catch (error) {
    console.error(`Error for ${method} ${fullUrl}:`, error.message);
    console.log('-----------------------------------');
    return { success: false, error: error.message };
  }
}

// Run tests
async function runTests() {
  console.log('Starting API Test Suite');
  console.log('===================================');
  
  for (const endpoint of apiEndpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('API Testing Complete');
}

runTests();
