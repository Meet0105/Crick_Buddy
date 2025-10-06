const axios = require('axios');

async function getMatchData() {
  try {
    const response = await axios.get('http://localhost:5000/api/matches/live');
    if (response.data && response.data.length > 0) {
      const match = response.data[0];
      console.log('Match data:');
      console.log(JSON.stringify(match, null, 2));
      
      // Check for matchScore data
      console.log('\n--- Checking for matchScore data ---');
      if (match.raw && match.raw.matchScore) {
        console.log('matchScore found:', JSON.stringify(match.raw.matchScore, null, 2));
      } else {
        console.log('No matchScore data found in raw data');
      }
      
      // Check teams data
      console.log('\n--- Teams data ---');
      if (match.teams) {
        match.teams.forEach((team, index) => {
          console.log(`Team ${index + 1}:`, JSON.stringify(team, null, 2));
        });
      }
    } else {
      console.log('No matches found');
    }
  } catch (error) {
    console.error('Error fetching match data:', error.message);
  }
}

getMatchData();