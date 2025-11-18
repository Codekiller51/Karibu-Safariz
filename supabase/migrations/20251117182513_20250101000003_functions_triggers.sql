/*
  # Functions and Triggers

  ## Overview
  This migration creates database functions, triggers, and additional constraints
  for the Karibu Tours & Safariz application.

  ## Functions

  ### 1. handle_new_user()
  Automatically creates a user profile when a new user registers
  - Triggered after INSERT on auth.users
  - Creates corresponding profile record with user metadata
  - Includes error handling to prevent registration failures

  ## Triggers

  ### 1. on_auth_user_created
  Executes handle_new_user() function after user registration
  - Ensures profile is created for every new user
  - Maintains data consistency between auth and profiles

  ## Notes
  - All functions use SECURITY DEFINER for proper access control
  - Error handling prevents user registration failures
  - Triggers are idempotent and can be safely re-applied
*/

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
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
