import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    const strengthLevels = {
      0: { label: '', color: '', bgColor: '' },
      1: { label: 'Very Weak', color: 'text-error', bgColor: 'bg-error' },
      2: { label: 'Weak', color: 'text-error', bgColor: 'bg-error' },
      3: { label: 'Fair', color: 'text-warning', bgColor: 'bg-warning' },
      4: { label: 'Good', color: 'text-success', bgColor: 'bg-success' },
      5: { label: 'Strong', color: 'text-success', bgColor: 'bg-success' }
    };
    
    return { score, checks, ...strengthLevels[score] };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              level <= strength.score
                ? strength.bgColor
                : 'bg-secondary-200'
            }`}
          />
        ))}
      </div>
      
      {/* Strength Label */}
      {strength.label && (
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${strength.color}`}>
            Password strength: {strength.label}
          </span>
        </div>
      )}
      
      {/* Requirements Checklist */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Icon 
            name={strength.checks.length ? "Check" : "X"} 
            size={12} 
            className={strength.checks.length ? "text-success" : "text-secondary-400"} 
          />
          <span className={`text-xs ${strength.checks.length ? "text-success" : "text-secondary-500"}`}>
            At least 8 characters
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon 
            name={strength.checks.lowercase ? "Check" : "X"} 
            size={12} 
            className={strength.checks.lowercase ? "text-success" : "text-secondary-400"} 
          />
          <span className={`text-xs ${strength.checks.lowercase ? "text-success" : "text-secondary-500"}`}>
            One lowercase letter
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon 
            name={strength.checks.uppercase ? "Check" : "X"} 
            size={12} 
            className={strength.checks.uppercase ? "text-success" : "text-secondary-400"} 
          />
          <span className={`text-xs ${strength.checks.uppercase ? "text-success" : "text-secondary-500"}`}>
            One uppercase letter
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon 
            name={strength.checks.numbers ? "Check" : "X"} 
            size={12} 
            className={strength.checks.numbers ? "text-success" : "text-secondary-400"} 
          />
          <span className={`text-xs ${strength.checks.numbers ? "text-success" : "text-secondary-500"}`}>
            One number
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon 
            name={strength.checks.symbols ? "Check" : "X"} 
            size={12} 
            className={strength.checks.symbols ? "text-success" : "text-secondary-400"} 
          />
          <span className={`text-xs ${strength.checks.symbols ? "text-success" : "text-secondary-500"}`}>
            One special character
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;