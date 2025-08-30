import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function FirebaseExample() {
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInAnonymous = async () => {
    try {
      await signInAnonymously(auth);
      console.log('Signed in anonymously');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const addSampleScore = async () => {
    try {
      const docRef = await addDoc(collection(db, 'scores'), {
        team1: 'Team A',
        team2: 'Team B',
        score1: Math.floor(Math.random() * 300),
        score2: Math.floor(Math.random() * 300),
        timestamp: new Date()
      });
      console.log('Document written with ID: ', docRef.id);
      fetchScores(); // Refresh scores
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const fetchScores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'scores'));
      const scoresData = [];
      querySnapshot.forEach((doc) => {
        scoresData.push({ id: doc.id, ...doc.data() });
      });
      setScores(scoresData);
    } catch (error) {
      console.error('Error fetching scores: ', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Firebase Example</h2>
      
      <div className="mb-4">
        {user ? (
          <p className="text-green-600">✅ Signed in (User ID: {user.uid.substring(0, 8)}...)</p>
        ) : (
          <div>
            <p className="text-red-600 mb-2">❌ Not signed in</p>
            <button 
              onClick={signInAnonymous}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In Anonymously
            </button>
          </div>
        )}
      </div>

      {user && (
        <div>
          <button 
            onClick={addSampleScore}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          >
            Add Sample Score
          </button>
          
          <button 
            onClick={fetchScores}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mb-4 ml-2"
          >
            Fetch Scores
          </button>

          {scores.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Scores:</h3>
              <ul className="space-y-2">
                {scores.map((score) => (
                  <li key={score.id} className="bg-gray-100 p-2 rounded">
                    {score.team1}: {score.score1} vs {score.team2}: {score.score2}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FirebaseExample;