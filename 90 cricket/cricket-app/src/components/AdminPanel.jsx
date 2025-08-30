import { useState, useEffect } from 'react';
import { RoleService, USER_ROLES } from '../services/roleService';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import AdminSetup from './AdminSetup';

function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [umpires, setUmpires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
    fetchUmpires();
  }, [user]);

  const checkAdminStatus = async () => {
    if (user) {
      const adminStatus = await RoleService.isAdmin(user.uid);
      setIsAdmin(adminStatus);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(usersQuery);
      const usersList = [];
      
      querySnapshot.forEach((doc) => {
        usersList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUmpires = async () => {
    try {
      const result = await RoleService.getAllUmpires();
      if (result.success) {
        setUmpires(result.users);
      }
    } catch (error) {
      console.error('Error fetching umpires:', error);
    }
  };

  const handleAssignRole = async (userId, role) => {
    try {
      setError('');
      setSuccess('');
      
      const result = await RoleService.assignRole(userId, role);
      
      if (result.success) {
        setSuccess(`Successfully assigned ${role} role`);
        await fetchUsers();
        await fetchUmpires();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to assign role');
    }
  };

  const handleRemoveRole = async (userId) => {
    try {
      setError('');
      setSuccess('');
      
      const result = await RoleService.removeRole(userId);
      
      if (result.success) {
        setSuccess('Role removed successfully');
        await fetchUsers();
        await fetchUmpires();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to remove role');
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Please log in to access the admin panel.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <AdminSetup 
        user={user} 
        onAdminCreated={() => {
          setIsAdmin(true);
          fetchUsers();
        }}
      />
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>
        
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

        {/* Current Umpires */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Umpires</h2>
          {umpires.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {umpires.map((umpire) => (
                <div key={umpire.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    {umpire.photoURL ? (
                      <img
                        src={umpire.photoURL}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        {umpire.displayName?.charAt(0) || umpire.email?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {umpire.displayName || 'No Name'}
                      </h3>
                      <p className="text-sm text-gray-600">{umpire.email}</p>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                        Umpire
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveRole(umpire.id)}
                    className="mt-3 w-full bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition duration-200"
                  >
                    Remove Umpire Role
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 bg-gray-50 p-4 rounded">No umpires assigned yet.</p>
          )}
        </div>

        {/* All Users */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userData) => (
                  <tr key={userData.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {userData.photoURL ? (
                          <img
                            src={userData.photoURL}
                            alt="Profile"
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold mr-3">
                            {userData.displayName?.charAt(0) || userData.email?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {userData.displayName || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500">{userData.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userData.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userData.role === USER_ROLES.ADMIN
                            ? 'bg-red-100 text-red-800'
                            : userData.role === USER_ROLES.UMPIRE
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {userData.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.createdAt 
                        ? new Date(userData.createdAt).toLocaleDateString()
                        : 'Unknown'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {userData.role !== USER_ROLES.UMPIRE && (
                        <button
                          onClick={() => handleAssignRole(userData.id, USER_ROLES.UMPIRE)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition duration-200"
                        >
                          Make Umpire
                        </button>
                      )}
                      {userData.role !== USER_ROLES.ADMIN && userData.id !== user.uid && (
                        <button
                          onClick={() => handleAssignRole(userData.id, USER_ROLES.ADMIN)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition duration-200"
                        >
                          Make Admin
                        </button>
                      )}
                      {userData.role && userData.role !== USER_ROLES.USER && userData.id !== user.uid && (
                        <button
                          onClick={() => handleRemoveRole(userData.id)}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition duration-200"
                        >
                          Remove Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;