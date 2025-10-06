const axios = require('axios');

const BACKEND_URL = 'https://crick-buddy-backend-v.vercel.app';
const RAPIDAPI_KEY = '09db55d3ffmsheeb4e4aa2dad1b6p140863jsn15fdd9eced26';
const RAPIDAPI_HOST = 'cricbuzz-cricket.p.rapidapi.com';

async function diagnose() {
  console.log('\n🔍 DIAGNOSING CRICKBUDDY BACKEND ISSUE\n');
  console.log('='.repeat(60));
  
  // Test 1: Backend Health
  console.log('\n1️⃣ Testing Backend Health...');
  try {
    const response = await axios.get(`${BACKEND_URL}/`);
    console.log('✅ Backend is running:', response.data.message);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    return;
  }
  
  // Test 2: Backend Live Matches
  console.log('\n2️⃣ Testing Backend Live Matches Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/matches/live`);
    if (Array.isArray(response.data) && response.data.length === 0) {
      console.log('⚠️  Backend returns EMPTY ARRAY');
      console.log('   This means: Environment variables NOT set on Vercel');
    } else {
      console.log(`✅ Backend returns ${response.data.length} matches`);
    }
  } catch (error) {
    console.log('❌ Backend live matches failed:', error.message);
  }
  
  // Test 3: Backend Recent Matches
  console.log('\n3️⃣ Testing Backend Recent Matches Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/matches/recent`);
    if (Array.isArray(response.data) && response.data.length === 0) {
      console.log('⚠️  Backend returns EMPTY ARRAY');
    } else {
      console.log(`✅ Backend returns ${response.data.length} matches`);
    }
  } catch (error) {
    console.log('❌ Backend recent matches failed:', error.message);
  }
  
  // Test 4: RapidAPI Direct Test
  console.log('\n4️⃣ Testing RapidAPI Directly...');
  try {
    const headers = {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    };
    const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live', { 
      headers,
      timeout: 10000 
    });
    
    if (response.data && response.data.typeMatches) {
      const liveMatches = response.data.typeMatches.find(t => t.matchType === 'Live Matches');
      if (liveMatches && liveMatches.seriesMatches) {
        let totalMatches = 0;
        liveMatches.seriesMatches.forEach(sm => {
          if (sm.seriesAdWrapper && sm.seriesAdWrapper.matches) {
            totalMatches += sm.seriesAdWrapper.matches.length;
          }
        });
        console.log(`✅ RapidAPI returns ${totalMatches} live matches`);
      } else {
        console.log('⚠️  RapidAPI: No live matches currently');
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('❌ RapidAPI: RATE LIMIT EXCEEDED (429)');
      console.log('   Your API key has hit the rate limit');
      console.log('   Wait a few minutes or upgrade your plan');
    } else {
      console.log('❌ RapidAPI failed:', error.message);
    }
  }
  
  // Test 5: Check for Recent Matches in RapidAPI
  console.log('\n5️⃣ Testing RapidAPI Recent Matches...');
  try {
    const headers = {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    };
    
    // Wait a bit to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent', { 
      headers,
      timeout: 10000 
    });
    
    if (response.data && response.data.typeMatches) {
      const recentMatches = response.data.typeMatches.find(t => t.matchType === 'Recent Matches');
      if (recentMatches && recentMatches.seriesMatches) {
        let totalMatches = 0;
        recentMatches.seriesMatches.forEach(sm => {
          if (sm.seriesAdWrapper && sm.seriesAdWrapper.matches) {
            totalMatches += sm.seriesAdWrapper.matches.length;
          }
        });
        console.log(`✅ RapidAPI returns ${totalMatches} recent matches`);
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('❌ RapidAPI: RATE LIMIT EXCEEDED (429)');
    } else {
      console.log('❌ RapidAPI recent matches failed:', error.message);
    }
  }
  
  // Diagnosis Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 DIAGNOSIS SUMMARY:\n');
  
  console.log('Issue: Backend returns empty arrays');
  console.log('\nPossible Causes:');
  console.log('1. ⚠️  Environment variables NOT set on Vercel (MOST LIKELY)');
  console.log('2. ⚠️  RapidAPI rate limit exceeded');
  console.log('3. ⚠️  No live/upcoming matches currently available');
  
  console.log('\n✅ SOLUTION:');
  console.log('\n1. Go to Vercel Dashboard:');
  console.log('   https://vercel.com/your-project/settings/environment-variables');
  console.log('\n2. Add these variables:');
  console.log('   - RAPIDAPI_KEY');
  console.log('   - RAPIDAPI_HOST');
  console.log('   - RAPIDAPI_MATCHES_LIVE_URL');
  console.log('   - RAPIDAPI_MATCHES_RECENT_URL');
  console.log('   - RAPIDAPI_MATCHES_UPCOMING_URL');
  console.log('   - RAPIDAPI_MATCHES_INFO_URL');
  console.log('   - MONGO_URI');
  console.log('   - FRONTEND_URL');
  console.log('   - NODE_ENV=production');
  console.log('\n3. Redeploy your backend');
  console.log('\n4. Wait 2-3 minutes');
  console.log('\n5. Test again');
  
  console.log('\n' + '='.repeat(60));
}

diagnose().catch(console.error);
