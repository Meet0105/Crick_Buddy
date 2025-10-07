import React from 'react';
import Link from 'next/link';
import { extractTeamInfo, extractMatchInfo, getMatchStatusColor } from '../../utils/matches/matchHelpers';

interface MatchHeaderProps {
  currentMatch: any;
  isLive: boolean;
  status: string;
  format: string;
  venue: string;
  matchDate: string;
  matchTime: string;
  syncMatchDetails: () => void;
  syncing: boolean;
}

export const MatchHeader: React.FC<MatchHeaderProps> = ({
  currentMatch,
  isLive,
  status,
  format,
  venue,
  matchDate,
  matchTime,
  syncMatchDetails,
  syncing
}) => {
  const { team1Name, team2Name, team1Score, team2Score } = extractTeamInfo(currentMatch);
  const statusColor = getMatchStatusColor(isLive, status);

  // Get team names from raw data if available
  const actualTeam1Name = currentMatch?.teams?.[0]?.teamName || 
                          currentMatch?.raw?.matchInfo?.team1?.teamName || 
                          currentMatch?.raw?.matchInfo?.team1?.name || 
                          team1Name;
                          
  const actualTeam2Name = currentMatch?.teams?.[1]?.teamName || 
                          currentMatch?.raw?.matchInfo?.team2?.teamName || 
                          currentMatch?.raw?.matchInfo?.team2?.name || 
                          team2Name;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700">
      <div className={`p-3 sm:p-4 ${statusColor} text-white`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="font-bold text-sm sm:text-base">{format}</span>
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="font-bold text-sm sm:text-base">{isLive ? 'LIVE' : status}</span>
            <button
              onClick={syncMatchDetails}
              disabled={syncing}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded text-xs sm:text-sm transition disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <h1 className="text-lg sm:text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2 px-2">
          {currentMatch.title || `${actualTeam1Name} vs ${actualTeam2Name}`}
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 px-2">{currentMatch.series?.name || 'Series TBA'}</p>
        
        <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
          <div className="text-center flex-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
              <span className="text-green-800 dark:text-green-200 font-bold text-sm sm:text-lg">{actualTeam1Name.substring(0, 3).toUpperCase()}</span>
            </div>
            <h3 className="font-bold text-xs sm:text-base text-gray-800 dark:text-gray-100 truncate px-1">{actualTeam1Name}</h3>
            {(team1Score.runs > 0 || team1Score.wickets > 0) && (
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                {team1Score.runs}/{team1Score.wickets}
              </p>
            )}
            {team1Score.overs > 0 && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">({team1Score.overs} ov)</p>
            )}
          </div>
          
          <div className="text-center flex-shrink-0 px-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
              {isLive || status === 'COMPLETED' || status.includes('Complete') || status.includes('won') ? (
                <span>VS</span>
              ) : (
                <span>VS</span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 whitespace-nowrap">
              {matchDate}
            </p>
            {matchTime && (
              <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">{matchTime}</p>
            )}
          </div>
          
          <div className="text-center flex-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
              <span className="text-green-800 dark:text-green-200 font-bold text-sm sm:text-lg">{actualTeam2Name.substring(0, 3).toUpperCase()}</span>
            </div>
            <h3 className="font-bold text-xs sm:text-base text-gray-800 dark:text-gray-100 truncate px-1">{actualTeam2Name}</h3>
            {(team2Score.runs > 0 || team2Score.wickets > 0) && (
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                {team2Score.runs}/{team2Score.wickets}
              </p>
            )}
            {team2Score.overs > 0 && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">({team2Score.overs} ov)</p>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 text-xs sm:text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Venue</p>
              <p className="font-medium text-gray-800 dark:text-gray-100 break-words">{venue}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-gray-500 dark:text-gray-400">Date & Time</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{matchDate} {matchTime}</p>
            </div>
          </div>
        </div>

        {/* Result */}
        {currentMatch.result?.resultText && (
          <div className="mt-3 sm:mt-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
            <p className="text-green-800 dark:text-green-300 font-medium text-center text-xs sm:text-base">
              {currentMatch.result.resultText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};