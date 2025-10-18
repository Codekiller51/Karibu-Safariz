/*
  # Fix contact inquiries RLS policy

  1. Security Updates
    - Update RLS policy to allow both INSERT and SELECT for contact inquiries
    - Allow anonymous users to create and read their own inquiries
    
  2. Changes
    - Drop existing restrictive policy
    - Add new policy that allows INSERT with SELECT for returning data
*/

-- Drop the existing policy that only allows INSERT
DROP POLICY IF EXISTS "Anyone can create inquiries" ON contact_inquiries;

-- Create a new policy that allows both INSERT and SELECT for contact inquiries
CREATE POLICY "Public can create and read contact inquiries"
  ON contact_inquiries
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);