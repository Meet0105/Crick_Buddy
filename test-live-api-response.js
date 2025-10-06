const axios = require('axios');

const API_KEY = 'a2c7e93e5dmsh5aa3e5fe3833633p16893ajsn5987862cca9a';

async function testLiveAPI() {
  try {
    const headers = {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
    };
    
    const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live', {
      headers,
      timeout: 10000
    });
    
    console.log('\n📊 RapidAPI Live Matches Response Analysis:\n');
    console.log('='.repeat(70));
    
    if (response.data && response.data.typeMatches) {
      console.log(`\nFound ${response.data.typeMatches.length} match type categories:\n`);
      
      response.data.typeMatches.forEach((typeMatch, index) => {
        console.log(`${index + 1}. Match Type: "${typeMatch.matchType}"`);
        
        if (typeMatch.seriesMatches) {
          let totalMatches = 0;
          typeMatch.seriesMatches.forEach(sm => {
            if (sm.seriesAdWrapper && sm.seriesAdWrapper.matches) {
              totalMatches += sm.seriesAdWrapper.matches.length;
              
              // Show first match details
              if (sm.seriesAdWrapper.matches.length > 0) {
                const match = sm.seriesAdWrapper.matches[0];
                console.log(`   - Series: ${sm.seriesAdWrapper.seriesName || 'Unknown'}`);
                console.log(`   - Matches: ${sm.seriesAdWrapper.matches.length}`);
                console.log(`   - Sample Match ID: ${match.matchInfo?.matchId}`);
                console.log(`   - Status: ${match.matchInfo?.status || match.matchInfo?.state}`);
              }
            }
          });
          console.log(`   Total matches in this category: ${totalMatches}\n`);
        }
      });
    }
    
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

testLiveAPI();
