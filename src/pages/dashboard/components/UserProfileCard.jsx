import React from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const UserProfileCard = ({ userData, onEditProfile }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-success bg-success-50 border-success-200';
      case 'pending':
        return 'text-warning bg-warning-50 border-warning-200';
      case 'inactive':
        return 'text-error bg-error-50 border-error-200';
      default:
        return 'text-text-secondary bg-surface border-border';
    }
  };

  const formatLastLogin = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Profile Overview</h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="Edit"
          iconPosition="left"
          onClick={onEditProfile}
          className="text-text-secondary hover:text-text-primary"
        >
          Edit
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-primary">{userData.initials}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background"></div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-text-primary mb-1">{userData.name}</h3>
          <p className="text-text-secondary mb-2">{userData.email}</p>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(userData.status)}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></div>
            {userData.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Icon name="Calendar" size={16} className="text-text-secondary mr-2" />
            <span className="text-sm font-medium text-text-secondary">Member Since</span>
          </div>
          <p className="text-text-primary font-semibold">{userData.memberSince}</p>
        </div>
        
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Icon name="Clock" size={16} className="text-text-secondary mr-2" />
            <span className="text-sm font-medium text-text-secondary">Last Login</span>
          </div>
          <p className="text-text-primary font-semibold">{formatLastLogin(userData.lastLogin)}</p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">{userData.stats.totalSessions}</p>
              <p className="text-xs text-text-secondary">Total Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">{userData.stats.activeDevices}</p>
              <p className="text-xs text-text-secondary">Active Devices</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Shield"
            iconPosition="left"
            className="text-text-secondary"
          >
            Security
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;