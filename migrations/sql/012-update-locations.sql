-- 012-update-locations.sql

-- Modify the phone column to VARCHAR(255)
ALTER TABLE locations 
ALTER COLUMN phone TYPE VARCHAR(255);

-- Add the court_type column
ALTER TABLE locations 
ADD COLUMN court_type VARCHAR(255);

-- Drop the is_indoor column
ALTER TABLE locations 
DROP COLUMN is_indoor;