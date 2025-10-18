/*
  # Fix contact inquiries RLS policy

  1. Security Updates
    - Drop existing RLS policy that may be malformed
    - Create new RLS policy to allow anyone to create contact inquiries
    - Ensure both anonymous and authenticated users can submit contact forms

  This migration fixes the RLS policy issue preventing contact form submissions.
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can create inquiries" ON contact_inquiries;

-- Create new policy that allows both anonymous and authenticated users to insert
CREATE POLICY "Allow contact form submissions"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);