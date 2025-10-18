/*
  # Add is_admin field to profiles table

  1. New Fields
    - `is_admin` (boolean) - Flag to identify admin users
  2. Security
    - Only service_role can update the is_admin field
*/

-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create policy to allow service_role to update is_admin field
CREATE POLICY "Service role can update is_admin"
  ON profiles
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);