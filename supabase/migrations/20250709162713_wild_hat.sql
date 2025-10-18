/*
  # Fix contact inquiries RLS policy

  1. Security Updates
    - Drop existing INSERT policy that's not working correctly
    - Create new INSERT policy that properly allows anonymous and authenticated users to submit contact forms
    - Ensure the policy allows both anon and authenticated roles to insert contact inquiries

  This fixes the 403 error when submitting the contact form by ensuring the RLS policy
  properly allows insertions from both anonymous and authenticated users.
*/

-- Drop the existing policy that's causing issues
DROP POLICY IF EXISTS "Anyone can create inquiries" ON contact_inquiries;

-- Create a new policy that properly allows insertions
CREATE POLICY "Allow contact form submissions"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);