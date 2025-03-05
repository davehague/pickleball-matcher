TABLES (13)
================================================================================
TABLE: availability
Description: Calculates square of the correlation coefficient.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  user_id uuid NOT NULL
  week_starting date NOT NULL
  day_of_week bigint(64) NOT NULL
  hour_slot bigint(64) NOT NULL
  availability_type character varying(50) NOT NULL
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT availability_pkey PRIMARY KEY (id)

FOREIGN KEYS:
  CONSTRAINT availability_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON UPDATE NO ACTION ON DELETE CASCADE

UNIQUE CONSTRAINTS:
  CONSTRAINT availability_user_id_week_starting_day_of_week_hour_slot_key UNIQUE (user_id, week_starting, day_of_week, hour_slot)

CHECK CONSTRAINTS:
  CONSTRAINT check_day_of_week CHECK (day_of_week BETWEEN 0 AND 6)
  CONSTRAINT check_hour_slot CHECK (hour_slot BETWEEN 0 AND 23)

INDEXES:
  UNIQUE INDEX availability_pkey ON availability (id)
  UNIQUE INDEX availability_user_id_week_starting_day_of_week_hour_slot_key ON availability (user_id, week_starting, day_of_week, hour_slot)
  INDEX idx_availability_user_week ON availability (user_id, week_starting)

================================================================================

TABLE: chat_messages
Description: Calculates slope of the least-squares-fit linear equation determined by the (X, Y) pairs.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  group_id uuid NOT NULL
  user_id uuid NOT NULL
  message text NOT NULL
  created_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id)

FOREIGN KEYS:
  CONSTRAINT chat_messages_user_id_fkey_cascade FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON UPDATE NO ACTION ON DELETE CASCADE
  CONSTRAINT chat_messages_group_id_fkey FOREIGN KEY (group_id)
    REFERENCES public.groups (id)
    ON UPDATE NO ACTION ON DELETE CASCADE

INDEXES:
  UNIQUE INDEX chat_messages_pkey ON chat_messages (id)
  INDEX idx_chat_messages_created ON chat_messages (created_at)
  INDEX idx_chat_messages_group ON chat_messages (group_id)

================================================================================

TABLE: group_locations
Description: Calculates slope of the least-squares-fit linear equation determined by the (X, Y) pairs.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  group_id uuid NOT NULL
  location_id uuid NOT NULL
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT group_locations_pkey PRIMARY KEY (id)

FOREIGN KEYS:
  CONSTRAINT group_locations_location_id_fkey FOREIGN KEY (location_id)
    REFERENCES public.locations (id)
    ON UPDATE NO ACTION ON DELETE CASCADE
  CONSTRAINT group_locations_group_id_fkey FOREIGN KEY (group_id)
    REFERENCES public.groups (id)
    ON UPDATE NO ACTION ON DELETE CASCADE

UNIQUE CONSTRAINTS:
  CONSTRAINT group_locations_group_id_location_id_key UNIQUE (group_id, location_id)

INDEXES:
  UNIQUE INDEX group_locations_group_id_location_id_key ON group_locations (group_id, location_id)
  UNIQUE INDEX group_locations_pkey ON group_locations (id)

================================================================================

TABLE: group_members
Description: Calculates square of the correlation coefficient.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  group_id uuid NOT NULL
  user_id uuid NOT NULL
  is_admin boolean NOT NULL DEFAULT false
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT group_members_pkey PRIMARY KEY (id)

FOREIGN KEYS:
  CONSTRAINT group_members_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON UPDATE NO ACTION ON DELETE CASCADE
  CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id)
    REFERENCES public.groups (id)
    ON UPDATE NO ACTION ON DELETE CASCADE

UNIQUE CONSTRAINTS:
  CONSTRAINT group_members_group_id_user_id_key UNIQUE (group_id, user_id)

INDEXES:
  UNIQUE INDEX group_members_group_id_user_id_key ON group_members (group_id, user_id)
  UNIQUE INDEX group_members_pkey ON group_members (id)

================================================================================

TABLE: groups
Description: Calculates square of the correlation coefficient.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  name character varying(255) NOT NULL
  description text NULL
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT groups_pkey PRIMARY KEY (id)

INDEXES:
  UNIQUE INDEX groups_pkey ON groups (id)

================================================================================

TABLE: host_rotation
Description: Calculates square of the correlation coefficient.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  user_id uuid NOT NULL
  last_hosted_date date NULL
  hosting_count bigint(64) NOT NULL DEFAULT 0
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT host_rotation_pkey PRIMARY KEY (id)

FOREIGN KEYS:
  CONSTRAINT host_rotation_user_id_fkey_cascade FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON UPDATE NO ACTION ON DELETE CASCADE

UNIQUE CONSTRAINTS:
  CONSTRAINT host_rotation_user_id_key UNIQUE (user_id)

INDEXES:
  UNIQUE INDEX host_rotation_pkey ON host_rotation (id)
  UNIQUE INDEX host_rotation_user_id_key ON host_rotation (user_id)

================================================================================

TABLE: locations
Description: Calculates square of the correlation coefficient.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  name character varying(255) NOT NULL
  address character varying(255) NOT NULL
  phone character varying(20) NULL
  url character varying(255) NULL
  is_indoor boolean NOT NULL
  pricing_info text NULL
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT locations_pkey PRIMARY KEY (id)

INDEXES:
  UNIQUE INDEX locations_pkey ON locations (id)

================================================================================

