import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, authError, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock credentials for demonstration
  const mockCredentials = {
    email: 'user@example.com',
    password: 'password123'
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn(formData.email, formData.password);

      if (result?.success) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        // Redirect to dashboard
        navigate('/dashboard');
      }
      // Error handling is done by AuthContext
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page when implemented
    alert('Forgot password functionality - check your email after entering it above and clicking this');
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-background border border-border rounded-lg shadow-default p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to your account to continue
          </p>
        </div>

        {/* Authentication Error */}
        {authError && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={16} className="text-error mr-2 flex-shrink-0" />
              <p className="text-sm text-error-700">{authError}</p>
            </div>
          </div>
        )}

        {/* Mock Credentials Info */}
        <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-md">
          <div className="flex items-start">
            <Icon name="Info" size={16} className="text-primary mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-primary-700">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Email: {mockCredentials.email}</p>
              <p>Password: {mockCredentials.password}</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            error={errors.email}
            required
            disabled={isLoading}
          />

          {/* Password Field */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-text-secondary hover:text-text-primary transition-colors duration-200"
              disabled={isLoading}
            >
              <Icon 
                name={showPassword ? 'EyeOff' : 'Eye'} 
                size={20} 
              />
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label 
              htmlFor="rememberMe" 
              className="ml-2 text-sm text-text-secondary cursor-pointer"
            >
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            iconName={isLoading ? undefined : 'LogIn'}
            iconPosition="left"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 disabled:opacity-50"
            >
              Forgot your password?
            </button>
          </div>
        </form>
      </div>

      {/* Registration Link */}
      <div className="mt-6 text-center">
        <p className="text-text-secondary">
          Do not have an account?{' '}
          <button
            onClick={() => navigate('/user-registration')}
            disabled={isLoading}
            className="text-primary hover:text-primary-700 font-medium transition-colors duration-200 disabled:opacity-50"
          >
            Create one now
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;