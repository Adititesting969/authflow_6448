import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityOverview = ({ securityData, onSecurityAction }) => {
  const getSecurityScore = () => {
    const { twoFactorEnabled, strongPassword, recentActivity, trustedDevices } = securityData;
    let score = 0;
    
    if (twoFactorEnabled) score += 25;
    if (strongPassword) score += 25;
    if (recentActivity) score += 25;
    if (trustedDevices <= 3) score += 25;
    
    return score;
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-error';
  };

  const getScoreBackground = (score) => {
    if (score >= 75) return 'bg-success-50 border-success-200';
    if (score >= 50) return 'bg-warning-50 border-warning-200';
    return 'bg-error-50 border-error-200';
  };

  const securityScore = getSecurityScore();

  const securityItems = [
    {
      id: 'two-factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: securityData.twoFactorEnabled,
      icon: 'Shield',
      action: 'Enable 2FA'
    },
    {
      id: 'password',
      title: 'Strong Password',
      description: 'Your password meets security requirements',
      enabled: securityData.strongPassword,
      icon: 'Key',
      action: 'Update Password'
    },
    {
      id: 'devices',
      title: 'Trusted Devices',
      description: `${securityData.trustedDevices} devices have access to your account`,
      enabled: securityData.trustedDevices <= 3,
      icon: 'Smartphone',
      action: 'Manage Devices'
    }
  ];

  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Security Overview</h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="ExternalLink"
          iconPosition="right"
          onClick={() => onSecurityAction('view-all')}
          className="text-text-secondary hover:text-text-primary"
        >
          View All
        </Button>
      </div>

      {/* Security Score */}
      <div className={`rounded-lg border p-4 mb-6 ${getScoreBackground(securityScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-1">Security Score</h3>
            <p className="text-xs text-text-secondary">Based on your current security settings</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}%
            </div>
            <div className="w-16 h-2 bg-surface rounded-full mt-1">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  securityScore >= 75 ? 'bg-success' : 
                  securityScore >= 50 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${securityScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Items */}
      <div className="space-y-4">
        {securityItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.enabled ? 'bg-success-50 text-success' : 'bg-surface text-text-secondary'
              }`}>
                <Icon name={item.icon} size={16} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-text-primary">{item.title}</h4>
                  {item.enabled && (
                    <Icon name="CheckCircle" size={14} className="text-success" />
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-1">{item.description}</p>
              </div>
            </div>
            
            <Button
              variant={item.enabled ? "ghost" : "outline"}
              size="sm"
              onClick={() => onSecurityAction(item.id)}
              className={item.enabled ? "text-text-secondary" : ""}
            >
              {item.enabled ? 'Manage' : item.action}
            </Button>
          </div>
        ))}
      </div>

      {/* Recent Security Events */}
      <div className="mt-6 pt-4 border-t border-border">
        <h3 className="text-sm font-medium text-text-primary mb-3">Recent Security Events</h3>
        <div className="space-y-2">
          {securityData.recentEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={12} className="text-text-muted" />
                <span className="text-text-secondary">{event.description}</span>
              </div>
              <span className="text-text-muted">{event.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityOverview;