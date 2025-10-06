const axios = require('axios');

async function debugMatchData() {
  try {
    // Get live matches
    const liveRes = await axios.get('http://localhost:5000/api/matches/live');
    const liveMatches = Array.isArray(liveRes.data) ? liveRes.data : [];
    
    console.log('=== LIVE MATCHES DEBUG ===');
    console.log('Number of live matches:', liveMatches.length);
    
    if (liveMatches.length > 0) {
      const firstMatch = liveMatches[0];
      console.log('\n--- First Live Match ---');
      console.log('Match ID:', firstMatch.matchId);
      console.log('Title:', firstMatch.title);
      console.log('Status:', firstMatch.status);
      console.log('Is Live:', firstMatch.isLive);
      
      // Check teams data
      console.log('\n--- Teams Data ---');
      if (firstMatch.teams && Array.isArray(firstMatch.teams)) {
        firstMatch.teams.forEach((team, index) => {
          console.log(`Team ${index + 1}:`);
          console.log('  Name:', team.teamName);
          console.log('  Score:', team.score);
        });
      }
      
      // Check raw data
      console.log('\n--- Raw Data ---');
      if (firstMatch.raw) {
        if (firstMatch.raw.matchScore) {
          console.log('Raw matchScore:', JSON.stringify(firstMatch.raw.matchScore, null, 2));
        } else {
          console.log('No matchScore in raw data');
        }
        
        if (firstMatch.raw.matchInfo) {
          console.log('Raw matchInfo status:', firstMatch.raw.matchInfo.status);
        }
      }
      
      // Check scorecard data
      console.log('\n--- Scorecard Data ---');
      if (firstMatch.scorecard && firstMatch.scorecard.scorecard) {
        console.log('Scorecard length:', firstMatch.scorecard.scorecard.length);
        if (firstMatch.scorecard.scorecard.length > 0) {
          console.log('First innings:', JSON.stringify(firstMatch.scorecard.scorecard[0], null, 2));
        }
      } else {
        console.log('No scorecard data');
      }
    } else {
      console.log('No live matches found');
    }
  } catch (error) {
    console.error('Error fetching match data:', error.message);
    console.error('Error stack:', error.stack);
  }
}

debugMatchData();