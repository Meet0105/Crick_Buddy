#!/bin/bash

# Clean up any potential misplaced files that might be cached
echo "Cleaning up potential misplaced files..."

# Remove any files that might be in the wrong locations
rm -rf frontend/pages/series/SeriesTabs.tsx 2>/dev/null || true
rm -rf frontend/pages/series/StatsTab.tsx 2>/dev/null || true
rm -rf frontend/pages/series/VenuesTab.tsx 2>/dev/null || true
rm -rf frontend/pages/series/utils 2>/dev/null || true
rm -rf frontend/pages/teams/NewsSection.tsx 2>/dev/null || true
rm -rf frontend/pages/teams/ResultsSection.tsx 2>/dev/null || true
rm -rf frontend/pages/teams/SchedulesSection.tsx 2>/dev/null || true
rm -rf frontend/pages/teams/TeamHeader.tsx 2>/dev/null || true
rm -rf frontend/pages/teams/TeamInfo.tsx 2>/dev/null || true
rm -rf frontend/pages/teams/TeamNotFound.tsx 2>/dev/null || true
rm -rf frontend/pages/teams/utils 2>/dev/null || true

# Navigate to frontend directory and run the normal build
cd frontend
npm run build