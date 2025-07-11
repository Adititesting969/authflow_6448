import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';

const UserRegistration = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <main className="main-content">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-md mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="UserPlus" size={32} className="text-primary" />
              </div>
              <h1 className="text-3xl font-semibold text-text-primary mb-2">
                Create Your Account
              </h1>
              <p className="text-text-secondary">
                Join AuthFlow and secure your digital experience
              </p>
            </div>

            {/* Registration Form */}
            <div className="bg-background rounded-lg shadow-default border border-border p-6 sm:p-8">
              <RegistrationForm />
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-text-secondary">
                Already have an account?{' '}
                <Link
                  to="/user-login"
                  className="text-primary hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Shield" size={20} className="text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="text-primary-800 font-medium mb-1">
                    Your Security Matters
                  </p>
                  <p className="text-primary-700">
                    We use industry-standard encryption to protect your data. Your password is securely hashed and never stored in plain text.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-background rounded-lg border border-border">
                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                  <Icon name="Lock" size={16} className="text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Secure Access</p>
                  <p className="text-xs text-text-secondary">End-to-end encryption</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-background rounded-lg border border-border">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                  <Icon name="Smartphone" size={16} className="text-accent-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Mobile Ready</p>
                  <p className="text-xs text-text-secondary">Access anywhere</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserRegistration;