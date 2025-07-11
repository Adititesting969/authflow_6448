import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LoginForm from './components/LoginForm';
import SecurityFeatures from './components/SecurityFeatures';

const UserLogin = () => {
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (authToken) {
      // User is already logged in, redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <main className="main-content">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
              {/* Left Column - Login Form */}
              <div className="flex flex-col justify-center">
                <div className="w-full max-w-md mx-auto lg:mx-0">
                  <LoginForm />
                </div>
              </div>

              {/* Right Column - Security Features (Desktop Only) */}
              <div className="flex flex-col justify-center">
                <SecurityFeatures />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <button className="hover:text-text-primary transition-colors duration-200">
                Privacy Policy
              </button>
              <span>•</span>
              <button className="hover:text-text-primary transition-colors duration-200">
                Terms of Service
              </button>
              <span>•</span>
              <button className="hover:text-text-primary transition-colors duration-200">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLogin;