import Match from '../../models/Match';

// Helper function to map API status to our enum values
const mapStatusToEnum = (status: string): 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'ABANDONED' | 'CANCELLED' => {
  if (!status) return 'LIVE'; // For live helpers, default to LIVE if no status
  
  // Convert to lowercase for case-insensitive comparison
  const lowerStatus = status.toLowerCase();
  
  // Map LIVE status patterns
  if (lowerStatus.includes('live') || 
      lowerStatus.includes('in progress') || 
      lowerStatus.includes('innings break') ||
      lowerStatus.includes('rain delay') ||
      lowerStatus.includes('tea break') ||
      lowerStatus.includes('lunch break') ||
      lowerStatus.includes('drinks break') ||
      lowerStatus === 'live') {
    return 'LIVE';
  }

  // Map COMPLETED status patterns
  if (lowerStatus.includes('complete') || 
      lowerStatus.includes('finished') ||
      lowerStatus.includes('won by') ||
      lowerStatus.includes('match tied') ||
      lowerStatus.includes('no result') ||
      lowerStatus.includes('result') ||
      lowerStatus === 'completed' ||
      lowerStatus === 'finished') {
    return 'COMPLETED';
  }

  // Map ABANDONED status patterns
  if (lowerStatus.includes('abandon') || 
      lowerStatus.includes('washed out') ||
      lowerStatus === 'abandoned') {
    return 'ABANDONED';
  }

  // Map CANCELLED status patterns
  if (lowerStatus.includes('cancel') || 
      lowerStatus.includes('postponed') ||
      lowerStatus === 'cancelled') {
    return 'CANCELLED';
  }

  // Map UPCOMING status patterns
  if (lowerStatus.includes('match starts') || 
      lowerStatus.includes('starts at') ||
      lowerStatus.includes('upcoming') || 
      lowerStatus.includes('scheduled') ||
      lowerStatus.includes('preview') ||
      lowerStatus === 'upcoming' ||
      lowerStatus === 'scheduled') {
    return 'UPCOMING';
  }

  // If we can't determine the status, try to make an educated guess
  // Check if it contains time information (likely upcoming)
  if (lowerStatus.match(/\d{1,2}:\d{2}/) || lowerStatus.includes('gmt') || lowerStatus.includes('ist')) {
    return 'UPCOMING';
  }

  // Default fallback for live helpers
  return 'LIVE';
};

// Function to process raw match data and extract proper fields
export function processRawMatchData(match: any) {
  // If we already have proper data, return as is
  if (match.title && match.title !== ' vs ' && match.teams && match.teams.length > 0) {
    return match;
  }
  
  // Try to extract data from raw field
  if (match.raw) {
    try {
      // Handle the structure with seriesMatches directly
      if (match.raw.seriesMatches && Array.isArray(match.raw.seriesMatches)) {
        for (const seriesMatch of match.raw.seriesMatches) {
          if (seriesMatch.seriesAdWrapper && seriesMatch.seriesAdWrapper.matches) {
            for (const m of seriesMatch.seriesAdWrapper.matches) {
              if (m.matchInfo) {
                return extractMatchInfo(m.matchInfo, m.matchScore, match);
              }
            }
          }
        }
      }
      // Handle the structure with typeMatches
      else if (match.raw.typeMatches && Array.isArray(match.raw.typeMatches)) {
        for (const typeMatch of match.raw.typeMatches) {
          if (typeMatch.seriesMatches && Array.isArray(typeMatch.seriesMatches)) {
            for (const seriesMatch of typeMatch.seriesMatches) {
              if (seriesMatch.seriesAdWrapper && seriesMatch.seriesAdWrapper.matches) {
                for (const m of seriesMatch.seriesAdWrapper.matches) {
                  if (m.matchInfo) {
                    return extractMatchInfo(m.matchInfo, m.matchScore, match);
                  }
                }
              }
            }
          }
        }
      }
      // Handle direct matchInfo structure
      else if (match.raw.matchInfo) {
        console.log('Processing direct matchInfo structure');
        console.log('matchScore data available:', !!match.raw.matchScore);
        if (match.raw.matchScore) {
          console.log('matchScore keys:', Object.keys(match.raw.matchScore));
          console.log('matchScore content:', JSON.stringify(match.raw.matchScore, null, 2));
        }
        return extractMatchInfo(match.raw.matchInfo, match.raw.matchScore, match);
      }
      // Handle flat structure (the actual structure we're seeing in the data)
      else if (match.raw.matchid || match.raw.matchId) {
        return extractMatchInfoFromFlatStructure(match.raw, match);
      }
    } catch (error) {
      console.error('Error processing raw match data:', error);
    }
  }
  
  // If we can't extract data, return the original match
  return match;
}

// Helper function to extract match information from flat raw data structure
export function extractMatchInfoFromFlatStructure(rawData: any, originalMatch: any) {
  console.log('extractMatchInfoFromFlatStructure called with:', { 
    rawDataKeys: Object.keys(rawData),
    originalMatchId: originalMatch?.matchId
  });
  
  // Extract team information
  const team1Info = rawData.team1 || {};
  const team2Info = rawData.team2 || {};
  
  const team1Name = team1Info.teamname || team1Info.teamName || team1Info.teamsname || team1Info.teamSName || team1Info.name || 'Team 1';
  const team2Name = team2Info.teamname || team2Info.teamName || team2Info.teamsname || team2Info.teamSName || team2Info.name || 'Team 2';
  const team1Id = team1Info.teamid || team1Info.teamId || team1Info.id || '1';
  const team2Id = team2Info.teamid || team2Info.teamId || team2Info.id || '2';

  // Extract score information from matchScore if available
  let team1Score = { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 };
  let team2Score = { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 };

  // Check for score data in multiple locations
  const matchScore = rawData.matchScore || originalMatch.raw?.matchScore || originalMatch.matchScore || rawData.score || originalMatch.score || {};
  
  if (matchScore && Object.keys(matchScore).length > 0) {
    // Handle the specific structure we see in the data
    const team1ScoreData = matchScore.team1Score || matchScore[0] || matchScore.team1 || {};
    const team2ScoreData = matchScore.team2Score || matchScore[1] || matchScore.team2 || {};
    
    // Function to calculate total score from all innings
    const calculateTotalScore = (teamScoreData: any) => {
      let totalRuns = 0;
      let totalWickets = 0;
      let totalOvers = 0;
      let totalBalls = 0;
      let runRate = 0;
      
      // Check if we have innings data
      if (Object.keys(teamScoreData).some(key => key.startsWith('inngs'))) {
        // Iterate through all innings
        Object.keys(teamScoreData).forEach(key => {
          if (key.startsWith('inngs')) {
            const innings = teamScoreData[key];
            totalRuns += innings.runs || 0;
            // For wickets, we take the value from the last innings
            totalWickets = innings.wickets || innings.wkts || totalWickets;
            // For overs, we need to combine properly
            if (innings.overs) {
              totalOvers += innings.overs;
            }
          }
        });
      } else if (Object.keys(teamScoreData).some(key => key.startsWith('inng'))) {
        // Handle alternative innings key format (inng1, inng2, etc.)
        Object.keys(teamScoreData).forEach(key => {
          if (key.startsWith('inng')) {
            const innings = teamScoreData[key];
            totalRuns += innings.runs || 0;
            // For wickets, we take the value from the last innings
            totalWickets = innings.wickets || innings.wkts || totalWickets;
            // For overs, we need to combine properly
            if (innings.overs) {
              totalOvers += innings.overs;
            }
          }
        });
      } else if (Object.keys(teamScoreData).length > 0) {
        // Handle single innings or flat structure
        totalRuns = teamScoreData.runs || 0;
        totalWickets = teamScoreData.wickets || teamScoreData.wkts || 0;
        totalOvers = teamScoreData.overs || 0;
        totalBalls = teamScoreData.balls || 0;
        runRate = teamScoreData.runRate || teamScoreData.runrate || teamScoreData.rpo || 0;
      }
      
      return {
        runs: totalRuns,
        wickets: totalWickets,
        overs: totalOvers,
        balls: totalBalls,
        runRate: runRate
      };
    };
    
    // Extract detailed score information for team 1
    team1Score = calculateTotalScore(team1ScoreData);
    
    // Extract detailed score information for team 2
    team2Score = calculateTotalScore(team2ScoreData);
  }

  // Create teams array in the expected format
  const teams = [
    {
      teamId: team1Id.toString(),
      teamName: team1Name,
      teamShortName: team1Info.teamsname || team1Info.teamSName || team1Name.substring(0, 3),
      score: team1Score,
      isWinner: rawData.winner && rawData.winner === team1Id.toString()
    },
    {
      teamId: team2Id.toString(),
      teamName: team2Name,
      teamShortName: team2Info.teamsname || team2Info.teamSName || team2Name.substring(0, 3),
      score: team2Score,
      isWinner: rawData.winner && rawData.winner === team2Id.toString()
    }
  ];
  
  // Extract other information
  const format = rawData.matchformat || rawData.matchFormat || rawData.format || originalMatch.format || 'Other';
  const title = rawData.matchdesc || rawData.matchDesc || rawData.title || rawData.name || `${team1Name} vs ${team2Name}`;
  const rawStatus = rawData.status || rawData.state || originalMatch.status || 'LIVE';
  const status = mapStatusToEnum(rawStatus);
  
  const seriesName = rawData.seriesname || rawData.seriesName || 'Unknown Series';
  const seriesId = rawData.seriesid || rawData.seriesId || '0';
  
  const venueInfo = rawData.venueinfo || rawData.venueInfo || {};
  const venueName = venueInfo.ground || venueInfo.stadium || rawData.venue || 'Venue TBD';
  const venueCity = venueInfo.city || '';
  const venueCountry = venueInfo.country || '';
  
  let startDate = null;
  if (rawData.startdate) startDate = new Date(parseInt(rawData.startdate));
  else if (rawData.startDate) startDate = new Date(parseInt(rawData.startDate));
  else if (originalMatch.startDate) startDate = new Date(originalMatch.startDate);
  
  let endDate = null;
  if (rawData.enddate) endDate = new Date(parseInt(rawData.enddate));
  else if (rawData.endDate) endDate = new Date(parseInt(rawData.endDate));
  else if (originalMatch.endDate) endDate = new Date(originalMatch.endDate);
  
  // Extract result information if available (for live matches that might be completed)
  const resultText = rawData.status || rawData.result || rawData.winner || '';
  const winnerTeam = rawData.winnerTeam || rawData.winner || '';
  
  // Extract toss information if available
  let tossResults = undefined;
  if (rawData.tossstatus) {
    tossResults = {
      tossWinnerTeam: rawData.tossstatus.split(' opt to ')[0] || '',
      decision: rawData.tossstatus.includes('bat') ? 'BAT' : 'BOWL'
    };
  }
  
  // Extract commentary information if available
  let commentary = undefined;
  if (rawData.status) {
    commentary = {
      liveText: rawData.status,
      lastUpdated: new Date()
    };
  }
  
  // Return the processed match with proper structure
  return {
    ...originalMatch,
    matchId: (rawData.matchid || rawData.matchId)?.toString() || originalMatch.matchId,
    format,
    title,
    shortTitle: rawData.shortstatus || rawData.shortStatus || title,
    series: {
      id: seriesId.toString(),
      name: seriesName,
      seriesType: 'INTERNATIONAL' // Default value
    },
    teams,
    status,
    venue: {
      name: venueName,
      city: venueCity,
      country: venueCountry
    },
    startDate: startDate && !isNaN(startDate.getTime()) ? startDate : originalMatch.startDate,
    endDate: endDate && !isNaN(endDate.getTime()) ? endDate : originalMatch.endDate,
    result: resultText || winnerTeam ? {
      resultText,
      winnerTeam,
    } : undefined,
    tossResults,
    commentary,
    isLive: status.toLowerCase().includes('live') || originalMatch.isLive || true // Live matches should be marked as live
  };
}

