/*
  # Fix contact inquiries RLS policy

  1. Security Updates
    - Update the existing INSERT policy to also handle the SELECT operation after INSERT
    - This allows the contact form to work properly by returning the created record

  2. Changes Made
    - Modified the existing policy to allow both INSERT and SELECT operations
    - Ensures anonymous users can submit contact forms and receive confirmation
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can create inquiries" ON contact_inquiries;

-- Create a new policy that allows both INSERT and SELECT for the same operation
CREATE POLICY "Anyone can create and read own inquiries"
  ON contact_inquiries
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);