const axios = require('axios');

const BACKEND_URL = 'https://crick-buddy-backend-v.vercel.app';
const NEW_API_KEY = 'a2c7e93e5dmsh5aa3e5fe3833633p16893ajsn5987862cca9a';

async function finalTest() {
  console.log('\n🎯 FINAL TEST - After Vercel Redeploy\n');
  console.log('='.repeat(70));
  
  // Test 1: Check if debug endpoint exists
  console.log('\n1️⃣ Checking Debug Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/debug/env`);
    console.log('✅ Debug endpoint working!');
    console.log('Environment Variables Status:');
    console.log('  - RAPIDAPI_KEY:', response.data.RAPIDAPI_KEY);
    console.log('  - RAPIDAPI_HOST:', response.data.RAPIDAPI_HOST);
    console.log('  - RAPIDAPI_MATCHES_LIVE_URL:', response.data.RAPIDAPI_MATCHES_LIVE_URL);
    console.log('  - NODE_ENV:', response.data.NODE_ENV);
    
    if (response.data.RAPIDAPI_KEY === 'NOT SET') {
      console.log('\n❌ RAPIDAPI_KEY is NOT SET on Vercel!');
      console.log('   Action: Add it in Vercel dashboard and redeploy');
      return;
    }
  } catch (error) {
    console.log('⚠️  Debug endpoint not available yet (deployment in progress)');
  }
  
  // Test 2: Test Live Matches
  console.log('\n2️⃣ Testing Live Matches Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/matches/live`);
    
    if (Array.isArray(response.data)) {
      if (response.data.length === 0) {
        console.log('⚠️  Backend returns EMPTY ARRAY');
        console.log('   Possible reasons:');
        console.log('   1. No live matches currently');
        console.log('   2. API key not updated on Vercel');
        console.log('   3. Deployment still using old code');
      } else {
        console.log(`✅ SUCCESS! Backend returns ${response.data.length} live matches`);
        console.log('\n   Sample match:');
        const match = response.data[0];
        console.log(`   - Match ID: ${match.matchId}`);
        console.log(`   - Title: ${match.title}`);
        console.log(`   - Status: ${match.status}`);
        if (match.teams && match.teams.length >= 2) {
          console.log(`   - Team 1: ${match.teams[0].teamName}`);
          console.log(`   - Team 2: ${match.teams[1].teamName}`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Live matches endpoint failed: ${error.message}`);
  }
  
  // Test 3: Test Upcoming Matches
  console.log('\n3️⃣ Testing Upcoming Matches Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/matches/upcoming`);
    
    if (Array.isArray(response.data)) {
      if (response.data.length === 0) {
        console.log('⚠️  No upcoming matches found');
      } else {
        console.log(`✅ Backend returns ${response.data.length} upcoming matches`);
      }
    }
  } catch (error) {
    console.log(`❌ Upcoming matches endpoint failed: ${error.message}`);
  }
  
  // Test 4: Test Recent Matches (should work from cache)
  console.log('\n4️⃣ Testing Recent Matches Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/matches/recent`);
    
    if (Array.isArray(response.data)) {
      console.log(`✅ Backend returns ${response.data.length} recent matches`);
    }
  } catch (error) {
    console.log(`❌ Recent matches endpoint failed: ${error.message}`);
  }
  
  // Test 5: Verify API Key Works Directly
  console.log('\n5️⃣ Testing NEW API Key Directly with RapidAPI...');
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
      console.log(`✅ NEW API KEY WORKS! Found ${totalMatches} matches in RapidAPI`);
    }
  } catch (error) {
    if (error.response) {
      console.log(`❌ API Key Failed: ${error.response.status}`);
      if (error.response.status === 403) {
        console.log('   Error: API key not subscribed');
      } else if (error.response.status === 429) {
        console.log('   Error: Rate limit exceeded');
      }
    } else {
      console.log(`❌ Request Failed: ${error.message}`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 TEST SUMMARY:\n');
  
  console.log('If you see:');
  console.log('  ✅ "Backend returns X live matches" → SUCCESS! Everything works!');
  console.log('  ⚠️  "Backend returns EMPTY ARRAY" → Need to:');
  console.log('      1. Verify RAPIDAPI_KEY is updated on Vercel');
  console.log('      2. Force redeploy with cache OFF');
  console.log('      3. Wait 3-4 minutes');
  console.log('      4. Run this test again');
  
  console.log('\n📝 Next Steps:');
  console.log('1. If backend returns data → Check frontend');
  console.log('2. If backend returns empty → Follow COMPLETE_SOLUTION.md');
  console.log('3. Visit: https://crick-buddy-frontend-v.vercel.app');
  
  console.log('\n' + '='.repeat(70));
}

finalTest().catch(console.error);
