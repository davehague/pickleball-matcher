-- 009-add-cascade-deletes.sql
-- Migration to add ON DELETE CASCADE to foreign key constraints that don't have it yet

-- Drop and recreate foreign key for host_rotation.user_id with a new constraint name
ALTER TABLE host_rotation
DROP CONSTRAINT IF EXISTS host_rotation_user_id_fkey;

ALTER TABLE host_rotation
ADD CONSTRAINT host_rotation_user_id_fkey_cascade
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Drop and recreate foreign key for matches.location_id with a new constraint name
ALTER TABLE matches
DROP CONSTRAINT IF EXISTS matches_location_id_fkey;

ALTER TABLE matches
ADD CONSTRAINT matches_location_id_fkey_cascade
FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE;

-- Drop and recreate foreign key for matches.host_user_id with a new constraint name
ALTER TABLE matches
DROP CONSTRAINT IF EXISTS matches_host_user_id_fkey;

ALTER TABLE matches
ADD CONSTRAINT matches_host_user_id_fkey_cascade
FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Drop and recreate foreign key for match_players.user_id with a new constraint name
ALTER TABLE match_players
DROP CONSTRAINT IF EXISTS match_players_user_id_fkey;

ALTER TABLE match_players
ADD CONSTRAINT match_players_user_id_fkey_cascade
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Drop and recreate foreign key for chat_messages.user_id with a new constraint name
ALTER TABLE chat_messages
DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey;

ALTER TABLE chat_messages
ADD CONSTRAINT chat_messages_user_id_fkey_cascade
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Drop and recreate foreign key for match_messages.user_id with a new constraint name
ALTER TABLE match_messages
DROP CONSTRAINT IF EXISTS match_messages_user_id_fkey;

ALTER TABLE match_messages
ADD CONSTRAINT match_messages_user_id_fkey_cascade
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add a helpful comment explaining the purpose of this migration
COMMENT ON TABLE users IS 'User profiles with cascade delete enabled on all dependencies';