// Helper function to extract match information from raw data
export function extractMatchInfo(matchInfo: any, matchScore: any, originalMatch: any) {
  console.log('extractMatchInfo called with:', { 
    matchInfo: !!matchInfo, 
    matchScore: !!matchScore,
    matchScoreType: typeof matchScore,
    originalMatchId: originalMatch?.matchId
  });
  
  if (matchScore) {
    console.log('matchScore content:', JSON.stringify(matchScore, null, 2));
  }
  
  // Extract team information
  const team1Info = matchInfo.team1 || {};
  const team2Info = matchInfo.team2 || {};
  
  const team1Name = team1Info.teamName || team1Info.teamSName || team1Info.name || 'Team 1';
  const team2Name = team2Info.teamName || team2Info.teamSName || team2Info.name || 'Team 2';
  const team1Id = team1Info.teamId || team1Info.id || '1';
  const team2Id = team2Info.teamId || team2Info.id || '2';

  // Extract score information
  let team1Score = { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 };
  let team2Score = { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 };

  // Use matchScore if available, otherwise fallback to matchInfo scores
  const scoreData = matchScore || matchInfo.matchScore || {};
  
  if (scoreData && Object.keys(scoreData).length > 0) {
    // Handle the specific structure we see in the data
    const team1ScoreData = scoreData.team1Score || scoreData[0] || scoreData.team1 || {};
    const team2ScoreData = scoreData.team2Score || scoreData[1] || scoreData.team2 || {};
    
    // Function to calculate total score from all innings
    const calculateTotalScore = (teamScoreData: any) => {
      let totalRuns = 0;
      let totalWickets = 0;
      let totalOvers = 0;
      let totalBalls = 0;
      let runRate = 0;
      
      // Check if we have innings data
      if (Object.keys(teamScoreData).some(key => key.startsWith('inngs'))) {
        // Iterate through all innings
        Object.keys(teamScoreData).forEach(key => {
          if (key.startsWith('inngs')) {
            const innings = teamScoreData[key];
            totalRuns += innings.runs || 0;
            // For wickets, we take the value from the last innings
            totalWickets = innings.wickets || totalWickets;
            // For overs, we need to combine properly
            if (innings.overs) {
              totalOvers += innings.overs;
            }
          }
        });
      } else if (Object.keys(teamScoreData).length > 0) {
        // Handle single innings or flat structure
        totalRuns = teamScoreData.runs || 0;
        totalWickets = teamScoreData.wickets || 0;
        totalOvers = teamScoreData.overs || 0;
        totalBalls = teamScoreData.balls || 0;
        runRate = teamScoreData.runRate || teamScoreData.runrate || teamScoreData.rpo || 0;
      }
      
      return {
        runs: totalRuns,
        wickets: totalWickets,
        overs: totalOvers,
        balls: totalBalls,
        runRate: runRate
      };
    };
    
    // Extract detailed score information for team 1
    team1Score = calculateTotalScore(team1ScoreData);
    
    // Extract detailed score information for team 2
    team2Score = calculateTotalScore(team2ScoreData);
  }

  // Create teams array in the expected format
  const teams = [
    {
      teamId: team1Id.toString(),
      teamName: team1Name,
      teamShortName: team1Info.teamSName || team1Name.substring(0, 3),
      score: team1Score,
      isWinner: matchInfo.winner && matchInfo.winner === team1Id.toString()
    },
    {
      teamId: team2Id.toString(),
      teamName: team2Name,
      teamShortName: team2Info.teamSName || team2Name.substring(0, 3),
      score: team2Score,
      isWinner: matchInfo.winner && matchInfo.winner === team2Id.toString()
    }
  ];
  
  // Extract other information
  const format = matchInfo.matchFormat || matchInfo.matchType || originalMatch.format || 'Other';
  const title = matchInfo.matchDesc || matchInfo.title || matchInfo.name || `${team1Name} vs ${team2Name}`;
  const rawStatus = matchInfo.status || matchInfo.state || originalMatch.status || 'LIVE';
  const status = mapStatusToEnum(rawStatus);
  
  const seriesName = matchInfo.seriesName || matchInfo.tour || 'Unknown Series';
  const seriesId = matchInfo.seriesId || matchInfo.tourId || '0';
  
  const venueName = matchInfo.venueInfo?.ground || matchInfo.venueInfo?.stadium || matchInfo.venue || 'Venue TBD';
  const venueCity = matchInfo.venueInfo?.city || '';
  const venueCountry = matchInfo.venueInfo?.country || '';
  
  let startDate = null;
  if (matchInfo.startDate) startDate = new Date(parseInt(matchInfo.startDate));
  else if (matchInfo.startDateTime) startDate = new Date(matchInfo.startDateTime);
  else if (originalMatch.startDate) startDate = new Date(originalMatch.startDate);
  
  let endDate = null;
  if (matchInfo.endDate) endDate = new Date(parseInt(matchInfo.endDate));
  else if (matchInfo.endDateTime) endDate = new Date(matchInfo.endDateTime);
  else if (originalMatch.endDate) endDate = new Date(originalMatch.endDate);
  
  // Extract result information if available (for live matches that might be completed)
  const resultText = matchInfo.status || matchInfo.result || matchInfo.winner || '';
  const winnerTeam = matchInfo.winnerTeam || matchInfo.winner || '';
  
  // Extract toss information if available
  let tossResults = undefined;
  if (matchInfo.tossWinner || matchInfo.toss) {
    tossResults = {
      tossWinnerTeam: matchInfo.tossWinner || matchInfo.toss.winner || '',
      decision: matchInfo.tossDecision || matchInfo.toss.decision || 'BAT'
    };
  }
  
  // Extract commentary information if available
  let commentary = undefined;
  if (matchInfo.liveText || matchInfo.commentary) {
    commentary = {
      liveText: matchInfo.liveText || matchInfo.commentary?.text || '',
      lastUpdated: matchInfo.lastUpdated ? new Date(matchInfo.lastUpdated) : new Date()
    };
  }
  
  // Extract currently playing information if available
  let currentlyPlaying = undefined;
  if (matchInfo.currBatTeamId) {
    currentlyPlaying = {
      teamId: matchInfo.currBatTeamId?.toString(),
      innings: matchInfo.currInngs || 1
    };
  }
  
  // Return the processed match with proper structure
  return {
    ...originalMatch,
    matchId: matchInfo.matchId?.toString() || originalMatch.matchId,
    format,
    title,
    shortTitle: matchInfo.shortDesc || matchInfo.subtitle || title,
    series: {
      id: seriesId.toString(),
      name: seriesName,
      seriesType: 'INTERNATIONAL' // Default value
    },
    teams,
    status,
    venue: {
      name: venueName,
      city: venueCity,
      country: venueCountry
    },
    startDate: startDate && !isNaN(startDate.getTime()) ? startDate : originalMatch.startDate,
    endDate: endDate && !isNaN(endDate.getTime()) ? endDate : originalMatch.endDate,
    result: resultText || winnerTeam ? {
      resultText,
      winnerTeam,
    } : undefined,
    tossResults,
    commentary,
    currentlyPlaying,
    isLive: status.toLowerCase().includes('live') || originalMatch.isLive || true // Live matches should be marked as live
  };
}

