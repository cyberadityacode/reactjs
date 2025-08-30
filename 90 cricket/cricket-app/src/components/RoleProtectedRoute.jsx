import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { RoleService, USER_ROLES } from '../services/roleService';

function RoleProtectedRoute({ children, user, allowedRoles = [] }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const roleResult = await RoleService.getUserRole(user.uid);
        if (roleResult.success) {
          setUserRole(roleResult.role);
        }
      }
      setLoading(false);
    };

    checkUserRole();
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Access Restricted</h2>
          <p className="text-yellow-700">
            You don't have permission to access this page. Required roles: {allowedRoles.join(', ')}
          </p>
          <p className="text-yellow-600 mt-2 text-sm">
            Your current role: {userRole || 'user'}
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default RoleProtectedRoute;