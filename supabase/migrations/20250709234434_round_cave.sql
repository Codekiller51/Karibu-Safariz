/*
  # Create Admin User

  1. New Users
    - Creates a new admin user with specified credentials
    - Sets admin privileges in the profiles table
  2. Security
    - Uses a direct insert approach for auth.users
    - Creates a placeholder password (will need to be reset)
    - Grants admin privileges in profiles table
*/

-- Create a function to insert admin user
CREATE OR REPLACE FUNCTION create_admin_user_simple()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := gen_random_uuid();
BEGIN
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'mailto@kilimanjarogates.com') THEN
    -- Get the existing user ID
    SELECT id INTO _user_id FROM auth.users WHERE email = 'mailto@kilimanjarogates.com';
    
    -- Update existing user to have admin privileges
    UPDATE public.profiles
    SET is_admin = true
    WHERE id = _user_id;
    
    RAISE NOTICE 'Existing user updated with admin privileges';
  ELSE
    -- Insert user into auth.users with explicit ID
    -- Note: We're using a placeholder for encrypted_password
    -- The user will need to use password reset functionality
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      _user_id,
      '00000000-0000-0000-0000-000000000000',
      'mailto@kilimanjarogates.com',
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Admin User"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
    
    -- Insert into profiles table with admin privileges
    INSERT INTO public.profiles (
      id,
      full_name,
      is_admin,
      created_at,
      updated_at
    ) VALUES (
      _user_id,
      'Admin User',
      true,
      now(),
      now()
    );
    
    -- Create a password reset token
    INSERT INTO auth.users_reset_tokens (
      user_id,
      token,
      created_at,
      expires_at
    ) VALUES (
      _user_id,
      encode(gen_random_bytes(32), 'hex'),
      now(),
      now() + interval '24 hours'
    );
    
    RAISE NOTICE 'Admin user created successfully with ID: %', _user_id;
  END IF;
END;
$$;

-- Execute the function to create the admin user
SELECT create_admin_user_simple();

-- Drop the function after use (for security)
DROP FUNCTION create_admin_user_simple();