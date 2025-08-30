import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

function UserProfile({ user, onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const result = await AuthService.getUserData(user.uid);
        if (result.success) {
          setUserData(result.data);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    const result = await AuthService.signOut();
    if (result.success) {
      onLogout && onLogout();
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
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="text-center">
        {/* Profile Picture */}
        <div className="mb-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto border-4 border-blue-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {user?.displayName || 'Cricket Fan'}
        </h2>
        <p className="text-gray-600 mb-4">{user?.email}</p>

        {/* User Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-semibold text-blue-600">
              {userData?.createdAt 
                ? new Date(userData.createdAt).toLocaleDateString() 
                : 'Recently'
              }
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Last Login</p>
            <p className="font-semibold text-green-600">
              {userData?.lastLoginAt 
                ? new Date(userData.lastLoginAt).toLocaleDateString() 
                : 'Today'
              }
            </p>
          </div>
        </div>

        {/* User Details */}
        <div className="text-left space-y-3 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">User ID:</span>
            <span className="font-mono text-sm text-gray-800">
              {user?.uid?.substring(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Email Verified:</span>
            <span className={`px-2 py-1 rounded text-xs ${
              user?.emailVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user?.emailVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Account Type:</span>
            <span className="text-gray-800">
              {user?.providerData?.[0]?.providerId === 'password' ? 'Email' : 
               user?.providerData?.[0]?.providerId || 'Standard'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
            Edit Profile
          </button>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;