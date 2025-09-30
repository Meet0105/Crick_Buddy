#!/bin/bash

# Clean up any potential misplaced files that might be cached
echo "Cleaning up potential misplaced files..."

# Remove any files that might be in the wrong locations
rm -rf frontend/pages/series/SeriesTabs.tsx
rm -rf frontend/pages/series/StatsTab.tsx
rm -rf frontend/pages/series/VenuesTab.tsx
rm -rf frontend/pages/series/utils
rm -rf frontend/pages/teams/NewsSection.tsx
rm -rf frontend/pages/teams/ResultsSection.tsx
rm -rf frontend/pages/teams/SchedulesSection.tsx
rm -rf frontend/pages/teams/TeamHeader.tsx
rm -rf frontend/pages/teams/TeamInfo.tsx
rm -rf frontend/pages/teams/TeamNotFound.tsx
rm -rf frontend/pages/teams/utils

# Run the normal build
npm run build