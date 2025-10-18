/*
  # Fix contact inquiries RLS policy

  1. Security Updates
    - Drop existing INSERT policy for contact_inquiries table
    - Create new INSERT policy that properly allows anonymous and authenticated users to create inquiries
    - Ensure the policy has proper WITH CHECK clause for public contact form submissions

  2. Changes
    - Remove restrictive policy that may be blocking anonymous submissions
    - Add permissive policy that allows anyone to submit contact inquiries
    - Maintain security while enabling public contact form functionality
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can create inquiries" ON contact_inquiries;

-- Create new policy that allows anyone to insert contact inquiries
CREATE POLICY "Allow public contact form submissions"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);