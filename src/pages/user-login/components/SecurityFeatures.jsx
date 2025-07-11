import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFeatures = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Secure Authentication',
      description: 'Your login credentials are protected with industry-standard encryption'
    },
    {
      icon: 'Lock',
      title: 'Data Protection',
      description: 'All personal information is encrypted and stored securely'
    },
    {
      icon: 'Eye',
      title: 'Privacy First',
      description: 'We never share your data with third parties without consent'
    }
  ];

  return (
    <div className="hidden lg:block">
      <div className="bg-surface rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Your Security Matters
        </h3>
        <div className="space-y-4">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon 
                  name={feature.icon} 
                  size={16} 
                  className="text-primary" 
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-xs text-text-secondary">
              SSL Secured Connection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;