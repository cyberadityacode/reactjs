import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  onSnapshot,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

export class MatchService {
  // Create a new match
  static async createMatch(matchData, umpireId) {
    try {
      const match = {
        ...matchData,
        umpireId,
        createdAt: new Date().toISOString(),
        status: 'upcoming', // upcoming, live, completed, cancelled
        team1Score: {
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          extras: 0,
          fours: 0,
          sixes: 0
        },
        team2Score: {
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          extras: 0,
          fours: 0,
          sixes: 0
        },
        currentInnings: 1, // 1 or 2
        ballHistory: [], // Array to store ball-by-ball details
        lastUpdated: new Date().toISOString(),
        // Ensure overs field is properly set for over limits
        overs: matchData.overs || matchData.maxOvers || 20,
        autoCompletionEnabled: true
      };

      const docRef = await addDoc(collection(db, 'matches'), match);
      return { success: true, matchId: docRef.id, match };
    } catch (error) {
      console.error('Error creating match:', error);
      return { success: false, error: error.message };
    }
  }

  // Get match by ID
  static async getMatch(matchId) {
    try {
      const matchRef = doc(db, 'matches', matchId);
      const matchDoc = await getDoc(matchRef);
      
      if (matchDoc.exists()) {
        return { success: true, match: { id: matchDoc.id, ...matchDoc.data() } };
      } else {
        return { success: false, error: 'Match not found' };
      }
    } catch (error) {
      console.error('Error getting match:', error);
      return { success: false, error: error.message };
    }
  }

  // Update match score
  static async updateScore(matchId, scoreUpdate, umpireId) {
    try {
      const matchRef = doc(db, 'matches', matchId);
      const matchDoc = await getDoc(matchRef);
      
      if (!matchDoc.exists()) {
        return { success: false, error: 'Match not found' };
      }

      const match = matchDoc.data();
      
      // Verify umpire authorization
      if (match.umpireId !== umpireId) {
        return { success: false, error: 'Unauthorized: Only assigned umpire can update scores' };
      }

      const updateData = {
        ...scoreUpdate,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: umpireId
      };

      await updateDoc(matchRef, updateData);
      
      // Log the score update
      await this.logScoreUpdate(matchId, umpireId, scoreUpdate);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating score:', error);
      return { success: false, error: error.message };
    }
  }

  // Start match
  static async startMatch(matchId, umpireId) {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        status: 'live',
        startTime: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error starting match:', error);
      return { success: false, error: error.message };
    }
  }

  // End match automatically with result
  static async endMatchWithResult(matchId, umpireId, winner, result) {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        status: 'completed',
        endTime: new Date().toISOString(),
        result,
        winner,
        lastUpdated: new Date().toISOString(),
        autoCompleted: true
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error ending match with result:', error);
      return { success: false, error: error.message };
    }
  }

  // End match
  static async endMatch(matchId, umpireId, result) {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        status: 'completed',
        endTime: new Date().toISOString(),
        result,
        lastUpdated: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error ending match:', error);
      return { success: false, error: error.message };
    }
  }

  // Get matches by umpire
  static async getMatchesByUmpire(umpireId) {
    try {
      const matchesQuery = query(
        collection(db, 'matches'),
        where('umpireId', '==', umpireId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(matchesQuery);
      const matches = [];
      
      querySnapshot.forEach((doc) => {
        matches.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, matches };
    } catch (error) {
      console.error('Error getting matches by umpire:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all matches
  static async getAllMatches() {
    try {
      const matchesQuery = query(
        collection(db, 'matches'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(matchesQuery);
      const matches = [];
      
      querySnapshot.forEach((doc) => {
        matches.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, matches };
    } catch (error) {
      console.error('Error getting all matches:', error);
      return { success: false, error: error.message };
    }
  }

  // Get live matches
  static async getLiveMatches() {
    try {
      const matchesQuery = query(
        collection(db, 'matches'),
        where('status', '==', 'live'),
        orderBy('startTime', 'desc')
      );
      
      const querySnapshot = await getDocs(matchesQuery);
      const matches = [];
      
      querySnapshot.forEach((doc) => {
        matches.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, matches };
    } catch (error) {
      console.error('Error getting live matches:', error);
      return { success: false, error: error.message };
    }
  }

  // Subscribe to match updates (real-time)
  static subscribeToMatch(matchId, callback) {
    const matchRef = doc(db, 'matches', matchId);
    return onSnapshot(matchRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  }

  // Subscribe to all live matches (real-time)
  static subscribeToLiveMatches(callback) {
    const matchesQuery = query(
      collection(db, 'matches'),
      where('status', '==', 'live'),
      orderBy('startTime', 'desc')
    );
    
    return onSnapshot(matchesQuery, (querySnapshot) => {
      const matches = [];
      querySnapshot.forEach((doc) => {
        matches.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(matches);
    });
  }

  // Log score update for audit trail
  static async logScoreUpdate(matchId, umpireId, scoreUpdate) {
    try {
      await addDoc(collection(db, 'score_updates'), {
        matchId,
        umpireId,
        update: scoreUpdate,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging score update:', error);
    }
  }

  // Get score update history
  static async getScoreHistory(matchId) {
    try {
      const historyQuery = query(
        collection(db, 'score_updates'),
        where('matchId', '==', matchId),
        orderBy('timestamp', 'asc')
      );
      
      const querySnapshot = await getDocs(historyQuery);
      const history = [];
      
      querySnapshot.forEach((doc) => {
        history.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, history };
    } catch (error) {
      console.error('Error getting score history:', error);
      return { success: false, error: error.message };
    }
  }

  // Add ball-by-ball update
  static async addBallUpdate(matchId, ballData, umpireId) {
    try {
      const matchRef = doc(db, 'matches', matchId);
      const matchDoc = await getDoc(matchRef);
      
      if (!matchDoc.exists()) {
        return { success: false, error: 'Match not found' };
      }

      const match = matchDoc.data();
      
      // Verify umpire authorization
      if (match.umpireId !== umpireId) {
        return { success: false, error: 'Unauthorized: Only assigned umpire can update scores' };
      }

      // Add ball to history
      const ballRecord = {
        ...ballData,
        ballNumber: (match.ballHistory?.length || 0) + 1,
        timestamp: new Date().toISOString(),
        umpireId
      };

      const updatedBallHistory = [...(match.ballHistory || []), ballRecord];

      const updateData = {
        ballHistory: updatedBallHistory,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: umpireId
      };

      await updateDoc(matchRef, updateData);
      
      return { success: true, ballRecord };
    } catch (error) {
      console.error('Error adding ball update:', error);
      return { success: false, error: error.message };
    }
  }

  // Get ball-by-ball history for a match
  static async getBallHistory(matchId) {
    try {
      const matchRef = doc(db, 'matches', matchId);
      const matchDoc = await getDoc(matchRef);
      
      if (matchDoc.exists()) {
        const match = matchDoc.data();
        return { success: true, ballHistory: match.ballHistory || [] };
      } else {
        return { success: false, error: 'Match not found' };
      }
    } catch (error) {
      console.error('Error getting ball history:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete match (admin only)
  static async deleteMatch(matchId) {
    try {
      await deleteDoc(doc(db, 'matches', matchId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting match:', error);
      return { success: false, error: error.message };
    }
  }
}