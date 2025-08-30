import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasFirebaseAccess: boolean;
  login: () => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFirebaseAccess, setHasFirebaseAccess] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const token = apiService.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const status = await apiService.checkAuthStatus();
      
      if (status.authenticated && status.user) {
        setUser(status.user);
        setIsAuthenticated(true);
        setHasFirebaseAccess(status.hasFirebaseAccess || false);
      } else {
        // Token is invalid
        apiService.clearToken();
        setUser(null);
        setIsAuthenticated(false);
        setHasFirebaseAccess(false);
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      apiService.clearToken();
      setUser(null);
      setIsAuthenticated(false);
      setHasFirebaseAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      const authUrl = await apiService.getGoogleAuthUrl();
      
      // Open Google OAuth in a popup
      const popup = window.open(
        authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for the popup to close or receive a message
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setIsLoading(false);
          // Check if authentication was successful
          setTimeout(() => {
            checkAuthStatus();
          }, 1000);
        }
      }, 1000);

      // Listen for messages from the popup (if using postMessage)
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup?.close();
          
          // Handle the authorization code
          handleAuthCallback(event.data.code);
          
          window.removeEventListener('message', messageListener);
        }
      };
      
      window.addEventListener('message', messageListener);

    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to initiate login');
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code: string) => {
    try {
      const response = await apiService.handleGoogleCallback(code);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        
        // Check Firebase access
        await refreshAuth();
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Auth callback error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setHasFirebaseAccess(false);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      apiService.clearToken();
      setUser(null);
      setIsAuthenticated(false);
      setHasFirebaseAccess(false);
      toast.success('Logged out');
    }
  };

  const refreshAuth = async () => {
    try {
      await checkAuthStatus();
    } catch (error: any) {
      console.error('Refresh auth error:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle OAuth callback from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state === 'firebase-automation') {
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      handleAuthCallback(code);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    hasFirebaseAccess,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;