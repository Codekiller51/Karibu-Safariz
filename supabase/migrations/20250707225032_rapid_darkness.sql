/*
  # Fix user registration issues

  1. Database Functions
    - Create or update the handle_new_user function to properly create profiles
    - Ensure proper error handling and data validation

  2. Security
    - Update RLS policies to allow profile creation during registration
    - Ensure authenticated users can create their own profiles

  3. Triggers
    - Set up trigger to automatically create profile when user signs up
*/

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update RLS policies for profiles table
DROP POLICY IF EXISTS "Users can create own profile during registration" ON profiles;

CREATE POLICY "Users can create own profile during registration"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the profiles table allows null values for optional fields
DO $$
BEGIN
  -- Make avatar_url nullable if not already
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'avatar_url' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN avatar_url DROP NOT NULL;
  END IF;

  -- Make phone nullable if not already
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'phone' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN phone DROP NOT NULL;
  END IF;

  -- Make nationality nullable if not already
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'nationality' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN nationality DROP NOT NULL;
  END IF;
END $$;