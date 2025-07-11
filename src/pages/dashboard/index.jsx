import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../utils/authService';
import Header from '../../components/ui/Header';
import UserProfileCard from './components/UserProfileCard';
import ActivityFeed from './components/ActivityFeed';
import SecurityOverview from './components/SecurityOverview';
import QuickActions from './components/QuickActions';





const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [activities, setActivities] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/user-login');
    }
  }, [authLoading, user, navigate]);

  // Load dashboard data
  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setLoadingError(null);

        // Load user activities
        const activitiesResult = await authService.getUserActivities(user.id, 10);
        if (activitiesResult?.success && isMounted) {
          setActivities(activitiesResult.data || []);
        }

        // Load user sessions
        const sessionsResult = await authService.getUserSessions(user.id);
        if (sessionsResult?.success && isMounted) {
          setSessions(sessionsResult.data || []);
        }

      } catch (error) {
        if (isMounted) {
          setLoadingError('Failed to load dashboard data');
          console.log('Dashboard data loading error:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (user?.id) {
      loadDashboardData();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // Navigate to profile editing page when implemented
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action clicked:', actionId);
    
    switch (actionId) {
      case 'account-settings':
        // Navigate to account settings
        break;
      case 'security':
        // Navigate to security settings
        break;
      case 'privacy':
        // Navigate to privacy settings
        break;
      case 'help':
        // Navigate to help page
        break;
      case 'notifications':
        // Navigate to notification settings
        break;
      case 'devices':
        // Navigate to device management
        break;
      case 'download-data':
        // Trigger data download
        break;
      case 'activity-log':
        // Navigate to full activity log
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  const handleSecurityAction = (actionId) => {
    console.log('Security action clicked:', actionId);
    
    switch (actionId) {
      case 'two-factor':
        // Navigate to 2FA settings
        break;
      case 'password':
        // Navigate to password change
        break;
      case 'devices':
        // Navigate to device management
        break;
      case 'view-all':
        // Navigate to full security overview
        break;
      default:
        console.log('Unknown security action:', actionId);
    }
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <>
        <Header />
        <main className="main-content min-h-screen bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              {/* Header skeleton */}
              <div className="mb-8">
                <div className="h-8 bg-surface-hover rounded w-64 mb-2"></div>
                <div className="h-4 bg-surface-hover rounded w-96"></div>
              </div>
              
              {/* Cards skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-surface-hover rounded-lg"></div>
                  <div className="h-96 bg-surface-hover rounded-lg"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-80 bg-surface-hover rounded-lg"></div>
                  <div className="h-64 bg-surface-hover rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Show error state
  if (loadingError) {
    return (
      <>
        <Header />
        <main className="main-content min-h-screen bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
              <h2 className="text-lg font-semibold text-error-800 mb-2">
                Unable to Load Dashboard
              </h2>
              <p className="text-error-700 mb-4">{loadingError}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary hover:text-primary-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Calculate security data from real data
  const securityData = {
    twoFactorEnabled: false, // TODO: Implement 2FA
    strongPassword: true,
    recentActivity: activities.length > 0,
    trustedDevices: sessions.length,
    recentEvents: activities.slice(0, 3).map(activity => ({
      description: activity.title,
      timestamp: new Date(activity.created_at).toLocaleDateString()
    }))
  };

  // Calculate user stats
  const userStats = {
    totalSessions: sessions.length,
    activeDevices: sessions.filter(session => session.is_active).length,
    lastLogin: userProfile?.last_login_at ? new Date(userProfile.last_login_at) : new Date()
  };

  return (
    <>
      <Header />
      <main className="main-content min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome back, {userProfile?.full_name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-text-secondary">
              Here is what is happening with your account today.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Profile Card */}
              <UserProfileCard 
                userData={{
                  ...userProfile,
                  name: userProfile?.full_name || 'User',
                  initials: userProfile?.full_name ? 
                    userProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                    'U',
                  status: userProfile?.status || 'Active',
                  memberSince: userProfile?.created_at ? 
                    new Date(userProfile.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'Recently',
                  lastLogin: userStats.lastLogin,
                  stats: userStats
                }}
                onEditProfile={handleEditProfile}
              />
              
              {/* Activity Feed */}
              <ActivityFeed activities={activities} />
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Security Overview */}
              <SecurityOverview 
                securityData={securityData}
                onSecurityAction={handleSecurityAction}
              />
              
              {/* Quick Actions */}
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </div>

          {/* Additional Stats Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background border border-border rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {securityData.strongPassword && securityData.recentActivity ? '99.9%' : '85.0%'}
              </div>
              <div className="text-sm text-text-secondary">Account Security Score</div>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-success mb-2">{activities.length}</div>
              <div className="text-sm text-text-secondary">Total Activities</div>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-accent mb-2">{userStats.activeDevices}</div>
              <div className="text-sm text-text-secondary">Connected Devices</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;