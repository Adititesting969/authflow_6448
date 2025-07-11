-- Location: supabase/migrations/20241220120000_authflow_initial_auth.sql
-- AuthFlow Authentication Module - Initial Setup

-- 1. Types and Core Tables
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.account_status AS ENUM ('active', 'inactive', 'suspended');

-- Critical intermediary table for PostgREST compatibility
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'member'::public.user_role,
    status public.account_status DEFAULT 'active'::public.account_status,
    avatar_url TEXT,
    phone TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User sessions tracking table
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    device_info JSONB,
    location_info JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- Activity tracking table
CREATE TABLE public.user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(status);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(is_active) WHERE is_active = true;
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_type ON public.user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at);

-- 3. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- 4. Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT auth.uid() = profile_user_id
$$;

CREATE OR REPLACE FUNCTION public.can_view_user_data(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT (auth.uid() = target_user_id) OR public.is_admin()
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Function to update last login
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.user_profiles 
  SET last_login_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Function to track user activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
  activity_type_param TEXT,
  title_param TEXT,
  description_param TEXT DEFAULT NULL,
  metadata_param JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.user_activities (
    user_id, activity_type, title, description, metadata
  ) VALUES (
    auth.uid(), activity_type_param, title_param, description_param, metadata_param
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.user_sessions 
  WHERE expires_at < CURRENT_TIMESTAMP OR is_active = false;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles 
FOR ALL TO authenticated
USING (public.is_profile_owner(id)) 
WITH CHECK (public.is_profile_owner(id));

CREATE POLICY "admins_view_all_profiles" ON public.user_profiles 
FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "users_own_sessions" ON public.user_sessions 
FOR ALL TO authenticated
USING (public.can_view_user_data(user_id)) 
WITH CHECK (public.can_view_user_data(user_id));

CREATE POLICY "users_own_activities" ON public.user_activities 
FOR ALL TO authenticated
USING (public.can_view_user_data(user_id)) 
WITH CHECK (public.can_view_user_data(user_id));

-- 6. Complete Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    activity1_id UUID;
    activity2_id UUID;
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Doe", "role": "member"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles with additional data
    UPDATE public.user_profiles 
    SET 
        phone = '+1-555-0123',
        last_login_at = CURRENT_TIMESTAMP - INTERVAL '2 hours'
    WHERE id = user_uuid;

    -- Create sample sessions
    INSERT INTO public.user_sessions (user_id, session_token, device_info, location_info, ip_address, user_agent, expires_at)
    VALUES 
        (user_uuid, 'mock_session_token_1', 
         '{"device": "Chrome on Windows", "platform": "desktop"}'::jsonb,
         '{"city": "New York", "region": "NY", "country": "US"}'::jsonb,
         '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
         CURRENT_TIMESTAMP + INTERVAL '30 days'),
        (user_uuid, 'mock_session_token_2',
         '{"device": "Safari on iPhone", "platform": "mobile"}'::jsonb,
         '{"city": "San Francisco", "region": "CA", "country": "US"}'::jsonb,
         '10.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
         CURRENT_TIMESTAMP + INTERVAL '30 days');

    -- Create sample activities
    INSERT INTO public.user_activities (user_id, activity_type, title, description, metadata, ip_address, user_agent)
    VALUES 
        (user_uuid, 'login', 'Successful Login', 'You signed in to your account from a new location',
         '{"location": "New York, NY", "device": "Chrome on Windows"}'::jsonb,
         '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
        (user_uuid, 'security', 'Security Settings Updated', 'Two-factor authentication was enabled for your account',
         '{"device": "Chrome on Windows"}'::jsonb,
         '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
        (user_uuid, 'profile', 'Profile Information Updated', 'Your profile information was successfully updated',
         '{"device": "Safari on iPhone"}'::jsonb,
         '10.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'),
        (user_uuid, 'login', 'Login from Mobile Device', 'You signed in from your mobile device',
         '{"location": "San Francisco, CA", "device": "Safari on iPhone"}'::jsonb,
         '10.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'),
        (user_uuid, 'logout', 'Account Logout', 'You signed out of your account',
         '{"device": "Chrome on Windows"}'::jsonb,
         '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 7. Cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@example.com';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.user_activities WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_sessions WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;