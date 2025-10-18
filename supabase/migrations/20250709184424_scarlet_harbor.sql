/*
# Update profiles table to ensure avatar_url column exists

1. Schema Changes
   - Ensure avatar_url column exists in profiles table
   - Add default value handling

2. Notes
   - This migration ensures the avatar_url column is properly configured
   - Existing data will not be affected
*/

-- Ensure avatar_url column exists (it should already exist based on the schema)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN avatar_url text;
    END IF;
END $$;

-- Update any existing profiles without avatar_url to have NULL (which is fine)
-- The application will handle the default avatar display