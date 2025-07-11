import { supabase } from './supabaseClient';

class AuthService {
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Log activity
      if (data?.user) {
        await this.logActivity('login', 'Successful Login', 'User signed in successfully');
      }

      return { success: true, data };
    } catch (error) {
      console.log('Auth service error (signIn):', error);
      return { success: false, error: 'An unexpected error occurred during sign in.' };
    }
  }

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || email.split('@')[0],
            role: userData.role || 'member'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Auth service error (signUp):', error);
      return { success: false, error: 'An unexpected error occurred during sign up.' };
    }
  }

  // Sign out
  async signOut() {
    try {
      // Log activity before signing out
      await this.logActivity('logout', 'Account Logout', 'User signed out successfully');

      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.log('Auth service error (signOut):', error);
      return { success: false, error: 'An unexpected error occurred during sign out.' };
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Auth service error (getSession):', error);
      return { success: false, error: 'An unexpected error occurred getting session.' };
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Auth service error (getUserProfile):', error);
      return { success: false, error: 'An unexpected error occurred getting user profile.' };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Log activity
      await this.logActivity('profile', 'Profile Updated', 'User profile information was updated');

      return { success: true, data };
    } catch (error) {
      console.log('Auth service error (updateUserProfile):', error);
      return { success: false, error: 'An unexpected error occurred updating profile.' };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.log('Auth service error (resetPassword):', error);
      return { success: false, error: 'An unexpected error occurred sending reset email.' };
    }
  }

  // Get user activities
  async getUserActivities(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Auth service error (getUserActivities):', error);
      return { success: false, error: 'An unexpected error occurred getting activities.' };
    }
  }

  // Log user activity
  async logActivity(activityType, title, description = null, metadata = null) {
    try {
      const { data, error } = await supabase.rpc('log_user_activity', {
        activity_type_param: activityType,
        title_param: title,
        description_param: description,
        metadata_param: metadata
      });

      if (error) {
        // Don't throw error for activity logging failures
        console.log('Activity logging failed:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Auth service error (logActivity):', error);
      return { success: false, error: 'Failed to log activity.' };
    }
  }

  // Get user sessions
  async getUserSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Auth service error (getUserSessions):', error);
      return { success: false, error: 'An unexpected error occurred getting sessions.' };
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Log activity
      await this.logActivity('security', 'Password Changed', 'User password was successfully updated');

      return { success: true };
    } catch (error) {
      console.log('Auth service error (updatePassword):', error);
      return { success: false, error: 'An unexpected error occurred updating password.' };
    }
  }

  // Check if user is admin
  async isAdmin() {
    try {
      const { data, error } = await supabase.rpc('is_admin');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('Auth service error (isAdmin):', error);
      return { success: false, error: 'An unexpected error occurred checking admin status.' };
    }
  }
}

const authService = new AuthService();
export default authService;