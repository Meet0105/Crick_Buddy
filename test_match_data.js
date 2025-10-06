const axios = require('axios');

async function testMatchData() {
  try {
    // Get live matches from the backend API
    const response = await axios.get('http://localhost:5000/api/matches/live');
    const matches = response.data;
    
    console.log('=== LIVE MATCHES FROM BACKEND API ===');
    console.log('Number of matches:', matches.length);
    
    if (matches.length > 0) {
      const firstMatch = matches[0];
      console.log('\n--- First Match ---');
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
        console.log('Raw data keys:', Object.keys(firstMatch.raw));
        if (firstMatch.raw.matchScore) {
          console.log('Raw matchScore:', JSON.stringify(firstMatch.raw.matchScore, null, 2));
        } else {
          console.log('No matchScore in raw data');
        }
      } else {
        console.log('No raw data');
      }
    } else {
      console.log('No live matches found');
    }
  } catch (error) {
    console.error('Error fetching match data:', error.message);
  }
}

testMatchData();