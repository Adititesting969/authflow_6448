import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { signUp, authError, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateFullName = (name) => {
    if (!name) return 'Full name is required';
    if (name.length < 2) return 'Full name must be at least 2 characters';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation
    let error = '';
    if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'full_name') {
      error = validateFullName(value);
    } else if (name === 'password') {
      error = validatePassword(value);
      // Also revalidate confirm password if it exists
      if (formData.confirmPassword) {
        const confirmError = validateConfirmPassword(formData.confirmPassword, value);
        setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
      }
    } else if (name === 'confirmPassword') {
      error = validateConfirmPassword(value, formData.password);
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.email = validateEmail(formData.email);
    newErrors.full_name = validateFullName(formData.full_name);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
    
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.full_name
      });

      if (result?.success) {
        setSuccessMessage('Account created successfully! Please check your email to verify your account.');
        
        // Redirect after showing success message
        setTimeout(() => {
          navigate('/user-login');
        }, 3000);
      }
      // Error handling is done by AuthContext
    } catch (error) {
      console.log('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.full_name &&
      formData.password &&
      formData.confirmPassword &&
      acceptTerms &&
      !errors.email &&
      !errors.full_name &&
      !errors.password &&
      !errors.confirmPassword &&
      !errors.terms
    );
  };

  const isLoading = loading || isSubmitting;

  if (successMessage) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-success-50 border border-success-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-success-800 mb-2">Welcome to AuthFlow!</h3>
          <p className="text-success-700 mb-4">{successMessage}</p>
          <p className="text-sm text-success-600">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Authentication Error */}
        {authError && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-md">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={16} className="text-error mr-2 flex-shrink-0" />
              <p className="text-sm text-error-700">{authError}</p>
            </div>
          </div>
        )}

        {/* Full Name Field */}
        <div>
          <Input
            label="Full Name"
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            error={errors.full_name}
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Email Field */}
        <div>
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            error={errors.email}
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              error={errors.password}
              required
              disabled={isLoading}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-9 text-secondary-500 hover:text-secondary-700 transition-colors duration-200"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>
          <PasswordStrengthMeter password={formData.password} />
        </div>

        {/* Confirm Password Field */}
        <div>
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              required
              disabled={isLoading}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-3 top-9 text-secondary-500 hover:text-secondary-700 transition-colors duration-200"
            >
              <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <button
              type="button"
              onClick={() => setAcceptTerms(!acceptTerms)}
              disabled={isLoading}
              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                acceptTerms
                  ? 'bg-primary border-primary text-white' :'border-secondary-300 hover:border-secondary-400'
              }`}
            >
              {acceptTerms && <Icon name="Check" size={14} />}
            </button>
            <div className="text-sm">
              <span className="text-text-secondary">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-primary hover:text-primary-700 underline"
                  onClick={() => {
                    alert('Terms and Conditions would open here');
                  }}
                >
                  Terms and Conditions
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  className="text-primary hover:text-primary-700 underline"
                  onClick={() => {
                    alert('Privacy Policy would open here');
                  }}
                >
                  Privacy Policy
                </button>
              </span>
            </div>
          </div>
          {errors.terms && (
            <p className="text-error text-sm ml-8">{errors.terms}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          disabled={!isFormValid() || isLoading}
          loading={isLoading}
          className="h-12"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;