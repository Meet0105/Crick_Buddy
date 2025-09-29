"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentMatches = void 0;
const Match_1 = __importDefault(require("../../models/Match"));
const axios_1 = __importDefault(require("axios"));
const matchRecentHelpers_1 = require("./matchRecentHelpers");
// Helper function to map API status to our enum values
const mapStatusToEnum = (status) => {
    if (!status)
        return 'UPCOMING';
    // Convert to lowercase for case-insensitive comparison
    const lowerStatus = status.toLowerCase();
    // Map common status values
    if (lowerStatus.includes('live') || lowerStatus.includes('in progress'))
        return 'LIVE';
    if (lowerStatus.includes('complete') || lowerStatus.includes('finished'))
        return 'COMPLETED';
    if (lowerStatus.includes('abandon'))
        return 'ABANDONED';
    if (lowerStatus.includes('cancel'))
        return 'CANCELLED';
    // For upcoming matches with date information
    if (lowerStatus.includes('match starts'))
        return 'UPCOMING';
    // Default fallback
    return 'UPCOMING';
};
const getRecentMatches = async (req, res) => {
    var _a;
    try {
        const { limit = 10 } = req.query;
        const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
        const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;
        const RAPIDAPI_MATCHES_RECENT_URL = process.env.RAPIDAPI_MATCHES_RECENT_URL;
        // If API key is available, try to fetch from API first
        if (RAPIDAPI_KEY && RAPIDAPI_HOST && RAPIDAPI_MATCHES_RECENT_URL) {
            try {
                console.log('Fetching recent matches from API');
                const headers = {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                };
                const response = await axios_1.default.get(RAPIDAPI_MATCHES_RECENT_URL, { headers, timeout: 15000 });
                // Process API response and save to database
                if (response.data && response.data.typeMatches) {
                    const recentMatchesData = response.data.typeMatches.find((type) => type.matchType === 'Recent Matches');
                    if (recentMatchesData && recentMatchesData.seriesMatches) {
                        const matchesList = [];
                        // Extract matches from series
                        for (const seriesMatch of recentMatchesData.seriesMatches) {
                            if (seriesMatch.seriesAdWrapper && seriesMatch.seriesAdWrapper.matches) {
                                matchesList.push(...seriesMatch.seriesAdWrapper.matches);
                            }
                        }
                        // Process and save each match
                        const upsertPromises = matchesList.map(async (m) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
                            const matchId = ((_a = m.matchInfo) === null || _a === void 0 ? void 0 : _a.matchId) || m.id || m.matchId || JSON.stringify(m).slice(0, 40);
                            // Extract series information
                            const seriesId = ((_b = m.matchInfo) === null || _b === void 0 ? void 0 : _b.seriesId) || '0';
                            const seriesName = ((_c = m.matchInfo) === null || _c === void 0 ? void 0 : _c.seriesName) || 'Unknown Series';
                            // Extract team information
                            const team1Info = ((_d = m.matchInfo) === null || _d === void 0 ? void 0 : _d.team1) || m.teamA || m.team1 || {};
                            const team2Info = ((_e = m.matchInfo) === null || _e === void 0 ? void 0 : _e.team2) || m.teamB || m.team2 || {};
                            const team1Name = team1Info.teamName || team1Info.teamSName || team1Info.name || 'Team 1';
                            const team2Name = team2Info.teamName || team2Info.teamSName || team2Info.name || 'Team 2';
                            const team1Id = team1Info.teamId || team1Info.id || '1';
                            const team2Id = team2Info.teamId || team2Info.id || '2';
                            // Extract format and status
                            const format = ((_f = m.matchInfo) === null || _f === void 0 ? void 0 : _f.matchFormat) || ((_g = m.matchInfo) === null || _g === void 0 ? void 0 : _g.matchType) || m.format || m.type || m.matchType || 'Other';
                            const title = ((_h = m.matchInfo) === null || _h === void 0 ? void 0 : _h.matchDesc) || m.title || m.name || `${team1Name} vs ${team2Name}`;
                            const rawStatus = ((_j = m.matchInfo) === null || _j === void 0 ? void 0 : _j.status) || ((_k = m.matchInfo) === null || _k === void 0 ? void 0 : _k.state) || m.status || m.matchStatus || 'COMPLETED';
                            const mappedStatus = mapStatusToEnum(rawStatus);
                            // Check if match should be live based on time
                            const matchStartTime = ((_l = m.matchInfo) === null || _l === void 0 ? void 0 : _l.startDate) ? new Date(parseInt(m.matchInfo.startDate)) : null;
                            const currentTime = new Date();
                            const shouldBeLive = matchStartTime &&
                                matchStartTime <= currentTime &&
                                (currentTime.getTime() - matchStartTime.getTime()) < (8 * 60 * 60 * 1000) && // Started within 8 hours
                                mappedStatus === 'UPCOMING'; // Only override if currently upcoming
                            const status = shouldBeLive ? 'LIVE' : mappedStatus;
                            // Extract venue information
                            const venueName = ((_o = (_m = m.matchInfo) === null || _m === void 0 ? void 0 : _m.venueInfo) === null || _o === void 0 ? void 0 : _o.ground) || ((_p = m.matchInfo) === null || _p === void 0 ? void 0 : _p.venue) || ((_q = m.venue) === null || _q === void 0 ? void 0 : _q.name) || m.venue || 'Venue TBD';
                            const venueCity = ((_s = (_r = m.matchInfo) === null || _r === void 0 ? void 0 : _r.venueInfo) === null || _s === void 0 ? void 0 : _s.city) || ((_t = m.venue) === null || _t === void 0 ? void 0 : _t.city) || '';
                            const venueCountry = ((_v = (_u = m.matchInfo) === null || _u === void 0 ? void 0 : _u.venueInfo) === null || _v === void 0 ? void 0 : _v.country) || ((_w = m.venue) === null || _w === void 0 ? void 0 : _w.country) || '';
                            // Extract date information
                            let startDate = null;
                            let endDate = null;
                            if ((_x = m.matchInfo) === null || _x === void 0 ? void 0 : _x.startDate)
                                startDate = new Date(parseInt(m.matchInfo.startDate));
                            else if (m.startDate)
                                startDate = new Date(m.startDate);
                            else if (m.date)
                                startDate = new Date(m.date);
                            if ((_y = m.matchInfo) === null || _y === void 0 ? void 0 : _y.endDate)
                                endDate = new Date(parseInt(m.matchInfo.endDate));
                            else if (m.endDate)
                                endDate = new Date(m.endDate);
                            // Extract result information
                            const resultText = ((_z = m.matchInfo) === null || _z === void 0 ? void 0 : _z.status) || m.status || '';
                            const winnerTeam = ((_0 = m.matchInfo) === null || _0 === void 0 ? void 0 : _0.winner) || m.winner || '';
                            // Extract score information
                            const innings = ((_1 = m.matchScore) === null || _1 === void 0 ? void 0 : _1.scoreData) || m.innings || [];
                            // Create teams array in the expected format
                            const teams = [
                                {
                                    teamId: team1Id.toString(),
                                    teamName: team1Name,
                                    teamShortName: team1Info.teamSName || team1Name.substring(0, 3),
                                    score: {
                                        runs: ((_2 = innings[0]) === null || _2 === void 0 ? void 0 : _2.runs) || 0,
                                        wickets: ((_3 = innings[0]) === null || _3 === void 0 ? void 0 : _3.wickets) || 0,
                                        overs: ((_4 = innings[0]) === null || _4 === void 0 ? void 0 : _4.overs) || 0,
                                        balls: ((_5 = innings[0]) === null || _5 === void 0 ? void 0 : _5.balls) || 0,
                                        runRate: ((_6 = innings[0]) === null || _6 === void 0 ? void 0 : _6.runRate) || 0
                                    }
                                },
                                {
                                    teamId: team2Id.toString(),
                                    teamName: team2Name,
                                    teamShortName: team2Info.teamSName || team2Name.substring(0, 3),
                                    score: {
                                        runs: ((_7 = innings[1]) === null || _7 === void 0 ? void 0 : _7.runs) || 0,
                                        wickets: ((_8 = innings[1]) === null || _8 === void 0 ? void 0 : _8.wickets) || 0,
                                        overs: ((_9 = innings[1]) === null || _9 === void 0 ? void 0 : _9.overs) || 0,
                                        balls: ((_10 = innings[1]) === null || _10 === void 0 ? void 0 : _10.balls) || 0,
                                        runRate: ((_11 = innings[1]) === null || _11 === void 0 ? void 0 : _11.runRate) || 0
                                    }
                                }
                            ];
                            const doc = {
                                matchId: matchId === null || matchId === void 0 ? void 0 : matchId.toString(),
                                format: format || 'Other',
                                title,
                                shortTitle: ((_12 = m.matchInfo) === null || _12 === void 0 ? void 0 : _12.shortDesc) || title,
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
                                startDate: startDate && !isNaN(startDate.getTime()) ? startDate : undefined,
                                endDate: endDate && !isNaN(endDate.getTime()) ? endDate : undefined,
                                result: {
                                    resultText,
                                    winnerTeam
                                },
                                isLive: status === 'LIVE',
                                raw: m
                            };
                            Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k]);
                            return Match_1.default.findOneAndUpdate({ matchId: doc.matchId }, { $set: doc }, { upsert: true, new: true, setDefaultsOnInsert: true });
                        });
                        await Promise.all(upsertPromises);
                        // Return from database after saving
                        const recentMatches = await Match_1.default.find({
                            $and: [
                                {
                                    $or: [
                                        { status: 'COMPLETED' },
                                        { status: 'Complete' },
                                        { status: { $regex: 'Complete', $options: 'i' } },
                                        { status: { $regex: 'complete', $options: 'i' } },
                                        { status: { $regex: 'won', $options: 'i' } },
                                        { status: { $regex: 'Finished', $options: 'i' } },
                                        { status: { $regex: 'finished', $options: 'i' } },
                                        {
                                            endDate: { $lte: new Date() },
                                            status: { $nin: ['UPCOMING', 'Upcoming', 'upcoming', 'LIVE', 'Live', 'live'] }
                                        }
                                    ]
                                },
                                {
                                    status: { $nin: ['UPCOMING', 'Upcoming', 'upcoming', 'LIVE', 'Live', 'live'] }
                                }
                            ]
                        })
                            .sort({ endDate: -1 })
                            .limit(Number(limit))
                            .select('matchId title shortTitle teams venue series endDate result format status');
                        return res.json(recentMatches);
                    }
                }
            }
            catch (apiError) {
                console.error('API fetch failed for recent matches:', apiError);
                // Continue to fallback logic
            }
        }
        // Fallback to database if API config is missing or API call failed
        console.log('Falling back to database for recent matches');
        const dbMatches = await Match_1.default.find({
            $and: [
                {
                    $or: [
                        { status: 'COMPLETED' },
                        { status: 'Complete' },
                        { status: { $regex: 'Complete', $options: 'i' } },
                        { status: { $regex: 'complete', $options: 'i' } },
                        { status: { $regex: 'won', $options: 'i' } },
                        { status: { $regex: 'Finished', $options: 'i' } },
                        { status: { $regex: 'finished', $options: 'i' } },
                        {
                            endDate: { $lte: new Date() },
                            status: { $nin: ['UPCOMING', 'Upcoming', 'upcoming', 'LIVE', 'Live', 'live'] }
                        }
                    ]
                },
                {
                    status: { $nin: ['UPCOMING', 'Upcoming', 'upcoming', 'LIVE', 'Live', 'live'] }
                }
            ]
        })
            .sort({ endDate: -1 })
            .limit(Number(limit))
            .select('matchId title shortTitle teams venue series endDate result format status raw');
        console.log(`Found ${dbMatches.length} matches in database`);
        // Process matches to extract data from raw field if needed
        const processedMatches = dbMatches.map(match => {
            var _a;
            console.log(`Processing match ${match.matchId}:`, {
                hasTitle: !!match.title,
                title: match.title,
                teamsLength: (_a = match.teams) === null || _a === void 0 ? void 0 : _a.length,
                hasRaw: !!match.raw,
                teamsNeedProcessing: !match.teams || match.teams.some(team => !team.score || (team.score.runs === 0 && team.score.wickets === 0 && team.score.overs === 0))
            });
            // Always process if we have raw data, regardless of existing data
            // This ensures we extract scores from raw data even when teams exist but have zero scores
            if (match.raw) {
                console.log(`Processing match ${match.matchId} - has raw data, extracting`);
                return (0, matchRecentHelpers_1.processRawMatchData)(match);
            }
            return match;
        });
        console.log('Returning processed matches');
        return res.json(processedMatches);
    }
    catch (error) {
        console.error('getRecentMatches error:', error);
        // Handle rate limiting
        if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
            // Fallback to database if API rate limit exceeded
            try {
                const { limit = 10 } = req.query;
                const recentMatches = await Match_1.default.find({
                    $and: [
                        {
                            $or: [
                                { status: 'COMPLETED' },
                                { status: 'Complete' },
                                { status: { $regex: 'Complete', $options: 'i' } },
                                { status: { $regex: 'complete', $options: 'i' } },
                                { status: { $regex: 'won', $options: 'i' } },
                                { status: { $regex: 'Finished', $options: 'i' } },
                                { status: { $regex: 'finished', $options: 'i' } },
                                {
                                    endDate: { $lte: new Date() },
                                    status: { $nin: ['UPCOMING', 'Upcoming', 'upcoming', 'LIVE', 'Live', 'live'] }
                                }
                            ]
                        },
                        {
                            status: { $nin: ['UPCOMING', 'Upcoming', 'upcoming', 'LIVE', 'Live', 'live'] }
                        }
                    ]
                })
                    .sort({ endDate: -1 })
                    .limit(Number(limit))
                    .select('matchId title shortTitle teams venue series endDate result format status');
                return res.json(recentMatches);
            }
            catch (dbError) {
                return res.status(500).json({ message: 'Server error', error: dbError.message });
            }
        }
        // Fallback to database if API fails
        try {
            const { limit = 10 } = req.query;
            const recentMatches = await Match_1.default.find({
                $and: [
                    {
                        $or: [
                            { status: 'COMPLETED' },
                            { status: 'Complete' },
                            { status: { $regex: 'Complete', $options: 'i' } },
                            { status: { $regex: 'complete', $options: 'i' } },
                            { status: { $regex: 'won', $options: 'i' } },
                            { status: { $regex: 'Finished', $options: 'i' } },
                            { status: { $regex: 'finished', $options: 'i' } },
                            {
                                endDate: { $lte: new Date() },
                                status: { $nin: ['UPCOMING', 'Upcoming', 'upcoming', 'LIVE', 'Live', 'live'] }
                            }
                        ]
                    },
                    {
                        status: { $nin: ['UPCOMING', 'Upcoming', 'upcoming', 'LIVE', 'Live', 'live'] }
                    }
                ]
            })
                .sort({ endDate: -1 })
                .limit(Number(limit))
                .select('matchId title shortTitle teams venue series endDate result format status');
            res.json(recentMatches);
        }
        catch (dbError) {
            res.status(500).json({ message: 'Server error', error: dbError.message });
        }
    }
};
exports.getRecentMatches = getRecentMatches;
