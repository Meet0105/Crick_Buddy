const mongoose = require('mongoose');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cricbuzz_ts';

async function inspectMatch() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    
    console.log('Connected to MongoDB');
    
    // Define the Match schema
    const matchSchema = new mongoose.Schema({
      matchId: String,
      title: String,
      status: String,
      isLive: Boolean,
      raw: mongoose.Schema.Types.Mixed,
      teams: [{
        teamId: String,
        teamName: String,
        teamShortName: String,
        score: {
          runs: Number,
          wickets: Number,
          overs: Number,
          balls: Number,
          runRate: Number
        }
      }]
    }, { timestamps: true });
    
    // Get the Match model
    const Match = mongoose.model('Match', matchSchema);
    
    // Find all matches
    const matches = await Match.find({});
    
    console.log(`Found ${matches.length} matches`);
    
    matches.forEach((match, index) => {
      console.log(`\n--- Match ${index + 1} (ID: ${match.matchId}) ---`);
      console.log('Match ID:', match.matchId);
      console.log('Title:', match.title);
      console.log('Status:', match.status);
      console.log('Is Live:', match.isLive);
      
      // Check raw data structure
      if (match.raw) {
        console.log('\nRaw data keys:', Object.keys(match.raw));
        console.log('Has matchInfo:', !!match.raw.matchInfo);
        console.log('Has matchScore:', !!match.raw.matchScore);
        
        if (match.raw.matchInfo) {
          console.log('\nmatchInfo keys:', Object.keys(match.raw.matchInfo));
        }
        
        if (match.raw.matchScore) {
          console.log('\nmatchScore content:', JSON.stringify(match.raw.matchScore, null, 2));
        }
      } else {
        console.log('No raw data');
      }
      
      // Check teams data
      if (match.teams && Array.isArray(match.teams)) {
        console.log('\nTeams data:');
        match.teams.forEach((team, teamIndex) => {
          console.log(`Team ${teamIndex + 1}:`);
          console.log('  Name:', team.teamName);
          console.log('  Score:', team.score);
        });
      }
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
  }
}

inspectMatch();