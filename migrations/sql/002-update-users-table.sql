-- 002-update-users-table.sql
ALTER TABLE users
ADD COLUMN phone VARCHAR(20),
ADD COLUMN dupr_rating DECIMAL(3,1),
ADD COLUMN notification_email BOOLEAN DEFAULT TRUE,
ADD COLUMN notification_text BOOLEAN DEFAULT FALSE,
ADD COLUMN play_frequency INTEGER DEFAULT 2,
ADD COLUMN avoid_consecutive_days BOOLEAN DEFAULT FALSE,
ADD COLUMN willing_to_substitute BOOLEAN DEFAULT FALSE;