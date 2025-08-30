import { useState, useEffect } from 'react';
import { MatchService } from '../services/matchService';
import { RoleService, USER_ROLES } from '../services/roleService';

function CreateMatch({ user, onMatchCreated }) {
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    venue: '',
    matchType: 'T20',
    overs: 20,
    umpireId: '',
    scheduledDate: '',
    description: ''
  });
  const [umpires, setUmpires] = useState([]);
  const [userRole, setUserRole] = useState(USER_ROLES.USER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUmpires();
    checkUserRole();
  }, []);

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

  const checkUserRole = async () => {
    if (user) {
      const roleResult = await RoleService.getUserRole(user.uid);
      if (roleResult.success) {
        setUserRole(roleResult.role);
        
        // If user is an umpire, auto-assign them as the umpire
        if (roleResult.role === USER_ROLES.UMPIRE) {
          setFormData(prev => ({
            ...prev,
            umpireId: user.uid
          }));
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-set overs based on match type
    if (name === 'matchType') {
      let defaultOvers = 50;
      if (value === 'T20') defaultOvers = 20;
      else if (value === 'T10') defaultOvers = 10;
      else if (value === 'ODI') defaultOvers = 50;
      else if (value === 'Test') defaultOvers = 0;

      setFormData(prev => ({
        ...prev,
        overs: defaultOvers
      }));
    }
  };

  const validateForm = () => {
    if (!formData.team1.trim()) {
      setError('Team 1 name is required');
      return false;
    }
    if (!formData.team2.trim()) {
      setError('Team 2 name is required');
      return false;
    }
    if (formData.team1.toLowerCase() === formData.team2.toLowerCase()) {
      setError('Team names must be different');
      return false;
    }
    if (!formData.venue.trim()) {
      setError('Venue is required');
      return false;
    }
    if (!formData.umpireId) {
      setError('Please select an umpire');
      return false;
    }
    if (!formData.scheduledDate) {
      setError('Scheduled date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const matchData = {
        ...formData,
        createdBy: user.uid,
        maxOvers: formData.overs
      };

      const result = await MatchService.createMatch(matchData, formData.umpireId);

      if (result.success) {
        setSuccess('Match created successfully!');
        setFormData({
          team1: '',
          team2: '',
          venue: '',
          matchType: 'T20',
          overs: 20,
          umpireId: '',
          scheduledDate: '',
          description: ''
        });
        onMatchCreated && onMatchCreated(result.match);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  // Access control checks
  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Please log in to create matches.</p>
      </div>
    );
  }

  // Check if user has permission to create matches (Admin or Umpire)
  if (userRole !== USER_ROLES.ADMIN && userRole !== USER_ROLES.UMPIRE) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Access Restricted</h2>
          <p className="text-yellow-700">
            Only Admins and Umpires can create matches. Please contact an administrator for role assignment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Match</h2>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            userRole === USER_ROLES.ADMIN ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {userRole.toUpperCase()}
          </span>
          <span className="text-sm text-gray-600">
            {userRole === USER_ROLES.ADMIN 
              ? 'You can assign any umpire to this match' 
              : 'You will be automatically assigned as the umpire'
            }
          </span>
        </div>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team 1 Name *
            </label>
            <input
              type="text"
              name="team1"
              value={formData.team1}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team 1 name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team 2 Name *
            </label>
            <input
              type="text"
              name="team2"
              value={formData.team2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team 2 name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue *
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter venue name"
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Type *
            </label>
            <select
              name="matchType"
              value={formData.matchType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="T10">T10</option>
              <option value="T20">T20</option>
              <option value="ODI">ODI (One Day)</option>
              <option value="Test">Test Match</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overs per Innings
            </label>
            <input
              type="number"
              name="overs"
              value={formData.overs}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="50"
              placeholder="20"
            />
            <p className="text-xs text-gray-500 mt-1">0 for unlimited (Test match)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Umpire *
            </label>
            {userRole === USER_ROLES.UMPIRE ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-50">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-medium">
                    {user.displayName || user.email} (You)
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Auto-assigned
                  </span>
                </div>
              </div>
            ) : (
              <select
                name="umpireId"
                value={formData.umpireId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select an umpire</option>
                {umpires.map((umpire) => (
                  <option key={umpire.id} value={umpire.id}>
                    {umpire.displayName || umpire.email}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scheduled Date & Time *
          </label>
          <input
            type="datetime-local"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter match description, special notes, or tournament details..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || (userRole === USER_ROLES.ADMIN && umpires.length === 0)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? 'Creating Match...' : 'Create Match'}
        </button>

        {userRole === USER_ROLES.ADMIN && umpires.length === 0 && (
          <p className="text-sm text-red-600 text-center">
            No umpires available. Please assign umpire roles first in the Admin Panel.
          </p>
        )}
        
        {userRole === USER_ROLES.UMPIRE && (
          <div className="text-sm text-green-600 text-center p-3 bg-green-50 rounded">
            <p>✓ As an umpire, you are automatically assigned to manage this match.</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateMatch;