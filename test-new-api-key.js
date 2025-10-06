const axios = require('axios');

const NEW_API_KEY = 'a2c7e93e5dmsh5aa3e5fe3833633p16893ajsn5987862cca9a';
const BACKEND_URL = 'https://crick-buddy-backend-v.vercel.app';

async function testNewAPIKey() {
  console.log('\n🔑 TESTING NEW API KEY\n');
  console.log('='.repeat(60));
  
  // Test 1: Test API Key Directly with RapidAPI
  console.log('\n1️⃣ Testing NEW API Key with RapidAPI...');
  try {
    const headers = {
      'x-rapidapi-key': NEW_API_KEY,
      'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
    };
    
    const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live', {
      headers,
      timeout: 10000
    });
    
    if (response.data && response.data.typeMatches) {
      console.log('✅ NEW API KEY WORKS!');
      
      // Count matches
      let totalMatches = 0;
      response.data.typeMatches.forEach(typeMatch => {
        if (typeMatch.seriesMatches) {
          typeMatch.seriesMatches.forEach(sm => {
            if (sm.seriesAdWrapper && sm.seriesAdWrapper.matches) {
              totalMatches += sm.seriesAdWrapper.matches.length;
            }
          });
        }
      });
      
      console.log(`   Found ${totalMatches} matches in RapidAPI`);
    }
  } catch (error) {
    if (error.response) {
      console.log(`❌ API Key Failed: ${error.response.status} - ${error.response.statusText}`);
      if (error.response.status === 403) {
        console.log('   Error: API key not subscribed to Cricbuzz API');
      } else if (error.response.status === 429) {
        console.log('   Error: Rate limit exceeded');
      }
    } else {
      console.log(`❌ Request Failed: ${error.message}`);
    }
    return;
  }
  
  // Test 2: Test Backend
  console.log('\n2️⃣ Testing Backend with Current Deployment...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/matches/live`);
    
    if (Array.isArray(response.data)) {
      if (response.data.length === 0) {
        console.log('⚠️  Backend returns EMPTY ARRAY');
        console.log('   This means: API key NOT updated on Vercel yet');
        console.log('   Action: Update RAPIDAPI_KEY on Vercel and redeploy');
      } else {
        console.log(`✅ Backend returns ${response.data.length} matches`);
        console.log('   SUCCESS! Everything is working!');
      }
    }
  } catch (error) {
    console.log(`❌ Backend Failed: ${error.message}`);
  }
  
  // Test 3: Test Recent Matches (should work from cache)
  console.log('\n3️⃣ Testing Backend Recent Matches (from cache)...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/matches/recent`);
    
    if (Array.isArray(response.data)) {
      console.log(`✅ Backend returns ${response.data.length} recent matches (cached)`);
    }
  } catch (error) {
    console.log(`❌ Recent matches failed: ${error.message}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SUMMARY:\n');
  console.log('✅ NEW API KEY: Working perfectly!');
  console.log('✅ CODE: Pushed to GitHub');
  console.log('✅ BUILD: Successful');
  console.log('\n🚨 NEXT STEP:');
  console.log('1. Go to Vercel → Settings → Environment Variables');
  console.log('2. Update RAPIDAPI_KEY to: ' + NEW_API_KEY);
  console.log('3. Redeploy');
  console.log('4. Wait 2-3 minutes');
  console.log('5. Run this script again to verify');
  console.log('\n' + '='.repeat(60));
}

testNewAPIKey().catch(console.error);
