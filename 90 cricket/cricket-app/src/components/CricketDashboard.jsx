import { useEffect, useState } from 'react';
import { AuthService } from '../services/authService';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function CricketDashboard({ user }) {
  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user stats
      const userData = await AuthService.getUserData(user.uid);
      if (userData.success) {
        setUserStats(userData.data);
      }

      // Fetch user's recent cricket activities
      const activitiesQuery = query(
        collection(db, 'user_activities'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const activities = activitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activityType, description) => {
    try {
      await addDoc(collection(db, 'user_activities'), {
        userId: user.uid,
        userName: user.displayName || user.email,
        activityType,
        description,
        timestamp: new Date().toISOString()
      });
      
      // Refresh activities
      fetchUserData();
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleQuickActions = async (action) => {
    switch (action) {
      case 'view_scores':
        await addActivity('view', 'Viewed live cricket scores');
        break;
      case 'favorite_team':
        await addActivity('favorite', 'Added favorite cricket team');
        break;
      case 'share_match':
        await addActivity('share', 'Shared match highlights');
        break;
      default:
        break;
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.displayName || user.email}! 🏏
        </h1>
        <p className="text-blue-100">
          Ready to explore the world of cricket? Check out the latest scores and updates.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* User Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Your Cricket Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Member Since:</span>
              <span className="font-semibold">
                {userStats?.createdAt 
                  ? new Date(userStats.createdAt).toLocaleDateString()
                  : 'Recently'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Activities:</span>
              <span className="font-semibold text-blue-600">{recentActivity.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type:</span>
              <span className="font-semibold">
                {user.providerData?.[0]?.providerId === 'password' ? 'Email' : 'Social'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleQuickActions('view_scores')}
              className="w-full text-left p-3 rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
            >
              <div className="font-semibold text-blue-600">📊 View Live Scores</div>
              <div className="text-sm text-gray-600">Check latest match updates</div>
            </button>
            
            <button
              onClick={() => handleQuickActions('favorite_team')}
              className="w-full text-left p-3 rounded-md bg-green-50 hover:bg-green-100 transition duration-200"
            >
              <div className="font-semibold text-green-600">⭐ Favorite Team</div>
              <div className="text-sm text-gray-600">Follow your favorite team</div>
            </button>
            
            <button
              onClick={() => handleQuickActions('share_match')}
              className="w-full text-left p-3 rounded-md bg-purple-50 hover:bg-purple-100 transition duration-200"
            >
              <div className="font-semibold text-purple-600">🔗 Share Match</div>
              <div className="text-sm text-gray-600">Share exciting moments</div>
            </button>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="border-l-4 border-blue-500 pl-3 py-2">
                  <div className="font-medium text-gray-800">{activity.description}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>No recent activity</p>
                <p className="text-sm">Start exploring to see your activity here!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Authentication Info (for demo) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Authentication Demo</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Current User Data:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify({
                uid: user.uid.substring(0, 8) + '...',
                email: user.email,
                displayName: user.displayName,
                emailVerified: user.emailVerified,
                photoURL: user.photoURL ? 'Available' : 'None'
              }, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Available Auth Methods:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Email/Password Authentication
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Google Social Login
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Facebook Social Login
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Twitter Social Login
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Password Reset
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CricketDashboard;