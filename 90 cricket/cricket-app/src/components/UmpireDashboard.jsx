import { useState, useEffect } from 'react';
import { MatchService } from '../services/matchService';
import { RoleService } from '../services/roleService';
import BallByBallScorer from './BallByBallScorer';

function UmpireDashboard({ user }) {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUmpire, setIsUmpire] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkUmpireStatus();
  }, [user]);

  useEffect(() => {
    if (isUmpire) {
      fetchUmpireMatches();
    }
  }, [isUmpire]);

  const checkUmpireStatus = async () => {
    if (user) {
      const umpireStatus = await RoleService.isUmpire(user.uid);
      setIsUmpire(umpireStatus);
      setLoading(false);
    }
  };

  const fetchUmpireMatches = async () => {
    try {
      const result = await MatchService.getMatchesByUmpire(user.uid);
      if (result.success) {
        setMatches(result.matches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to fetch matches');
    }
  };

  const handleStartMatch = async (matchId) => {
    try {
      setError('');
      setSuccess('');
      
      const result = await MatchService.startMatch(matchId, user.uid);
      
      if (result.success) {
        setSuccess('Match started successfully!');
        await fetchUmpireMatches();
        
        // Auto-select this match for scoring
        const match = matches.find(m => m.id === matchId);
        if (match) {
          setSelectedMatch({ ...match, status: 'live' });
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to start match');
    }
  };

  const handleEndMatch = async (matchId, result) => {
    try {
      setError('');
      setSuccess('');
      
      const matchResult = await MatchService.endMatch(matchId, user.uid, result);
      
      if (matchResult.success) {
        setSuccess('Match ended successfully!');
        await fetchUmpireMatches();
        setSelectedMatch(null);
      } else {
        setError(matchResult.error);
      }
    } catch (error) {
      setError('Failed to end match');
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Please log in to access the umpire dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isUmpire) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Umpire Access Required</h2>
          <p className="text-yellow-700">
            You need umpire privileges to access this dashboard. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Umpire Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Matches List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Assigned Matches</h2>
            
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div 
                    key={match.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedMatch?.id === match.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMatch(match)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {match.team1} vs {match.team2}
                      </h3>
                      <span 
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          match.status === 'live' 
                            ? 'bg-red-100 text-red-800' 
                            : match.status === 'completed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {match.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📍 {match.venue}</p>
                      <p>🏏 {match.matchType} ({match.overs} overs)</p>
                      <p>📅 {new Date(match.scheduledDate).toLocaleString()}</p>
                    </div>

                    {match.status === 'live' && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between">
                          <span>{match.team1}: {match.team1Score?.runs || 0}/{match.team1Score?.wickets || 0}</span>
                          <span>Overs: {match.team1Score?.overs || 0}.{match.team1Score?.balls || 0}</span>
                        </div>
                        {match.currentInnings === 2 && (
                          <div className="flex justify-between mt-1">
                            <span>{match.team2}: {match.team2Score?.runs || 0}/{match.team2Score?.wickets || 0}</span>
                            <span>Overs: {match.team2Score?.overs || 0}.{match.team2Score?.balls || 0}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex space-x-2">
                      {match.status === 'upcoming' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartMatch(match.id);
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-200"
                        >
                          Start Match
                        </button>
                      )}
                      
                      {match.status === 'live' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const result = prompt('Enter match result (e.g., "Team A won by 5 wickets")');
                            if (result) {
                              handleEndMatch(match.id, result);
                            }
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-200"
                        >
                          End Match
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 bg-gray-50 p-4 rounded">
                No matches assigned to you yet.
              </p>
            )}
          </div>

          {/* Ball-by-Ball Scoring Panel */}
          <div>
            {selectedMatch ? (
              selectedMatch.status === 'live' ? (
                <BallByBallScorer 
                  match={selectedMatch} 
                  umpireId={user.uid}
                  onScoreUpdate={() => {
                    fetchUmpireMatches();
                    setSuccess('Score updated successfully!');
                  }}
                  onError={setError}
                />
              ) : (
                <ScoreUpdatePanel 
                  match={selectedMatch} 
                  umpireId={user.uid}
                  onScoreUpdate={() => {
                    fetchUmpireMatches();
                    setSuccess('Score updated successfully!');
                  }}
                  onError={setError}
                />
              )
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Ball-by-Ball Scoring</h3>
                <p className="text-gray-600">Select a live match to start ball-by-ball scoring.</p>
                <p className="text-sm text-gray-500 mt-2">Live matches will show the ball-by-ball scoring interface with undo functionality.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Score Update Panel Component
function ScoreUpdatePanel({ match, umpireId, onScoreUpdate, onError }) {
  const [scoreData, setScoreData] = useState({
    currentInnings: match.currentInnings || 1,
    team1Score: match.team1Score || { runs: 0, wickets: 0, overs: 0, balls: 0 },
    team2Score: match.team2Score || { runs: 0, wickets: 0, overs: 0, balls: 0 }
  });

  const updateScore = async (updates) => {
    try {
      const result = await MatchService.updateScore(match.id, updates, umpireId);
      
      if (result.success) {
        onScoreUpdate();
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError('Failed to update score');
    }
  };

  const addRuns = (runs) => {
    const currentTeam = scoreData.currentInnings === 1 ? 'team1Score' : 'team2Score';
    const newScore = {
      ...scoreData[currentTeam],
      runs: scoreData[currentTeam].runs + runs
    };
    
    const updates = {
      [currentTeam]: newScore
    };
    
    setScoreData(prev => ({ ...prev, [currentTeam]: newScore }));
    updateScore(updates);
  };

  const addWicket = () => {
    const currentTeam = scoreData.currentInnings === 1 ? 'team1Score' : 'team2Score';
    const newScore = {
      ...scoreData[currentTeam],
      wickets: scoreData[currentTeam].wickets + 1
    };
    
    const updates = {
      [currentTeam]: newScore
    };
    
    setScoreData(prev => ({ ...prev, [currentTeam]: newScore }));
    updateScore(updates);
  };

  const addBall = () => {
    const currentTeam = scoreData.currentInnings === 1 ? 'team1Score' : 'team2Score';
    let { overs, balls } = scoreData[currentTeam];
    
    balls += 1;
    if (balls === 6) {
      overs += 1;
      balls = 0;
    }
    
    const newScore = {
      ...scoreData[currentTeam],
      overs,
      balls
    };
    
    const updates = {
      [currentTeam]: newScore
    };
    
    setScoreData(prev => ({ ...prev, [currentTeam]: newScore }));
    updateScore(updates);
  };

  const switchInnings = () => {
    const newInnings = scoreData.currentInnings === 1 ? 2 : 1;
    const updates = { currentInnings: newInnings };
    
    setScoreData(prev => ({ ...prev, currentInnings: newInnings }));
    updateScore(updates);
  };

  if (match.status !== 'live') {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Match Not Live</h3>
        <p className="text-gray-600">This match is not currently live for scoring.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Update Scores</h3>
      
      {/* Current Score Display */}
      <div className="mb-6 space-y-3">
        <div className={`p-3 rounded ${scoreData.currentInnings === 1 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-100'}`}>
          <h4 className="font-semibold">{match.team1}</h4>
          <p className="text-2xl font-bold">
            {scoreData.team1Score.runs}/{scoreData.team1Score.wickets}
          </p>
          <p className="text-sm text-gray-600">
            Overs: {scoreData.team1Score.overs}.{scoreData.team1Score.balls}
          </p>
        </div>
        
        <div className={`p-3 rounded ${scoreData.currentInnings === 2 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-100'}`}>
          <h4 className="font-semibold">{match.team2}</h4>
          <p className="text-2xl font-bold">
            {scoreData.team2Score.runs}/{scoreData.team2Score.wickets}
          </p>
          <p className="text-sm text-gray-600">
            Overs: {scoreData.team2Score.overs}.{scoreData.team2Score.balls}
          </p>
        </div>
      </div>

      {/* Current Innings Indicator */}
      <div className="mb-4 p-2 bg-blue-50 rounded text-center">
        <p className="font-semibold text-blue-800">
          Current Innings: {scoreData.currentInnings === 1 ? match.team1 : match.team2}
        </p>
      </div>

      {/* Scoring Buttons */}
      <div className="space-y-4">
        <div>
          <p className="font-semibold mb-2">Add Runs:</p>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
              <button
                key={runs}
                onClick={() => {
                  addRuns(runs);
                  if (runs > 0) addBall(); // Add ball for runs (not for extras)
                }}
                className="bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition duration-200"
              >
                {runs}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              addWicket();
              addBall();
            }}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
          >
            Wicket
          </button>
          
          <button
            onClick={addBall}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Dot Ball
          </button>
        </div>

        <button
          onClick={switchInnings}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-200"
        >
          Switch to Innings {scoreData.currentInnings === 1 ? '2' : '1'}
        </button>
      </div>
    </div>
  );
}

export default UmpireDashboard;