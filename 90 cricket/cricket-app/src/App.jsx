import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthService } from './services/authService';
import { RoleService, USER_ROLES } from './services/roleService';
import AuthContainer from './components/AuthContainer';
import UserProfile from './components/UserProfile';
import CricketDashboard from './components/CricketDashboard';
import AdminPanel from './components/AdminPanel';
import CreateMatch from './components/CreateMatch';
import UmpireDashboard from './components/UmpireDashboard';
import LiveScores from './components/LiveScores';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import './App.css';

// Example components
function Home({ user }) {
  return <CricketDashboard user={user} />;
}

function About() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-600">About Cricket</h1>
      <p className="text-lg text-gray-700 text-center mb-4">Learn more about cricket and our app features.</p>
      <div className="max-w-2xl mx-auto text-gray-600">
        <p className="mb-4">
          This cricket application provides live scores, match updates, and comprehensive cricket statistics. 
          Stay updated with your favorite teams and players.
        </p>
        <p>
          Features include real-time notifications, detailed match analysis, and personalized cricket content.
        </p>
      </div>
    </div>
  );
}

function Scores({ user }) {
  return <LiveScores />;
}

// Protected Route Component
function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(USER_ROLES.USER);

  useEffect(() => {
    // Handle redirect result first
    const handleInitialAuth = async () => {
      try {
        // Check for redirect result from social login
        const redirectResult = await AuthService.handleRedirectResult();
        if (redirectResult.success && redirectResult.user) {
          console.log('Redirect authentication successful:', redirectResult.user);
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    handleInitialAuth();

    // Listen for authentication state changes
    const unsubscribe = AuthService.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // Get user role when user is authenticated
        const roleResult = await RoleService.getUserRole(user.uid);
        if (roleResult.success) {
          setUserRole(roleResult.role);
        }
      } else {
        setUserRole(USER_ROLES.USER);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleAuthSuccess = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Navigation - Only show if user is authenticated */}
          {user && (
            <nav className="bg-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                  <div className="text-xl font-bold text-gray-800">Cricket App</div>
                  <div className="flex items-center space-x-4">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">Home</Link>
                    <Link to="/scores" className="text-blue-600 hover:text-blue-800 font-medium">Live Scores</Link>
                    <Link to="/about" className="text-blue-600 hover:text-blue-800 font-medium">About</Link>
                    
                    {/* Umpire-specific menu */}
                    {userRole === USER_ROLES.UMPIRE && (
                      <>
                        <Link to="/umpire" className="text-green-600 hover:text-green-800 font-medium">Umpire Panel</Link>
                        <Link to="/create-match" className="text-purple-600 hover:text-purple-800 font-medium">Create Match</Link>
                      </>
                    )}
                    
                    {/* Admin-specific menu */}
                    {userRole === USER_ROLES.ADMIN && (
                      <>
                        <Link to="/admin" className="text-red-600 hover:text-red-800 font-medium">Admin</Link>
                        <Link to="/create-match" className="text-purple-600 hover:text-purple-800 font-medium">Create Match</Link>
                      </>
                    )}
                    
                    <Link to="/profile" className="text-blue-600 hover:text-blue-800 font-medium">Profile</Link>
                    <div className="flex items-center space-x-2">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                      )}
                      <span className="text-sm text-gray-700">
                        {user.displayName || user.email}
                      </span>
                      {/* Role Badge */}
                      {userRole !== USER_ROLES.USER && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          userRole === USER_ROLES.ADMIN ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {userRole.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          )}

          {/* Routes */}
          <main className="container mx-auto">
            <Routes>
              {/* Public route for authentication */}
              <Route 
                path="/auth" 
                element={
                  user ? 
                    <Navigate to="/" replace /> : 
                    <AuthContainer onAuthSuccess={handleAuthSuccess} />
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute user={user}>
                    <Home user={user} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/scores" 
                element={
                  <ProtectedRoute user={user}>
                    <Scores user={user} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <ProtectedRoute user={user}>
                    <About />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute user={user}>
                    <div className="p-8">
                      <UserProfile user={user} onLogout={handleLogout} />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute user={user}>
                    <AdminPanel user={user} />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/create-match" 
                element={
                  <RoleProtectedRoute user={user} allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.UMPIRE]}>
                    <div className="p-8">
                      <CreateMatch user={user} />
                    </div>
                  </RoleProtectedRoute>
                } 
              />
              
              {/* Umpire Routes */}
              <Route 
                path="/umpire" 
                element={
                  <RoleProtectedRoute user={user} allowedRoles={[USER_ROLES.UMPIRE]}>
                    <UmpireDashboard user={user} />
                  </RoleProtectedRoute>
                } 
              />
              
              {/* Redirect to auth if not authenticated, otherwise to home */}
              <Route 
                path="*" 
                element={<Navigate to={user ? "/" : "/auth"} replace />} 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
