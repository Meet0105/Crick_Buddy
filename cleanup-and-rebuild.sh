#!/bin/bash

# This script cleans up any potential misplaced files and ensures correct structure

echo "Starting cleanup process..."

# Remove any potential misplaced files that might exist due to case sensitivity or caching issues
echo "Removing potential misplaced files..."

# Navigate to frontend directory
cd frontend

# Remove any files that might be in wrong locations (be very specific)
rm -f pages/series/MatchesTab.tsx 2>/dev/null || true
rm -f pages/series/SeriesInfo.tsx 2>/dev/null || true
rm -f pages/series/SeriesStatus.tsx 2>/dev/null || true
rm -f pages/series/SeriesTabs.tsx 2>/dev/null || true
rm -f pages/series/StatsTab.tsx 2>/dev/null || true
rm -f pages/series/VenuesTab.tsx 2>/dev/null || true
rm -f pages/series/utils/seriesDataFetching.ts 2>/dev/null || true
rm -f pages/series/utils/seriesTypes.ts 2>/dev/null || true
rm -f pages/teams/NewsSection.tsx 2>/dev/null || true
rm -f pages/teams/ResultsSection.tsx 2>/dev/null || true
rm -f pages/teams/SchedulesSection.tsx 2>/dev/null || true
rm -f pages/teams/TeamHeader.tsx 2>/dev/null || true
rm -f pages/teams/TeamInfo.tsx 2>/dev/null || true
rm -f pages/teams/TeamNotFound.tsx 2>/dev/null || true
rm -f pages/teams/utils/teamDataFetching.ts 2>/dev/null || true
rm -f pages/teams/utils/teamTypes.ts 2>/dev/null || true

# Remove any directories that might exist
rm -rf pages/series/utils 2>/dev/null || true
rm -rf pages/teams/utils 2>/dev/null || true

# Clean Next.js build artifacts
echo "Cleaning Next.js build artifacts..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true

# Run build
echo "Running build..."
npm run build

echo "Cleanup and build completed successfully!"