TABLE: match_messages
Description: Calculates slope of the least-squares-fit linear equation determined by the (X, Y) pairs.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  match_id uuid NOT NULL
  user_id uuid NOT NULL
  message text NOT NULL
  created_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT match_messages_pkey PRIMARY KEY (id)

FOREIGN KEYS:
  CONSTRAINT match_messages_user_id_fkey_cascade FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON UPDATE NO ACTION ON DELETE CASCADE
  CONSTRAINT match_messages_match_id_fkey FOREIGN KEY (match_id)
    REFERENCES public.matches (id)
    ON UPDATE NO ACTION ON DELETE CASCADE

INDEXES:
  INDEX idx_match_messages_created ON match_messages (created_at)
  INDEX idx_match_messages_match ON match_messages (match_id)
  UNIQUE INDEX match_messages_pkey ON match_messages (id)

================================================================================

TABLE: match_players
Description: Calculates square of the correlation coefficient.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  match_id uuid NOT NULL
  user_id uuid NOT NULL
  confirmation_status character varying(50) NOT NULL
  is_substitute boolean NOT NULL DEFAULT false
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT match_players_pkey PRIMARY KEY (id)

FOREIGN KEYS:
  CONSTRAINT match_players_user_id_fkey_cascade FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON UPDATE NO ACTION ON DELETE CASCADE
  CONSTRAINT match_players_match_id_fkey FOREIGN KEY (match_id)
    REFERENCES public.matches (id)
    ON UPDATE NO ACTION ON DELETE CASCADE

UNIQUE CONSTRAINTS:
  CONSTRAINT match_players_match_id_user_id_key UNIQUE (match_id, user_id)

INDEXES:
  INDEX idx_match_players_match ON match_players (match_id)
  INDEX idx_match_players_user ON match_players (user_id)
  UNIQUE INDEX match_players_match_id_user_id_key ON match_players (match_id, user_id)
  UNIQUE INDEX match_players_pkey ON match_players (id)

================================================================================

TABLE: matches
Description: Calculates square of the correlation coefficient.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  location_id uuid NOT NULL
  date date NOT NULL
  time time without time zone NOT NULL
  status character varying(50) NOT NULL
  host_user_id uuid NULL
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT matches_pkey PRIMARY KEY (id)

FOREIGN KEYS:
  CONSTRAINT matches_host_user_id_fkey_cascade FOREIGN KEY (host_user_id)
    REFERENCES public.users (id)
    ON UPDATE NO ACTION ON DELETE CASCADE
  CONSTRAINT matches_location_id_fkey_cascade FOREIGN KEY (location_id)
    REFERENCES public.locations (id)
    ON UPDATE NO ACTION ON DELETE CASCADE

INDEXES:
  INDEX idx_matches_date_time ON matches (date, time)
  UNIQUE INDEX matches_pkey ON matches (id)

================================================================================

TABLE: migrations
Description: Calculates y-intercept of the least-squares-fit linear equation determined by the (X, Y) pairs.
--------------------------------------------------------------------------------
COLUMNS:
  id bigint(64) NOT NULL DEFAULT unique_rowid()
  name character varying(255) NOT NULL
  applied_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT migrations_pkey PRIMARY KEY (id)

UNIQUE CONSTRAINTS:
  CONSTRAINT migrations_name_key UNIQUE (name)

INDEXES:
  UNIQUE INDEX migrations_name_key ON migrations (name)
  UNIQUE INDEX migrations_pkey ON migrations (id)

================================================================================

TABLE: user_location_preferences
Description: Calculates square of the correlation coefficient.
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  user_id uuid NOT NULL
  location_id uuid NOT NULL
  preference character varying(50) NOT NULL
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()

PRIMARY KEY:
  CONSTRAINT user_location_preferences_pkey PRIMARY KEY (id)

FOREIGN KEYS:
  CONSTRAINT user_location_preferences_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON UPDATE NO ACTION ON DELETE CASCADE
  CONSTRAINT user_location_preferences_location_id_fkey FOREIGN KEY (location_id)
    REFERENCES public.locations (id)
    ON UPDATE NO ACTION ON DELETE CASCADE

UNIQUE CONSTRAINTS:
  CONSTRAINT user_location_preferences_user_id_location_id_key UNIQUE (user_id, location_id)

INDEXES:
  UNIQUE INDEX user_location_preferences_pkey ON user_location_preferences (id)
  UNIQUE INDEX user_location_preferences_user_id_location_id_key ON user_location_preferences (user_id, location_id)

================================================================================

TABLE: users
Description: User profiles with cascade delete enabled on all dependencies
--------------------------------------------------------------------------------
COLUMNS:
  id uuid NOT NULL DEFAULT gen_random_uuid()
  email character varying(255) NOT NULL
  name character varying(255) NOT NULL
  created_at timestamp with time zone NULL DEFAULT current_timestamp()
  updated_at timestamp with time zone NULL DEFAULT current_timestamp()
  phone character varying(20) NULL
  dupr_rating numeric(3,1) NULL
  notification_email boolean NULL DEFAULT true
  notification_text boolean NULL DEFAULT false
  play_frequency bigint(64) NULL DEFAULT 2
  avoid_consecutive_days boolean NULL DEFAULT false
  willing_to_substitute boolean NULL DEFAULT false
  picture character varying(255) NULL
  onboarding_completed boolean NULL DEFAULT false

PRIMARY KEY:
  CONSTRAINT users_pkey PRIMARY KEY (id)

UNIQUE CONSTRAINTS:
  CONSTRAINT users_email_key UNIQUE (email)

INDEXES:
  UNIQUE INDEX users_email_key ON users (email)
  UNIQUE INDEX users_pkey ON users (id)

================================================================================
