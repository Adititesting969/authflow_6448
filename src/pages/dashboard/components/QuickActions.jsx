import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick }) => {
  const quickActions = [
    {
      id: 'account-settings',
      title: 'Account Settings',
      description: 'Manage your profile and preferences',
      icon: 'Settings',
      variant: 'outline',
      color: 'text-text-primary'
    },
    {
      id: 'security',
      title: 'Security Center',
      description: 'Update passwords and security settings',
      icon: 'Shield',
      variant: 'outline',
      color: 'text-warning'
    },
    {
      id: 'privacy',
      title: 'Privacy Settings',
      description: 'Control your data and privacy options',
      icon: 'Lock',
      variant: 'outline',
      color: 'text-primary'
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: 'HelpCircle',
      variant: 'outline',
      color: 'text-text-secondary'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: 'Bell',
      variant: 'outline',
      color: 'text-accent'
    },
    {
      id: 'devices',
      title: 'Connected Devices',
      description: 'View and manage your devices',
      icon: 'Smartphone',
      variant: 'outline',
      color: 'text-text-primary'
    }
  ];

  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="group p-4 rounded-lg border border-border hover:border-border-hover hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={() => onActionClick(action.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-surface flex items-center justify-center group-hover:bg-surface-hover transition-colors duration-200 ${action.color}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  iconName={action.icon}
                  className="w-full h-full p-0 hover:bg-transparent"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {action.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            className="flex-1"
            onClick={() => onActionClick('download-data')}
          >
            Download My Data
          </Button>
          <Button
            variant="outline"
            iconName="FileText"
            iconPosition="left"
            className="flex-1"
            onClick={() => onActionClick('activity-log')}
          >
            View Activity Log
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;