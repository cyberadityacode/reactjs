import { useState, useEffect } from 'react';
import { RoleService, USER_ROLES } from '../services/roleService';
import { AuthService } from '../services/authService';

function RoleDebugger() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const user = AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          const roleResult = await RoleService.getUserRole(user.uid);
          if (roleResult.success) {
            setUserRole(roleResult.role);
          } else {
            setError(roleResult.error);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  const promoteToUmpire = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const result = await RoleService.assignRole(currentUser.uid, USER_ROLES.UMPIRE);
      if (result.success) {
        setUserRole(USER_ROLES.UMPIRE);
        alert('Successfully promoted to Umpire! Please refresh the page to see the navigation changes.');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const result = await RoleService.assignRole(currentUser.uid, USER_ROLES.ADMIN);
      if (result.success) {
        setUserRole(USER_ROLES.ADMIN);
        alert('Successfully promoted to Admin! Please refresh the page to see the navigation changes.');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Loading role information...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>No user logged in</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">🔍 Role Debug Information</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>User ID:</strong> {currentUser.uid}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Display Name:</strong> {currentUser.displayName || 'Not set'}</p>
        <p><strong>Current Role:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
            userRole === USER_ROLES.ADMIN ? 'bg-red-200 text-red-800' :
            userRole === USER_ROLES.UMPIRE ? 'bg-green-200 text-green-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            {userRole ? userRole.toUpperCase() : 'UNKNOWN'}
          </span>
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {userRole === USER_ROLES.USER && (
        <div className="space-y-2">
          <p className="text-sm text-blue-600 mb-2">
            Your current role is "user". To access match creation, you need to be an Umpire or Admin.
          </p>
          <div className="space-x-2">
            <button
              onClick={promoteToUmpire}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Promote to Umpire
            </button>
            <button
              onClick={promoteToAdmin}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Promote to Admin
            </button>
          </div>
        </div>
      )}

      {(userRole === USER_ROLES.UMPIRE || userRole === USER_ROLES.ADMIN) && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>✅ You have access to create matches! Look for the "Create Match" button in the navigation.</p>
        </div>
      )}
    </div>
  );
}

export default RoleDebugger;