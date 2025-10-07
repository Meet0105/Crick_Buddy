# Series Issues and Fixes

## Problem 1: Missing Women's Series (ICC Women's World Cup not showing)

### Root Cause
The backend is only fetching from `/series/v1/international` endpoint which returns men's international series only.

### Solution
Add support for multiple series types by fetching from different endpoints:
- `/series/v1/international` - Men's international series
- `/series/v1/women` - Women's series  
- `/series/v1/domestic` - Domestic series
- `/series/v1/league` - League series

### Implementation Plan
1. Update `seriesList.ts` to fetch from multiple endpoints
2. Combine results from all endpoints
3. Store all series types in database with proper `seriesType` field

## Problem 2: Match Not Found for Completed Matches in Series

### Root Cause
When clicking on a match from series schedule, the match details page shows "match not found" because:
1. The match might not be in the database yet
2. The match ID from series schedule might not match the match ID in matches collection
3. The match details endpoint needs to fetch from API if not in database

### Solution
Update match details endpoint to:
1. Check database first
2. If not found, fetch from RapidAPI using the match ID
3. Store the fetched match in database
4. Return the match details

### Current Flow (Broken)
```
User clicks match in series → 
Frontend calls /api/matches/{id} → 
Backend checks database only → 
Match not found → 
Returns 404
```

### Fixed Flow
```
User clicks match in series → 
Frontend calls /api/matches/{id} → 
Backend checks database → 
If not found, fetch from API → 
Store in database → 
Return match details
```

## Files to Modify

### 1. backend/src/controllers/series/seriesList.ts
Add multi-endpoint fetching for different series types

### 2. backend/src/controllers/match/matchDetails.ts (or similar)
Add API fallback when match not found in database

### 3. backend/.env
Add new environment variables:
```
RAPIDAPI_SERIES_WOMEN_URL=https://cricbuzz-cricket.p.rapidapi.com/series/v1/women
RAPIDAPI_SERIES_DOMESTIC_URL=https://cricbuzz-cricket.p.rapidapi.com/series/v1/domestic
RAPIDAPI_SERIES_LEAGUE_URL=https://cricbuzz-cricket.p.rapidapi.com/series/v1/league
```

## Priority
1. Fix "match not found" issue first (more critical for user experience)
2. Then add women's/domestic series support

## Testing Plan
1. Test West Indies tour of India series
2. Click on completed Test match
3. Verify match details page loads
4. Test with women's series once added
