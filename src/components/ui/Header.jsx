import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const { user, userProfile, signOut, loading: authLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isAuthenticated = !authLoading && user;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    try {
      await signOut();
      navigate('/user-login');
    } catch (error) {
      console.log('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/user-login');
    }
  };

  // Get user display data
  const userData = {
    name: userProfile?.full_name || user?.email?.split('@')[0] || 'User',
    email: userProfile?.email || user?.email || '',
    initials: userProfile?.full_name ? 
      userProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 
      (user?.email?.[0]?.toUpperCase() || 'U')
  };

  const Logo = () => (
    <div 
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => handleNavigation(isAuthenticated ? '/dashboard' : '/')}
    >
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Shield" size={20} color="white" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-semibold text-primary">AuthFlow</span>
    </div>
  );

  const AuthenticationNavigation = () => (
    <div className="flex items-center space-x-4">
      {location.pathname === '/user-login' ? (
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/user-registration')}
          className="text-text-secondary hover:text-text-primary"
        >
          Sign Up
        </Button>
      ) : location.pathname === '/user-registration' ? (
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/user-login')}
          className="text-text-secondary hover:text-text-primary"
        >
          Sign In
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => handleNavigation('/user-login')}
            className="text-text-secondary hover:text-text-primary"
          >
            Sign In
          </Button>
          <Button
            variant="default"
            onClick={() => handleNavigation('/user-registration')}
          >
            Get Started
          </Button>
        </div>
      )}
    </div>
  );

  const UserProfileDropdown = () => (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-primary">{userData.initials}</span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-text-primary">{userData.name}</p>
          <p className="text-xs text-text-secondary">{userData.email}</p>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-text-secondary transition-transform duration-200 ${
            isUserMenuOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-text-primary">{userData.name}</p>
            <p className="text-xs text-text-secondary">{userData.email}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                // Navigate to profile settings
              }}
              className="flex items-center w-full px-3 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors duration-200"
            >
              <Icon name="User" size={16} className="mr-3 text-text-secondary" />
              Profile Settings
            </button>
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                // Navigate to security settings
              }}
              className="flex items-center w-full px-3 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors duration-200"
            >
              <Icon name="Shield" size={16} className="mr-3 text-text-secondary" />
              Security
            </button>
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                // Navigate to preferences
              }}
              className="flex items-center w-full px-3 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors duration-200"
            >
              <Icon name="Settings" size={16} className="mr-3 text-text-secondary" />
              Preferences
            </button>
          </div>
          <div className="border-t border-border py-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-error-50 transition-colors duration-200"
            >
              <Icon name="LogOut" size={16} className="mr-3 text-error" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const MobileMenu = () => (
    <div 
      ref={mobileMenuRef}
      className={`fixed inset-0 z-50 bg-background transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Logo />
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-surface transition-colors duration-200"
        >
          <Icon name="X" size={24} className="text-text-secondary" />
        </button>
      </div>

      <div className="p-4">
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{userData.initials}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{userData.name}</p>
                <p className="text-xs text-text-secondary">{userData.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/dashboard' ?'bg-primary-50 text-primary' :'text-text-primary hover:bg-surface-hover'
                }`}
              >
                <Icon name="LayoutDashboard" size={20} className="mr-3" />
                Dashboard
              </button>
            </nav>

            <div className="border-t border-border pt-4 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  // Navigate to profile
                }}
                className="flex items-center w-full p-3 text-text-primary hover:bg-surface-hover rounded-lg transition-colors duration-200"
              >
                <Icon name="User" size={20} className="mr-3 text-text-secondary" />
                Profile Settings
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  // Navigate to security
                }}
                className="flex items-center w-full p-3 text-text-primary hover:bg-surface-hover rounded-lg transition-colors duration-200"
              >
                <Icon name="Shield" size={20} className="mr-3 text-text-secondary" />
                Security
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 text-error hover:bg-error-50 rounded-lg transition-colors duration-200"
              >
                <Icon name="LogOut" size={20} className="mr-3 text-error" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleNavigation('/user-login')}
            >
              Sign In
            </Button>
            <Button
              variant="default"
              fullWidth
              onClick={() => handleNavigation('/user-registration')}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? <UserProfileDropdown /> : <AuthenticationNavigation />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-surface transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Icon name="Menu" size={24} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  );
};

export default Header;