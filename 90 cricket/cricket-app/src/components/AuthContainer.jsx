import { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

function AuthContainer({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSuccess = (user) => {
    console.log('Login successful:', user);
    onAuthSuccess && onAuthSuccess(user);
  };

  const handleSignUpSuccess = (user) => {
    console.log('Sign up successful:', user);
    onAuthSuccess && onAuthSuccess(user);
  };

  const switchToSignUp = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            switchToSignUp={switchToSignUp}
          />
        ) : (
          <SignUp 
            onSignUpSuccess={handleSignUpSuccess}
            switchToLogin={switchToLogin}
          />
        )}
      </div>
    </div>
  );
}

export default AuthContainer;