// Helper function to extract current scores from scorecard data
export function extractScoresFromScorecard(scorecardData: any, matchData?: any): { team1Score: any, team2Score: any } {
  const team1Score = { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 };
  const team2Score = { runs: 0, wickets: 0, overs: 0, balls: 0, runRate: 0 };
  
  // Handle different scorecard data structures
  let inningsData = null;
  
  // Check if scorecardData is the actual scorecard object or nested inside a scorecard property
  if (scorecardData && scorecardData.scorecard && Array.isArray(scorecardData.scorecard)) {
    inningsData = scorecardData.scorecard;
  } else if (Array.isArray(scorecardData)) {
    inningsData = scorecardData;
  }

  if (!inningsData || !Array.isArray(inningsData)) {
    console.log('No valid innings data found in scorecard');
    return { team1Score, team2Score };
  }

  console.log(`Processing ${inningsData.length} innings from scorecard`);

  // Process each innings to get current scores
  inningsData.forEach((innings: any, index: number) => {
    if (!innings) {
      console.log(`Skipping null innings at index ${index}`);
      return;
    }
    
    // Handle Mongoose document structure - data might be in _doc field
    let inningsObj = innings;
    if (innings._doc) {
      inningsObj = innings._doc;
    }
    
    // Extract runs, wickets, and overs with multiple fallbacks
    let runs = 0;
    let wickets = 0;
    let overs = 0;
    
    // Try to find runs in various possible locations
    runs = inningsObj.totalRuns || 
           inningsObj.total || 
           inningsObj.runs || 
           inningsObj.score ||
           (inningsObj.batTeamDetails ? inningsObj.batTeamDetails.totalRuns : 0) ||
           (inningsObj.batTeamDetails ? inningsObj.batTeamDetails.runs : 0) ||
           (inningsObj.batTeamDetails ? inningsObj.batTeamDetails.score : 0) ||
           (inningsObj.scoreObj ? inningsObj.scoreObj.totalRuns : 0) ||
           (inningsObj.scoreObj ? inningsObj.scoreObj.runs : 0) ||
           0;
           
    // If still no runs, try to calculate from batsmen data
    if (runs === 0) {
      // Try to get batsmen data from different possible locations
      let batsmenData = inningsObj.batsmen || inningsObj.batsman || {};
      
      // If batsmenData is an array, use it directly
      if (Array.isArray(batsmenData)) {
        runs = batsmenData.reduce((total, batsman) => total + (batsman?.runs || 0), 0);
      } 
      // If batsmenData is an object, check for numeric keys or batsman array
      else if (typeof batsmenData === 'object' && batsmenData !== null) {
        // Check if there's a batsman array property
        if (Array.isArray(batsmenData.batsman)) {
          runs = batsmenData.batsman.reduce((total: number, batsman: any) => total + (batsman?.runs || 0), 0);
        } else {
          // Check for numeric keys in the object
          const numericKeys = Object.keys(batsmenData).filter(key => /^\d+$/.test(key));
          if (numericKeys.length > 0) {
            runs = numericKeys.reduce((total, key) => total + (batsmenData[key]?.runs || 0), 0);
          } else {
            // Try to get all values from the object and sum runs
            const values = Object.values(batsmenData);
            if (Array.isArray(values) && values.length > 0 && (values[0] as any)?.runs !== undefined) {
              runs = values.reduce((total: number, batsman: any) => total + (batsman?.runs || 0), 0);
            }
          }
        }
      }
    }
           
    // Try to find wickets in various possible locations
    wickets = inningsObj.totalWickets || 
              inningsObj.wickets || 
              inningsObj.wkts ||
              (inningsObj.batTeamDetails ? inningsObj.batTeamDetails.totalWickets : 0) ||
              (inningsObj.batTeamDetails ? inningsObj.batTeamDetails.wickets : 0) ||
              (inningsObj.batTeamDetails ? inningsObj.batTeamDetails.wkts : 0) ||
              (inningsObj.scoreObj ? inningsObj.scoreObj.totalWickets : 0) ||
              (inningsObj.scoreObj ? inningsObj.scoreObj.wickets : 0) ||
              0;
              
    // Try to find overs in various possible locations
    overs = inningsObj.totalOvers || 
            inningsObj.overs || 
            inningsObj.over ||
            (inningsObj.batTeamDetails ? inningsObj.batTeamDetails.totalOvers : 0) ||
            (inningsObj.batTeamDetails ? inningsObj.batTeamDetails.overs : 0) ||
            (inningsObj.batTeamDetails ? inningsObj.batTeamDetails.over : 0) ||
            (inningsObj.scoreObj ? inningsObj.scoreObj.totalOvers : 0) ||
            (inningsObj.scoreObj ? inningsObj.scoreObj.overs : 0) ||
            0;
    
    console.log(`Innings ${index + 1}: runs=${runs}, wickets=${wickets}, overs=${overs}`);
    
    // Determine which team batted in this innings
    // Simple approach: alternate innings between teams
    // Innings 0, 2, 4... = Team 1
    // Innings 1, 3, 5... = Team 2
    const isTeam1Innings = (index % 2 === 0);
    
    if (isTeam1Innings) {
      // Add to team1's score (accumulate across innings)
      team1Score.runs += runs;
      team1Score.wickets = wickets; // Use latest wickets for this innings
      team1Score.overs += overs;
      // Calculate balls from overs (e.g., 12.3 overs = 12*6 + 3 = 75 balls)
      team1Score.balls = Math.floor(team1Score.overs) * 6 + Math.round((team1Score.overs - Math.floor(team1Score.overs)) * 10);
      
      // Calculate run rate if overs > 0
      if (team1Score.overs > 0) {
        team1Score.runRate = parseFloat((team1Score.runs / team1Score.overs).toFixed(2));
      }
      console.log(`Assigned innings ${index + 1} to team1`);
    } else {
      // Add to team2's score (accumulate across innings)
      team2Score.runs += runs;
      team2Score.wickets = wickets; // Use latest wickets for this innings
      team2Score.overs += overs;
      // Calculate balls from overs
      team2Score.balls = Math.floor(team2Score.overs) * 6 + Math.round((team2Score.overs - Math.floor(team2Score.overs)) * 10);
      
      // Calculate run rate if overs > 0
      if (team2Score.overs > 0) {
        team2Score.runRate = parseFloat((team2Score.runs / team2Score.overs).toFixed(2));
      }
      console.log(`Assigned innings ${index + 1} to team2`);
    }
  });

  console.log(`Extracted scores - Team1: ${team1Score.runs}/${team1Score.wickets} (${team1Score.overs} ov), Team2: ${team2Score.runs}/${team2Score.wickets} (${team2Score.overs} ov)`);
  
  return { team1Score, team2Score };
}
