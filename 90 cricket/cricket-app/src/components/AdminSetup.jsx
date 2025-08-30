import { useState } from 'react';
import { RoleService, USER_ROLES } from '../services/roleService';

function AdminSetup({ user, onAdminCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMakeAdmin = async () => {
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await RoleService.createInitialAdmin(user.uid);
      
      if (result.success) {
        setSuccess('Admin role assigned successfully! Please refresh the page.');
        onAdminCreated && onAdminCreated();
      } else {
        if (result.error.includes('permissions')) {
          setError(
            'Firestore security rules need to be updated. Please follow the setup instructions below:'
          );
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      console.error('Error in admin setup:', error);
      setError('Failed to assign admin role. Please check Firestore rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Setup Required</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Permission Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <p className="mt-1 text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">
            To access admin features, you need to be assigned the admin role. Click the button below to make yourself an admin.
          </p>
          
          <button
            onClick={handleMakeAdmin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
          >
            {loading ? 'Setting up Admin Role...' : 'Make Me Admin'}
          </button>
        </div>

        {/* Firestore Rules Setup Instructions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📋 If you see permission errors, follow these steps:
          </h3>
          
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">1.</span>
              <div>
                <span className="font-medium">Go to Firebase Console:</span>
                <a 
                  href="https://console.firebase.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 hover:underline"
                >
                  console.firebase.google.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">2.</span>
              <span>Select your project: <code className="bg-gray-200 px-1 rounded">vedicview-1077</code></span>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">3.</span>
              <span>Navigate to: <strong>Firestore Database → Rules</strong></span>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">4.</span>
              <div>
                <span>Replace the current rules with:</span>
                <pre className="mt-2 p-3 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    match /matches/{matchId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /score_updates/{updateId} {
      allow read, create: if request.auth != null;
    }
    match /user_activities/{activityId} {
      allow read, write: if request.auth != null;
    }
  }
}`}
                </pre>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">5.</span>
              <span>Click <strong>Publish</strong> to apply the rules</span>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">6.</span>
              <span>Come back and try the "Make Me Admin" button again</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Current User:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Name:</strong> {user?.displayName || 'Not set'}</p>
            <p><strong>User ID:</strong> <code className="bg-blue-100 px-1 rounded">{user?.uid?.substring(0, 12)}...</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSetup;