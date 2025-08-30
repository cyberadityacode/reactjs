import { useState, useEffect } from 'react';
import { MatchService } from '../services/matchService';

// Ball outcome types
const BALL_TYPES = {
  DOT: 'dot',
  RUNS: 'runs',
  WICKET: 'wicket',
  WIDE: 'wide',
  NO_BALL: 'no_ball',
  BYE: 'bye',
  LEG_BYE: 'leg_bye',
  FOUR: 'four',
  SIX: 'six'
};

// Dismissal types
const DISMISSAL_TYPES = {
  BOWLED: 'bowled',
  CAUGHT: 'caught',
  LBW: 'lbw',
  STUMPED: 'stumped',
  RUN_OUT: 'run_out',
  HIT_WICKET: 'hit_wicket',
  RETIRED: 'retired'
};

function BallByBallScorer({ match, umpireId, onScoreUpdate, onError }) {
  const [currentBall, setCurrentBall] = useState({
    type: '',
    runs: 0,
    dismissal: null,
    extras: 0
  });

  const [matchState, setMatchState] = useState({
    currentInnings: match.currentInnings || 1,
    team1Score: match.team1Score || { runs: 0, wickets: 0, overs: 0, balls: 0 },
    team2Score: match.team2Score || { runs: 0, wickets: 0, overs: 0, balls: 0 },
    ballHistory: match.ballHistory || []
  });

  const [showDismissalModal, setShowDismissalModal] = useState(false);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);
  const [showInningsCompleteModal, setShowInningsCompleteModal] = useState(false);
  const [showMatchCompleteModal, setShowMatchCompleteModal] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  // Update match state when match prop changes
  useEffect(() => {
    setMatchState(prevState => ({
      ...prevState,
      currentInnings: match.currentInnings || 1,
      team1Score: match.team1Score || { runs: 0, wickets: 0, overs: 0, balls: 0 },
      team2Score: match.team2Score || { runs: 0, wickets: 0, overs: 0, balls: 0 },
      ballHistory: match.ballHistory || []
    }));
  }, [match]);

  // Check if innings or match should be completed automatically
  const checkInningsCompletion = (newScore, innings) => {
    const maxOvers = match.overs || 20; // Default to 20 overs if not specified
    
    // Only check over limit for limited over matches (match.overs > 0)
    const oversCompleted = match.overs > 0 && newScore.overs >= maxOvers;
    const allWicketsDown = newScore.wickets >= 10;
    const isInningsComplete = oversCompleted || allWicketsDown;
    
    if (isInningsComplete) {
      if (innings === 1) {
        // First innings complete, switch to second innings
        setShowInningsCompleteModal(true);
        return { switchInnings: true, matchComplete: false };
      } else {
        // Second innings complete, determine winner
        return { switchInnings: false, matchComplete: true };
      }
    }
    
    return { switchInnings: false, matchComplete: false };
  };

  // Determine match winner
  const determineWinner = (team1Score, team2Score) => {
    if (team2Score.runs > team1Score.runs) {
      // Team 2 won (chasing team)
      const wicketsLeft = 10 - team2Score.wickets;
      
      if (match.overs > 0) {
        const ballsUsed = (team2Score.overs * 6) + team2Score.balls;
        const totalBalls = match.overs * 6;
        const ballsLeft = totalBalls - ballsUsed;
        
        if (ballsLeft > 0) {
          const oversLeft = Math.floor(ballsLeft / 6);
          const ballsInOver = ballsLeft % 6;
          return {
            winner: match.team2,
            result: `${match.team2} won by ${wicketsLeft} wickets with ${oversLeft}.${ballsInOver} overs remaining`
          };
        } else {
          return {
            winner: match.team2,
            result: `${match.team2} won by ${wicketsLeft} wickets`
          };
        }
      } else {
        return {
          winner: match.team2,
          result: `${match.team2} won by ${wicketsLeft} wickets`
        };
      }
    } else if (team1Score.runs > team2Score.runs) {
      // Team 1 won (batting first team)
      const margin = team1Score.runs - team2Score.runs;
      return {
        winner: match.team1,
        result: `${match.team1} won by ${margin} runs`
      };
    } else {
      // Scores are tied
      return {
        winner: 'Tie',
        result: 'Match Tied'
      };
    }
  };

  // Check for target completion in second innings
  const checkTargetCompletion = (team2Score, team1Score) => {
    if (matchState.currentInnings === 2 && team2Score.runs > team1Score.runs) {
      return true;
    }
    return false;
  };

  const getCurrentTeamScore = () => {
    return matchState.currentInnings === 1 ? matchState.team1Score : matchState.team2Score;
  };

  const getCurrentTeamName = () => {
    return matchState.currentInnings === 1 ? match.team1 : match.team2;
  };

  const updateMatchScore = async (ballData) => {
    try {
      const currentTeam = matchState.currentInnings === 1 ? 'team1Score' : 'team2Score';
      const currentScore = getCurrentTeamScore();
      
      let newRuns = currentScore.runs;
      let newWickets = currentScore.wickets;
      let newOvers = currentScore.overs;
      let newBalls = currentScore.balls;

      // Calculate runs (including extras)
      newRuns += ballData.runs + ballData.extras;

      // Handle wickets
      if (ballData.type === BALL_TYPES.WICKET) {
        newWickets += 1;
      }

      // Handle balls (extras don't count as balls except for wides and no-balls)
      const ballCounts = [BALL_TYPES.DOT, BALL_TYPES.RUNS, BALL_TYPES.WICKET, BALL_TYPES.FOUR, BALL_TYPES.SIX, BALL_TYPES.BYE, BALL_TYPES.LEG_BYE];
      if (ballCounts.includes(ballData.type)) {
        newBalls += 1;
        if (newBalls === 6) {
          newOvers += 1;
          newBalls = 0;
        }
      }

      const newScore = {
        runs: newRuns,
        wickets: newWickets,
        overs: newOvers,
        balls: newBalls
      };

      // Add ball to history
      const ballRecord = {
        ...ballData,
        ballNumber: currentScore.overs * 6 + currentScore.balls + 1,
        timestamp: new Date().toISOString(),
        innings: matchState.currentInnings
      };

      // Check for target completion in second innings (team 2 chases and exceeds target)
      const targetReached = matchState.currentInnings === 2 && 
        checkTargetCompletion(newScore, matchState.team1Score);
      
      // Check for automatic innings/match completion
      const completionCheck = checkInningsCompletion(newScore, matchState.currentInnings);

      if (targetReached || completionCheck.matchComplete) {
        // Match is complete, determine winner
        const finalTeam1Score = matchState.currentInnings === 1 ? newScore : matchState.team1Score;
        const finalTeam2Score = matchState.currentInnings === 2 ? newScore : matchState.team2Score;
        const winner = determineWinner(finalTeam1Score, finalTeam2Score);
        
        const updates = {
          [currentTeam]: newScore,
          ballHistory: [...(match.ballHistory || []), ballRecord],
          status: 'completed',
          result: winner.result,
          winner: winner.winner,
          endTime: new Date().toISOString(),
          autoCompleted: true
        };
        
        setMatchResult(winner);
        setShowMatchCompleteModal(true);
        
        // Update local state
        setMatchState(prev => ({
          ...prev,
          [currentTeam]: newScore,
          ballHistory: [...(prev.ballHistory || []), ballRecord]
        }));
        
        // Update match in Firebase
        const result = await MatchService.updateScore(match.id, updates, umpireId);
        
        if (result.success) {
          onScoreUpdate();
          setCurrentBall({ type: '', runs: 0, dismissal: null, extras: 0 });
        } else {
          onError(result.error);
        }
        return;
      }
      
      if (completionCheck.switchInnings) {
        // First innings complete, prepare for switch
        const updates = {
          [currentTeam]: newScore,
          ballHistory: [...(match.ballHistory || []), ballRecord]
        };
        
        // Update local state
        setMatchState(prev => ({
          ...prev,
          [currentTeam]: newScore,
          ballHistory: [...(prev.ballHistory || []), ballRecord]
        }));
        
        // Update match in Firebase
        const result = await MatchService.updateScore(match.id, updates, umpireId);
        
        if (result.success) {
          onScoreUpdate();
          setCurrentBall({ type: '', runs: 0, dismissal: null, extras: 0 });
        } else {
          onError(result.error);
        }
        return;
      }

      const updates = {
        [currentTeam]: newScore,
        ballHistory: [...(match.ballHistory || []), ballRecord]
      };

      // Update local state
      setMatchState(prev => ({
        ...prev,
        [currentTeam]: newScore,
        ballHistory: [...(prev.ballHistory || []), ballRecord]
      }));

      // Update match in Firebase
      const result = await MatchService.updateScore(match.id, updates, umpireId);
      
      if (result.success) {
        onScoreUpdate();
        setCurrentBall({ type: '', runs: 0, dismissal: null, extras: 0 });
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError('Failed to update score');
      console.error('Score update error:', error);
    }
  };

  const handleBallSubmit = (ballType, runs = 0, extras = 0) => {
    const ballData = {
      type: ballType,
      runs: runs,
      extras: extras,
      dismissal: ballType === BALL_TYPES.WICKET ? showDismissalModal : null
    };

    if (ballType === BALL_TYPES.WICKET) {
      setCurrentBall(ballData);
      setShowDismissalModal(true);
    } else if ([BALL_TYPES.WIDE, BALL_TYPES.NO_BALL].includes(ballType)) {
      setCurrentBall(ballData);
      setShowExtrasModal(true);
    } else {
      updateMatchScore(ballData);
    }
  };

  const handleDismissalSubmit = (dismissalType) => {
    const ballData = {
      ...currentBall,
      dismissal: dismissalType
    };
    updateMatchScore(ballData);
    setShowDismissalModal(false);
  };

  const handleExtrasSubmit = (extraRuns) => {
    const ballData = {
      ...currentBall,
      extras: extraRuns + 1 // +1 for the wide/no-ball penalty
    };
    updateMatchScore(ballData);
    setShowExtrasModal(false);
  };

  // Undo last ball functionality
  const undoLastBall = async () => {
    try {
      const ballHistory = matchState.ballHistory || [];
      if (ballHistory.length === 0) {
        onError('No balls to undo');
        return;
      }

      const lastBall = ballHistory[ballHistory.length - 1];
      const currentTeam = lastBall.innings === 1 ? 'team1Score' : 'team2Score';
      const currentScore = lastBall.innings === 1 ? matchState.team1Score : matchState.team2Score;

      // Reverse the score changes
      let newRuns = currentScore.runs - (lastBall.runs + lastBall.extras);
      let newWickets = currentScore.wickets - (lastBall.type === BALL_TYPES.WICKET ? 1 : 0);
      let newOvers = currentScore.overs;
      let newBalls = currentScore.balls;

      // Reverse ball count (only for balls that counted)
      const ballCounts = [BALL_TYPES.DOT, BALL_TYPES.RUNS, BALL_TYPES.WICKET, BALL_TYPES.FOUR, BALL_TYPES.SIX, BALL_TYPES.BYE, BALL_TYPES.LEG_BYE];
      if (ballCounts.includes(lastBall.type)) {
        newBalls -= 1;
        if (newBalls < 0) {
          newOvers -= 1;
          newBalls = 5;
        }
      }

      const newScore = {
        runs: Math.max(0, newRuns),
        wickets: Math.max(0, newWickets),
        overs: Math.max(0, newOvers),
        balls: Math.max(0, newBalls)
      };

      // Remove last ball from history
      const updatedBallHistory = ballHistory.slice(0, -1);

      const updates = {
        [currentTeam]: newScore,
        ballHistory: updatedBallHistory
      };

      // Update local state
      setMatchState(prev => ({
        ...prev,
        [currentTeam]: newScore,
        ballHistory: updatedBallHistory
      }));

      // Update match in Firebase
      const result = await MatchService.updateScore(match.id, updates, umpireId);
      
      if (result.success) {
        onScoreUpdate();
        setShowUndoConfirm(false);
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError('Failed to undo last ball');
      console.error('Undo error:', error);
    }
  };

  const switchInnings = async () => {
    try {
      const newInnings = matchState.currentInnings === 1 ? 2 : 1;
      const updates = { currentInnings: newInnings };
      
      const result = await MatchService.updateScore(match.id, updates, umpireId);
      
      if (result.success) {
        setMatchState(prev => ({ ...prev, currentInnings: newInnings }));
        setShowInningsCompleteModal(false);
        onScoreUpdate();
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError('Failed to switch innings');
    }
  };

  if (match.status !== 'live') {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Match Not Live</h3>
        <p className="text-gray-600">This match is not currently live for ball-by-ball scoring.</p>
      </div>
    );
  }

  const currentScore = getCurrentTeamScore();

  return (
    <div className="bg-white border rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Ball-by-Ball Scoring</h3>
      
      {/* Current Score Display */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-blue-800">
            {getCurrentTeamName()} - Innings {matchState.currentInnings}
          </h4>
          <div className="text-3xl font-bold text-blue-900">
            {currentScore.runs}/{currentScore.wickets}
          </div>
          <div className="text-lg text-blue-700">
            Overs: {currentScore.overs}.{currentScore.balls}
            {match.overs > 0 && (
              <span className="text-sm ml-2">/ {match.overs} overs</span>
            )}
          </div>
          
          {/* Target Information for Second Innings */}
          {matchState.currentInnings === 2 && matchState.team1Score.runs > 0 && (
            <div className="text-sm text-blue-600 mt-2 p-2 bg-blue-100 rounded">
              <div><strong>Target:</strong> {matchState.team1Score.runs + 1} runs</div>
              <div>
                <strong>Required:</strong> {Math.max(0, matchState.team1Score.runs + 1 - currentScore.runs)} runs
                {match.overs > 0 && (
                  <span> from {(match.overs - currentScore.overs) * 6 - currentScore.balls} balls</span>
                )}
              </div>
              {match.overs > 0 && (
                <div className="text-xs mt-1">
                  <strong>Required RR:</strong> {
                    (() => {
                      const required = Math.max(0, matchState.team1Score.runs + 1 - currentScore.runs);
                      const ballsLeft = (match.overs - currentScore.overs) * 6 - currentScore.balls;
                      return ballsLeft > 0 ? (required / ballsLeft * 6).toFixed(2) : '0.00';
                    })()
                  }
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current Players */}
        <div className="text-sm text-blue-700">
          <div><strong>Current Innings:</strong> {getCurrentTeamName()}</div>
          {match.overs > 0 && (
            <div className="mt-1">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((currentScore.overs / match.overs) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1">
                {currentScore.overs} of {match.overs} overs completed 
                ({match.overs > 0 ? Math.round((currentScore.overs / match.overs) * 100) : 0}%)
                {/* Warning when approaching over limit */}
                {currentScore.overs >= match.overs - 1 && currentScore.overs < match.overs && (
                  <span className="text-red-600 font-semibold ml-2">
                    ⚠️ Final over!
                  </span>
                )}
                {currentScore.overs >= match.overs && (
                  <span className="text-red-600 font-semibold ml-2">
                    🏁 Innings Complete!
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ball Type Buttons */}
      <div className="space-y-4">
        {/* Runs */}
        <div>
          <h5 className="font-semibold mb-2">Runs Scored:</h5>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleBallSubmit(BALL_TYPES.DOT, 0)}
              className="bg-gray-500 text-white py-2 px-3 rounded hover:bg-gray-600 transition duration-200"
            >
              Dot Ball
            </button>
            {[1, 2, 3].map((runs) => (
              <button
                key={runs}
                onClick={() => handleBallSubmit(BALL_TYPES.RUNS, runs)}
                className="bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition duration-200"
              >
                {runs}
              </button>
            ))}
            <button
              onClick={() => handleBallSubmit(BALL_TYPES.FOUR, 4)}
              className="bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition duration-200"
            >
              FOUR
            </button>
            <button
              onClick={() => handleBallSubmit(BALL_TYPES.SIX, 6)}
              className="bg-purple-600 text-white py-2 px-3 rounded hover:bg-purple-700 transition duration-200"
            >
              SIX
            </button>
            <button
              onClick={() => handleBallSubmit(BALL_TYPES.WICKET, 0)}
              className="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition duration-200"
            >
              WICKET
            </button>
            <button
              onClick={() => handleBallSubmit(BALL_TYPES.BYE, 0)}
              className="bg-yellow-600 text-white py-2 px-3 rounded hover:bg-yellow-700 transition duration-200"
            >
              BYE
            </button>
          </div>
        </div>

        {/* Extras */}
        <div>
          <h5 className="font-semibold mb-2">Extras:</h5>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleBallSubmit(BALL_TYPES.WIDE)}
              className="bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 transition duration-200"
            >
              Wide
            </button>
            <button
              onClick={() => handleBallSubmit(BALL_TYPES.NO_BALL)}
              className="bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition duration-200"
            >
              No Ball
            </button>
            <button
              onClick={() => handleBallSubmit(BALL_TYPES.LEG_BYE, 0)}
              className="bg-indigo-600 text-white py-2 px-3 rounded hover:bg-indigo-700 transition duration-200"
            >
              Leg Bye
            </button>
          </div>
        </div>

        {/* Match Control */}
        <div className="border-t pt-4 space-y-2">
          <button
            onClick={switchInnings}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded hover:bg-purple-700 transition duration-200 font-semibold"
          >
            End Innings / Switch to Innings {matchState.currentInnings === 1 ? '2' : '1'}
          </button>
          
          {/* Undo Button */}
          {(matchState.ballHistory || []).length > 0 && (
            <button
              onClick={() => setShowUndoConfirm(true)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200 font-semibold"
            >
              Undo Last Ball
            </button>
          )}
        </div>
      </div>

      {/* Recent Balls History */}
      <div className="border-t pt-4">
        <h5 className="font-semibold mb-2">Recent Balls ({(matchState.ballHistory || []).length} total):</h5>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {(matchState.ballHistory || []).slice(-10).map((ball, index) => (
            <div
              key={index}
              className={`min-w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                ball.type === BALL_TYPES.WICKET ? 'bg-red-500' :
                ball.type === BALL_TYPES.FOUR ? 'bg-blue-500' :
                ball.type === BALL_TYPES.SIX ? 'bg-purple-500' :
                ball.type === BALL_TYPES.DOT ? 'bg-gray-500' :
                ball.type === BALL_TYPES.WIDE ? 'bg-orange-500' :
                ball.type === BALL_TYPES.NO_BALL ? 'bg-red-400' :
                'bg-green-500'
              }`}
              title={`Ball ${ball.ballNumber}: ${ball.type} - ${ball.runs + ball.extras} runs`}
            >
              {ball.type === BALL_TYPES.WICKET ? 'W' :
               ball.type === BALL_TYPES.DOT ? '•' :
               ball.type === BALL_TYPES.WIDE ? 'Wd' :
               ball.type === BALL_TYPES.NO_BALL ? 'Nb' :
               ball.runs + ball.extras}
            </div>
          ))}
        </div>
      </div>

      {/* Dismissal Modal */}
      {showDismissalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h4 className="text-lg font-bold mb-4">Select Dismissal Type</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(DISMISSAL_TYPES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleDismissalSubmit(value)}
                  className="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition duration-200 capitalize"
                >
                  {value.replace('_', ' ')}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDismissalModal(false)}
              className="w-full mt-4 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Extras Modal */}
      {showExtrasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h4 className="text-lg font-bold mb-4">Additional Runs from {currentBall.type.replace('_', ' ')}</h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[0, 1, 2, 3, 4].map((runs) => (
                <button
                  key={runs}
                  onClick={() => handleExtrasSubmit(runs)}
                  className="bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 transition duration-200"
                >
                  +{runs}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowExtrasModal(false)}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Undo Confirmation Modal */}
      {showUndoConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h4 className="text-lg font-bold mb-4 text-red-600">Confirm Undo</h4>
            <p className="mb-4">Are you sure you want to undo the last ball? This action cannot be reversed.</p>
            {(matchState.ballHistory || []).length > 0 && (
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <p className="text-sm"><strong>Last Ball:</strong></p>
                <p className="text-sm">
                  {(() => {
                    const lastBall = (matchState.ballHistory || [])[(matchState.ballHistory || []).length - 1];
                    if (!lastBall) return 'No balls recorded';
                    return `${lastBall.type.replace('_', ' ')} - ${lastBall.runs + lastBall.extras} runs`;
                  })()} 
                </p>
              </div>
            )}
            <div className="flex space-x-2">
              <button
                onClick={undoLastBall}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
              >
                Yes, Undo
              </button>
              <button
                onClick={() => setShowUndoConfirm(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Innings Complete Modal */}
      {showInningsCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h4 className="text-lg font-bold mb-4 text-blue-600">Innings Complete!</h4>
            <div className="mb-4 p-4 bg-blue-50 rounded">
              <p className="text-sm mb-2"><strong>First Innings Summary:</strong></p>
              <p className="text-lg font-bold">
                {match.team1}: {matchState.team1Score.runs}/{matchState.team1Score.wickets}
              </p>
              <p className="text-sm text-gray-600">
                Overs: {matchState.team1Score.overs}.{matchState.team1Score.balls}
              </p>
              <p className="text-sm mt-2">
                <strong>Target:</strong> {matchState.team1Score.runs + 1} runs
              </p>
            </div>
            <p className="mb-4">Ready to start the second innings?</p>
            <div className="flex space-x-2">
              <button
                onClick={switchInnings}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Start 2nd Innings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Complete Modal */}
      {showMatchCompleteModal && matchResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h4 className="text-lg font-bold mb-4 text-green-600">🏆 Match Complete!</h4>
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {matchResult.winner === 'Tie' ? '🤝 Match Tied!' : `🎉 ${matchResult.winner} Won!`}
                </div>
                <p className="text-sm text-gray-600">{matchResult.result}</p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-semibold">{match.team1}</p>
                  <p className="text-lg">{matchState.team1Score.runs}/{matchState.team1Score.wickets}</p>
                  <p className="text-xs text-gray-600">Overs: {matchState.team1Score.overs}.{matchState.team1Score.balls}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-semibold">{match.team2}</p>
                  <p className="text-lg">{matchState.team2Score.runs}/{matchState.team2Score.wickets}</p>
                  <p className="text-xs text-gray-600">Overs: {matchState.team2Score.overs}.{matchState.team2Score.balls}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowMatchCompleteModal(false);
                onScoreUpdate(); // Refresh to show updated match status
              }}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BallByBallScorer;