import React from 'react';
import Icon from '../../../components/AppIcon';



const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return 'LogIn';
      case 'logout':
        return 'LogOut';
      case 'security':
        return 'Shield';
      case 'profile':
        return 'User';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'login':
        return 'text-success';
      case 'logout':
        return 'text-text-secondary';
      case 'security':
        return 'text-warning';
      case 'profile':
        return 'text-primary';
      default:
        return 'text-text-secondary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <div className="bg-background border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
        </div>
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No recent activity found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
        <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-200">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-surface-hover transition-colors duration-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity.activity_type === 'login' ? 'bg-success-100' :
              activity.activity_type === 'security' ? 'bg-warning-100' :
              activity.activity_type === 'profile'? 'bg-primary-100' : 'bg-gray-100'
            }`}>
              <Icon 
                name={getActivityIcon(activity.activity_type)} 
                size={20} 
                className={getActivityColor(activity.activity_type)}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-text-primary truncate">
                  {activity.title}
                </h3>
                <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
                  {formatTimestamp(activity.created_at)}
                </span>
              </div>
              
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {activity.description}
              </p>
              
              {activity.metadata?.location && (
                <div className="flex items-center mt-2 text-xs text-text-secondary">
                  <Icon name="MapPin" size={12} className="mr-1" />
                  <span>{activity.metadata.location}</span>
                  {activity.metadata.device && (
                    <>
                      <span className="mx-2">•</span>
                      <Icon name="Monitor" size={12} className="mr-1" />
                      <span>{activity.metadata.device}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;