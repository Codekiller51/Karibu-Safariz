/*
  # Add missing foreign key relationship between bookings and tour_packages

  1. Schema Updates
    - Add foreign key constraint between bookings.tour_id and tour_packages.id
    - This will enable Supabase to understand the relationship for joins

  2. Security
    - Maintain existing RLS policies
    - No changes to permissions
*/

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    -- Check if the foreign key constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'bookings_tour_id_fkey' 
        AND table_name = 'bookings'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE bookings 
        ADD CONSTRAINT bookings_tour_id_fkey 
        FOREIGN KEY (tour_id) REFERENCES tour_packages(id) ON DELETE RESTRICT;
    END IF;
END $$;

-- Create index for better performance on the foreign key
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id_fk ON bookings(tour_id);