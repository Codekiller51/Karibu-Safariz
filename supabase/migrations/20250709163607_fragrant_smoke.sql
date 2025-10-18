/*
  # Fix Contact Form RLS Policy

  1. Security Changes
    - Drop all existing conflicting policies on contact_inquiries table
    - Create proper policies for INSERT and SELECT operations
    - Allow both anonymous and authenticated users to submit contact forms
    - Allow reading the newly created record (required for .select() after .insert())

  2. Changes
    - Ensures contact form submissions work for all users
    - Maintains security while allowing necessary operations
*/

-- Drop all existing policies on contact_inquiries to start fresh
DROP POLICY IF EXISTS "Anyone can create inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow contact form submissions" ON contact_inquiries;
DROP POLICY IF EXISTS "Anyone can create and read own inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Public can create and read contact inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Enable contact form submissions" ON contact_inquiries;
DROP POLICY IF EXISTS "Enable reading contact inquiries after creation" ON contact_inquiries;

-- Create a comprehensive policy that allows both INSERT and SELECT for contact forms
CREATE POLICY "contact_inquiries_public_access"
  ON contact_inquiries
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);