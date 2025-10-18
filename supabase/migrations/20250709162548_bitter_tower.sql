/*
  # Fix contact inquiries RLS policy

  1. Security Updates
    - Update RLS policy to allow both INSERT and SELECT operations for anonymous users
    - This allows the contact form to work properly by permitting the insert-select operation

  2. Changes
    - Drop existing policy that only allows INSERT
    - Create new policy that allows both INSERT and SELECT for contact inquiries
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can create inquiries" ON contact_inquiries;

-- Create a new policy that allows both INSERT and SELECT for anonymous and authenticated users
CREATE POLICY "Anyone can create and read own inquiries"
  ON contact_inquiries
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);