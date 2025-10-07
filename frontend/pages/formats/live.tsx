import axios from 'axios';
import Link from 'next/link';
import MatchCard from '../../components/MatchCard';
import Navbar from '../../components/Navbar';

type Match = any;

// Helper function to determine if a match is actually completed
const isActuallyCompleted = (match: any) => {
  const status = match?.status || '';
  const lowerStatus = status.toLowerCase();

  // Check for completed status patterns
  return lowerStatus.includes('complete') ||
    lowerStatus.includes('finished') ||
    lowerStatus.includes('won') ||
    lowerStatus.includes('abandon') ||
    lowerStatus.includes('cancel') ||
    lowerStatus.includes('no result') ||
    lowerStatus.includes('tied') ||
    status === 'COMPLETED' ||
    status === 'ABANDONED' ||
    status === 'CANCELLED';
};

export default function LiveMatches({ matches }: { matches: Match[] }) {
  // Filter out completed matches that are incorrectly marked as live
  const filteredMatches = matches.filter((match: any) => !isActuallyCompleted(match));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            Live Cricket Matches
          </h1>
          <Link href="/" className="text-green-400 hover:text-green-300 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {filteredMatches && filteredMatches.length > 0 ? (
            filteredMatches.map((match: any) => (
              <Link key={match.matchId} href={`/matches/${match.matchId}`}>
                <div className="block cursor-pointer mb-4 sm:mb-6">
                  <MatchCard match={match} isLive={true} isCompleted={false} isUpcoming={false} />
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sm:p-8 text-center">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏏</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No Live Matches</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">There are currently no live cricket matches. Check back later!</p>
              <Link href="/" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg inline-block transition text-sm sm:text-base">
                View Upcoming Matches
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://crick-buddy-backend-v.vercel.app';
    const res = await axios.get(`${apiUrl}/api/matches/live`);
    const matches = Array.isArray(res.data) ? res.data : [];
    return { props: { matches } };
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return { props: { matches: [] } };
  }
}
