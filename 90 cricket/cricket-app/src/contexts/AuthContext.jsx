import { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setError('');
    const result = await AuthService.signInWithEmail(email, password);
    
    if (!result.success) {
      setError(result.error);
      return false;
    }
    
    return true;
  };

  const signUp = async (email, password, displayName) => {
    setError('');
    const result = await AuthService.signUpWithEmail(email, password, displayName);
    
    if (!result.success) {
      setError(result.error);
      return false;
    }
    
    return true;
  };

  const logout = async () => {
    setError('');
    const result = await AuthService.signOut();
    
    if (!result.success) {
      setError(result.error);
      return false;
    }
    
    return true;
  };

  const resetPassword = async (email) => {
    setError('');
    const result = await AuthService.resetPassword(email);
    
    if (!result.success) {
      setError(result.error);
      return false;
    }
    
    return true;
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    loading,
    error,
    login,
    signUp,
    logout,
    resetPassword,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;