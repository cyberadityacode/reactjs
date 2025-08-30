import { useState, useEffect } from 'react';
import { MatchService } from '../services/matchService';

function LiveScores() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [selectedTab, setSelectedTab] = useState('live');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetchMatches();
    
    // Subscribe to live matches for real-time updates
    const unsubscribe = MatchService.subscribeToLiveMatches((matches) => {
      setLiveMatches(matches);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      // Fetch all matches
      const allResult = await MatchService.getAllMatches();
      if (allResult.success) {
        setAllMatches(allResult.matches);
      }
      
      // Fetch live matches
      const liveResult = await MatchService.getLiveMatches();
      if (liveResult.success) {
        setLiveMatches(liveResult.matches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const getMatchesToDisplay = () => {
    switch (selectedTab) {
      case 'live':
        return liveMatches;
      case 'upcoming':
        return allMatches.filter(match => match.status === 'upcoming');
      case 'completed':
        return allMatches.filter(match => match.status === 'completed');
      default:
        return allMatches;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const calculateRunRate = (score, overs, balls) => {
    const totalBalls = (overs * 6) + balls;
    if (totalBalls === 0) return 0;
    return ((score / totalBalls) * 6).toFixed(2);
  };

  const getMatchResult = (match) => {
    if (match.status !== 'completed') return null;
    
    const team1Total = match.team1Score.runs;
    const team2Total = match.team2Score.runs;
    
    if (team1Total > team2Total) {
      return `${match.team1} won by ${team1Total - team2Total} runs`;
    } else if (team2Total > team1Total) {
      const wicketsRemaining = 10 - match.team2Score.wickets;
      return `${match.team2} won by ${wicketsRemaining} wickets`;
    } else {
      return 'Match tied';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cricket Live Scores</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'live', label: 'Live', count: liveMatches.length },
              { key: 'upcoming', label: 'Upcoming', count: allMatches.filter(m => m.status === 'upcoming').length },
              { key: 'completed', label: 'Completed', count: allMatches.filter(m => m.status === 'completed').length },
              { key: 'all', label: 'All Matches', count: allMatches.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition duration-200`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Matches Display */}
        <div className="space-y-4">
          {getMatchesToDisplay().length > 0 ? (
            getMatchesToDisplay().map((match) => (
              <div 
                key={match.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => setSelectedMatch(selectedMatch?.id === match.id ? null : match)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {match.team1} vs {match.team2}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>📍 {match.venue}</span>
                      <span>🏏 {match.matchType}</span>
                      <span>📅 {new Date(match.scheduledDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(match.status)}`}>
                      {match.status.toUpperCase()}
                    </span>
                    {match.status === 'live' && (
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Display */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-3 rounded ${
                    match.status === 'live' && match.currentInnings === 1 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{match.team1}</span>
                      {match.currentInnings === 1 && match.status === 'live' && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">BATTING</span>
                      )}
                    </div>
                    <div className="text-2xl font-bold">
                      {match.team1Score.runs || 0}/{match.team1Score.wickets || 0}
                    </div>
                    <div className="text-sm text-gray-600 flex justify-between">
                      <span>Overs: {match.team1Score.overs || 0}.{match.team1Score.balls || 0}</span>
                      {(match.team1Score.overs > 0 || match.team1Score.balls > 0) && (
                        <span>RR: {calculateRunRate(match.team1Score.runs, match.team1Score.overs, match.team1Score.balls)}</span>
                      )}
                    </div>
                  </div>

                  <div className={`p-3 rounded ${
                    match.status === 'live' && match.currentInnings === 2 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{match.team2}</span>
                      {match.currentInnings === 2 && match.status === 'live' && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">BATTING</span>
                      )}
                    </div>
                    <div className="text-2xl font-bold">
                      {match.team2Score.runs || 0}/{match.team2Score.wickets || 0}
                    </div>
                    <div className="text-sm text-gray-600 flex justify-between">
                      <span>Overs: {match.team2Score.overs || 0}.{match.team2Score.balls || 0}</span>
                      {(match.team2Score.overs > 0 || match.team2Score.balls > 0) && (
                        <span>RR: {calculateRunRate(match.team2Score.runs, match.team2Score.overs, match.team2Score.balls)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Result or Status */}
                {match.status === 'completed' && match.result && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center">
                    <span className="font-semibold text-green-800">{match.result}</span>
                  </div>
                )}

                {match.status === 'live' && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-center">
                    <span className="font-semibold text-red-800">
                      Live - {match.currentInnings === 1 ? match.team1 : match.team2} batting
                    </span>
                  </div>
                )}

                {match.status === 'upcoming' && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-center">
                    <span className="font-semibold text-blue-800">
                      Starts at {new Date(match.scheduledDate).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Expanded Details */}
                {selectedMatch?.id === match.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Match Details</h4>
                        <p><strong>Type:</strong> {match.matchType} ({match.overs} overs each)</p>
                        <p><strong>Venue:</strong> {match.venue}</p>
                        <p><strong>Scheduled:</strong> {new Date(match.scheduledDate).toLocaleString()}</p>
                        {match.startTime && (
                          <p><strong>Started:</strong> {new Date(match.startTime).toLocaleString()}</p>
                        )}
                        {match.endTime && (
                          <p><strong>Ended:</strong> {new Date(match.endTime).toLocaleString()}</p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Additional Info</h4>
                        {match.description && <p>{match.description}</p>}
                        <p><strong>Last Updated:</strong> {new Date(match.lastUpdated).toLocaleString()}</p>
                        {match.currentInnings && (
                          <p><strong>Current Innings:</strong> {match.currentInnings}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">
                {selectedTab === 'live' && 'No live matches at the moment.'}
                {selectedTab === 'upcoming' && 'No upcoming matches scheduled.'}
                {selectedTab === 'completed' && 'No completed matches found.'}
                {selectedTab === 'all' && 'No matches found.'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Check back later for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveScores;