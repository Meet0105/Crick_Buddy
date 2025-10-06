// Test script to verify backend is working correctly
const axios = require('axios');

const BACKEND_URL = 'https://crick-buddy-backend-v.vercel.app';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

async function testEndpoint(name, url) {
  try {
    console.log(`\n${colors.blue}Testing: ${name}${colors.reset}`);
    console.log(`URL: ${url}`);
    
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.status === 200) {
      const data = response.data;
      const dataLength = Array.isArray(data) ? data.length : Object.keys(data).length;
      
      if (Array.isArray(data) && data.length === 0) {
        console.log(`${colors.yellow}⚠️  EMPTY ARRAY - API key might not be configured${colors.reset}`);
        return false;
      } else {
        console.log(`${colors.green}✅ SUCCESS - Returned ${dataLength} items${colors.reset}`);
        return true;
      }
    }
  } catch (error) {
    console.log(`${colors.red}❌ FAILED - ${error.message}${colors.reset}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data:`, error.response.data);
    }
    return false;
  }
}

async function runTests() {
  console.log(`${colors.blue}
╔═══════════════════════════════════════════════════════╗
║     CrickBuddy Backend API Test Suite                ║
╚═══════════════════════════════════════════════════════╝
${colors.reset}`);

  const tests = [
    { name: 'Health Check', url: `${BACKEND_URL}/` },
    { name: 'Live Matches', url: `${BACKEND_URL}/api/matches/live` },
    { name: 'Recent Matches', url: `${BACKEND_URL}/api/matches/recent` },
    { name: 'Upcoming Matches', url: `${BACKEND_URL}/api/matches/upcoming` },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url);
    if (result) passed++;
    else failed++;
  }

  console.log(`\n${colors.blue}
╔═══════════════════════════════════════════════════════╗
║                    Test Results                       ║
╚═══════════════════════════════════════════════════════╝
${colors.reset}`);
  
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);

  if (failed > 0) {
    console.log(`\n${colors.yellow}⚠️  Some tests failed. Please check:${colors.reset}`);
    console.log('1. Environment variables are set on Vercel');
    console.log('2. MongoDB connection is working');
    console.log('3. RapidAPI key is valid');
    console.log('\nSee QUICK_FIX.md for detailed instructions.');
  } else {
    console.log(`\n${colors.green}🎉 All tests passed! Your backend is working correctly.${colors.reset}`);
  }
}

runTests().catch(console.error);
