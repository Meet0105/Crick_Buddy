// Script to populate sample live and upcoming matches in your database
const axios = require('axios');

const BACKEND_URL = 'https://crick-buddy-backend-v.vercel.app';

// Sample live match data
const sampleLiveMatches = [
  {
    matchId: "live-sample-1",
    title: "India vs Australia - 1st T20I",
    shortTitle: "IND vs AUS",
    format: "T20",
    series: {
      id: "7607",
      name: "India vs Australia T20I Series 2025",
      seriesType: "INTERNATIONAL"
    },
    teams: [
      {
        teamId: "2",
        teamName: "India",
        teamShortName: "IND",
        score: {
          runs: 185,
          wickets: 6,
          overs: 18.4,
          balls: 0,
          runRate: 9.91
        }
      },
      {
        teamId: "4",
        teamName: "Australia",
        teamShortName: "AUS",
        score: {
          runs: 142,
          wickets: 8,
          overs: 16.2,
          balls: 0,
          runRate: 8.69
        }
      }
    ],
    status: "LIVE",
    venue: {
      name: "Melbourne Cricket Ground",
      city: "Melbourne",
      country: "Australia"
    },
    startDate: new Date(),
    isLive: true
  },
  {
    matchId: "live-sample-2",
    title: "England vs Pakistan - 2nd ODI",
    shortTitle: "ENG vs PAK",
    format: "ODI",
    series: {
      id: "7608",
      name: "England vs Pakistan ODI Series 2025",
      seriesType: "INTERNATIONAL"
    },
    teams: [
      {
        teamId: "1",
        teamName: "England",
        teamShortName: "ENG",
        score: {
          runs: 298,
          wickets: 7,
          overs: 50,
          balls: 0,
          runRate: 5.96
        }
      },
      {
        teamId: "7",
        teamName: "Pakistan",
        teamShortName: "PAK",
        score: {
          runs: 156,
          wickets: 4,
          overs: 28.3,
          balls: 0,
          runRate: 5.47
        }
      }
    ],
    status: "LIVE",
    venue: {
      name: "Lord's Cricket Ground",
      city: "London",
      country: "England"
    },
    startDate: new Date(),
    isLive: true
  }
];

// Sample upcoming matches
const sampleUpcomingMatches = [
  {
    matchId: "upcoming-sample-1",
    title: "South Africa vs New Zealand - 1st Test",
    shortTitle: "SA vs NZ",
    format: "TEST",
    series: {
      id: "7609",
      name: "South Africa vs New Zealand Test Series 2025",
      seriesType: "INTERNATIONAL"
    },
    teams: [
      {
        teamId: "3",
        teamName: "South Africa",
        teamShortName: "SA",
        score: { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 }
      },
      {
        teamId: "5",
        teamName: "New Zealand",
        teamShortName: "NZ",
        score: { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 }
      }
    ],
    status: "UPCOMING",
    venue: {
      name: "Newlands Cricket Ground",
      city: "Cape Town",
      country: "South Africa"
    },
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    isLive: false
  },
  {
    matchId: "upcoming-sample-2",
    title: "West Indies vs Sri Lanka - 3rd T20I",
    shortTitle: "WI vs SL",
    format: "T20",
    series: {
      id: "7610",
      name: "West Indies vs Sri Lanka T20I Series 2025",
      seriesType: "INTERNATIONAL"
    },
    teams: [
      {
        teamId: "6",
        teamName: "West Indies",
        teamShortName: "WI",
        score: { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 }
      },
      {
        teamId: "8",
        teamName: "Sri Lanka",
        teamShortName: "SL",
        score: { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 }
      }
    ],
    status: "UPCOMING",
    venue: {
      name: "Kensington Oval",
      city: "Bridgetown",
      country: "Barbados"
    },
    startDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    isLive: false
  }
];

async function populateData() {
  console.log('\n🏏 Populating Sample Cricket Match Data...\n');
  console.log('='.repeat(60));
  
  try {
    // Note: This is a workaround since we can't directly insert into MongoDB from here
    // We'll need to create an admin endpoint or use MongoDB directly
    
    console.log('\n📊 Sample Data Prepared:');
    console.log(`\n✅ ${sampleLiveMatches.length} Live Matches`);
    sampleLiveMatches.forEach(match => {
      console.log(`   - ${match.title}`);
    });
    
    console.log(`\n✅ ${sampleUpcomingMatches.length} Upcoming Matches`);
    sampleUpcomingMatches.forEach(match => {
      console.log(`   - ${match.title}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('\n⚠️  To populate this data, you need to:');
    console.log('\n1. Create an admin endpoint in your backend');
    console.log('2. Or use MongoDB Compass/Atlas to insert directly');
    console.log('3. Or wait for RapidAPI rate limit to reset');
    
    console.log('\n📝 Sample data is ready in this file.');
    console.log('   You can copy it to use in MongoDB Compass.');
    
    // Save to JSON file for manual import
    const fs = require('fs');
    fs.writeFileSync('sample-matches.json', JSON.stringify({
      liveMatches: sampleLiveMatches,
      upcomingMatches: sampleUpcomingMatches
    }, null, 2));
    
    console.log('\n✅ Saved to: sample-matches.json');
    console.log('   Import this file into MongoDB to populate data.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

populateData();
