# Pickleball Matcher Database Schema

This document describes the database schema for the Pickleball Matcher application. It includes details about each table, its purpose, columns, relationships, and the migration sequence.

## Table Overview

| Table Name                | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| users                     | Stores user profile information and preferences              |
| locations                 | Stores information about pickleball playing venues           |
| user_location_preferences | Maps users' preferences for different locations              |
| availability              | Stores users' weekly availability schedules                  |
| matches                   | Stores information about scheduled matches                   |
| match_players             | Junction table connecting matches with participating players |
| host_rotation             | Tracks hosting duties to ensure fair distribution            |
| groups                    | Stores information about player groups                       |
| group_members             | Maps users to groups with role information                   |
| chat_messages             | Stores group-wide messages                                   |
| match_messages            | Stores messages specific to a match                          |

## Table Details

### Users

**Purpose**: Store user profile data and preferences.

| Column                 | Type                     | Constraints               | Description                                |
| ---------------------- | ------------------------ | ------------------------- | ------------------------------------------ |
| id                     | UUID                     | PRIMARY KEY               | Unique identifier                          |
| email                  | VARCHAR(255)             | UNIQUE, NOT NULL          | User's email address                       |
| name                   | VARCHAR(255)             | NOT NULL                  | User's full name                           |
| phone                  | VARCHAR(20)              |                           | Phone number for text notifications        |
| dupr_rating            | DECIMAL(3,1)             |                           | Player's skill rating                      |
| notification_email     | BOOLEAN                  | DEFAULT TRUE              | Whether to send email notifications        |
| notification_text      | BOOLEAN                  | DEFAULT FALSE             | Whether to send text notifications         |
| play_frequency         | INTEGER                  | DEFAULT 2                 | Desired number of matches per week         |
| avoid_consecutive_days | BOOLEAN                  | DEFAULT FALSE             | Preference to avoid back-to-back play days |
| willing_to_substitute  | BOOLEAN                  | DEFAULT FALSE             | Willingness to be a substitute player      |
| created_at             | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Record creation time                       |
| updated_at             | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Record update time                         |

**Relationships**:

- One-to-many with `user_location_preferences`
- One-to-many with `availability`
- One-to-many with `match_players`
- One-to-one with `host_rotation`
- One-to-many with `group_members`

### Locations

**Purpose**: Store information about playing venues (facilities or public courts).

| Column       | Type                     | Constraints               | Description                               |
| ------------ | ------------------------ | ------------------------- | ----------------------------------------- |
| id           | UUID                     | PRIMARY KEY               | Unique identifier                         |
| name         | VARCHAR(255)             | NOT NULL                  | Name of the location                      |
| address      | VARCHAR(255)             | NOT NULL                  | Physical address                          |
| phone        | VARCHAR(20)              |                           | Contact phone number (optional)           |
| url          | VARCHAR(255)             |                           | Website URL (optional)                    |
| is_indoor    | BOOLEAN                  | NOT NULL                  | Whether the location is indoor or outdoor |
| pricing_info | TEXT                     |                           | Free-form field for pricing details       |
| created_at   | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Record creation time                      |
| updated_at   | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Record update time                        |

**Relationships**:

- One-to-many with `user_location_preferences`
- One-to-many with `matches`

### User Location Preferences

**Purpose**: Store each user's preferences for locations.

| Column      | Type                     | Constraints                        | Description                         |
| ----------- | ------------------------ | ---------------------------------- | ----------------------------------- |
| id          | UUID                     | PRIMARY KEY                        | Unique identifier                   |
| user_id     | UUID                     | NOT NULL, REFERENCES users(id)     | Foreign key to users                |
| location_id | UUID                     | NOT NULL, REFERENCES locations(id) | Foreign key to locations            |
| preference  | VARCHAR(50)              | NOT NULL                           | "Preferred", "OK", or "Do not want" |
| created_at  | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP          | Record creation time                |
| updated_at  | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP          | Record update time                  |

**Constraints**:

- UNIQUE(user_id, location_id) - Each user can have only one preference for a location

### Availability

**Purpose**: Store users' weekly availability slots.

| Column            | Type                     | Constraints                    | Description                             |
| ----------------- | ------------------------ | ------------------------------ | --------------------------------------- |
| id                | UUID                     | PRIMARY KEY                    | Unique identifier                       |
| user_id           | UUID                     | NOT NULL, REFERENCES users(id) | Foreign key to users                    |
| week_starting     | DATE                     | NOT NULL                       | Starting date of the week (Monday)      |
| day_of_week       | INTEGER                  | NOT NULL, CHECK (0-6)          | Day of the week (0=Monday, 6=Sunday)    |
| hour_slot         | INTEGER                  | NOT NULL, CHECK (0-23)         | Hour of the day (0-23)                  |
| availability_type | VARCHAR(50)              | NOT NULL                       | "Available", "Preferred", "Unavailable" |
| created_at        | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP      | Record creation time                    |
| updated_at        | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP      | Record update time                      |

**Constraints**:

- UNIQUE(user_id, week_starting, day_of_week, hour_slot) - Each time slot can have only one availability type
- CHECK (day_of_week BETWEEN 0 AND 6) - Valid days of the week
- CHECK (hour_slot BETWEEN 0 AND 23) - Valid hours of the day

**Indexes**:

- idx_availability_user_week ON (user_id, week_starting) - For efficient lookup of a user's weekly schedule

### Matches

**Purpose**: Store information about proposed and confirmed matches.

| Column       | Type                     | Constraints                        | Description                                       |
| ------------ | ------------------------ | ---------------------------------- | ------------------------------------------------- |
| id           | UUID                     | PRIMARY KEY                        | Unique identifier                                 |
| location_id  | UUID                     | NOT NULL, REFERENCES locations(id) | Foreign key to locations                          |
| date         | DATE                     | NOT NULL                           | Date of the match                                 |
| time         | TIME                     | NOT NULL                           | Start time of the match                           |
| status       | VARCHAR(50)              | NOT NULL                           | "Proposed", "Confirmed", "Completed", "Cancelled" |
| host_user_id | UUID                     | REFERENCES users(id)               | User responsible for court reservation            |
| created_at   | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP          | Record creation time                              |
| updated_at   | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP          | Record update time                                |

**Indexes**:

- idx_matches_date_time ON (date, time) - For efficient lookup by date and time

**Relationships**:

- Many-to-one with `locations`
- Many-to-one with `users` (host)
- One-to-many with `match_players`
- One-to-many with `match_messages`

### Match Players

**Purpose**: Junction table to connect matches with participating players.

| Column              | Type                     | Constraints                      | Description                         |
| ------------------- | ------------------------ | -------------------------------- | ----------------------------------- |
| id                  | UUID                     | PRIMARY KEY                      | Unique identifier                   |
| match_id            | UUID                     | NOT NULL, REFERENCES matches(id) | Foreign key to matches              |
| user_id             | UUID                     | NOT NULL, REFERENCES users(id)   | Foreign key to users                |
| confirmation_status | VARCHAR(50)              | NOT NULL                         | "Pending", "Confirmed", "Declined"  |
| is_substitute       | BOOLEAN                  | NOT NULL, DEFAULT FALSE          | Whether this player is a substitute |
| created_at          | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP        | Record creation time                |
| updated_at          | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP        | Record update time                  |

**Constraints**:

- UNIQUE(match_id, user_id) - Each user can be in a match only once

**Indexes**:

- idx_match_players_match ON (match_id) - For efficient lookup by match
- idx_match_players_user ON (user_id) - For efficient lookup by user

### Host Rotation

**Purpose**: Track hosting rotations to ensure fair distribution.

| Column           | Type                     | Constraints                            | Description                         |
| ---------------- | ------------------------ | -------------------------------------- | ----------------------------------- |
| id               | UUID                     | PRIMARY KEY                            | Unique identifier                   |
| user_id          | UUID                     | NOT NULL, REFERENCES users(id), UNIQUE | Foreign key to users                |
| last_hosted_date | DATE                     |                                        | Date when the user last hosted      |
| hosting_count    | INTEGER                  | NOT NULL, DEFAULT 0                    | Number of times the user has hosted |
| created_at       | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP              | Record creation time                |
| updated_at       | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP              | Record update time                  |

**Constraints**:

- UNIQUE(user_id) - Each user has only one host rotation record

### Groups

**Purpose**: Store information about player groups.

| Column      | Type                     | Constraints               | Description              |
| ----------- | ------------------------ | ------------------------- | ------------------------ |
| id          | UUID                     | PRIMARY KEY               | Unique identifier        |
| name        | VARCHAR(255)             | NOT NULL                  | Name of the group        |
| description | TEXT                     |                           | Description of the group |
| created_at  | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Record creation time     |
| updated_at  | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Record update time       |

**Relationships**:

- One-to-many with `group_members`
- One-to-many with `chat_messages`

### Group Members

**Purpose**: Junction table to connect users with groups.

| Column     | Type                     | Constraints                     | Description                                |
| ---------- | ------------------------ | ------------------------------- | ------------------------------------------ |
| id         | UUID                     | PRIMARY KEY                     | Unique identifier                          |
| group_id   | UUID                     | NOT NULL, REFERENCES groups(id) | Foreign key to groups                      |
| user_id    | UUID                     | NOT NULL, REFERENCES users(id)  | Foreign key to users                       |
| is_admin   | BOOLEAN                  | NOT NULL, DEFAULT FALSE         | Whether the user is an admin of this group |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP       | Record creation time                       |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP       | Record update time                         |

**Constraints**:

- UNIQUE(group_id, user_id) - Each user can be in a group only once

### Chat Messages

**Purpose**: Store group chat messages.

| Column     | Type                     | Constraints                     | Description            |
| ---------- | ------------------------ | ------------------------------- | ---------------------- |
| id         | UUID                     | PRIMARY KEY                     | Unique identifier      |
| group_id   | UUID                     | NOT NULL, REFERENCES groups(id) | Foreign key to groups  |
| user_id    | UUID                     | NOT NULL, REFERENCES users(id)  | Foreign key to users   |
| message    | TEXT                     | NOT NULL                        | Content of the message |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP       | Message timestamp      |

**Indexes**:

- idx_chat_messages_group ON (group_id) - For efficient lookup by group
- idx_chat_messages_created ON (created_at) - For efficient chronological sorting

### Match Messages

**Purpose**: Store messages specific to a match for coordination.

| Column     | Type                     | Constraints                      | Description            |
| ---------- | ------------------------ | -------------------------------- | ---------------------- |
| id         | UUID                     | PRIMARY KEY                      | Unique identifier      |
| match_id   | UUID                     | NOT NULL, REFERENCES matches(id) | Foreign key to matches |
| user_id    | UUID                     | NOT NULL, REFERENCES users(id)   | Foreign key to users   |
| message    | TEXT                     | NOT NULL                         | Content of the message |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP        | Message timestamp      |

**Indexes**:

- idx_match_messages_match ON (match_id) - For efficient lookup by match
- idx_match_messages_created ON (created_at) - For efficient chronological sorting

## Migration Sequence

The database schema is created through a series of migrations:

### Migration 1: Initial Users Table

- `001-create-users-table.sql`
- Creates the base users table with essential fields

### Migration 2: Update Users Table

- `002-update-users-table.sql`
- Adds additional user preference fields to the existing users table

### Migration 3: Locations and User Preferences

- `003-create-locations.sql`
- Creates the locations table
- Creates the user_location_preferences table
- Adds sample location data

### Migration 4: Availability Management

- `004-create-availability.sql`
- Creates the availability table for tracking weekly schedules
- Adds appropriate indexes and constraints

### Migration 5: Matches and Players

- `005-create-matches.sql`
- Creates the matches table
- Creates the match_players table
- Creates the host_rotation table
- Adds appropriate indexes and constraints

### Migration 6: Groups and Membership

- `006-create-groups.sql`
- Creates the groups table
- Creates the group_members table
- Adds a default group

### Migration 7: Communication System

- `007-create-messages.sql`
- Creates the chat_messages table
- Creates the match_messages table
- Adds appropriate indexes

## Database Queries and Operations

### Common Queries

#### Finding Available Players for a Time Slot

```sql
SELECT u.id, u.name, u.dupr_rating
FROM users u
JOIN availability a ON u.id = a.user_id
WHERE a.week_starting = '2023-09-04'  -- Week starting date
  AND a.day_of_week = 2              -- Wednesday (0=Monday)
  AND a.hour_slot = 18               -- 6 PM
  AND a.availability_type IN ('Available', 'Preferred')
  AND u.play_frequency > (
    SELECT COUNT(*) FROM match_players mp
    JOIN matches m ON mp.match_id = m.id
    WHERE mp.user_id = u.id
      AND m.date BETWEEN '2023-09-04' AND '2023-09-10'
      AND mp.confirmation_status = 'Confirmed'
  );
```

#### Finding Preferred Locations for a Group of Players

```sql
SELECT l.id, l.name, COUNT(*) as preferred_count
FROM locations l
JOIN user_location_preferences ulp ON l.id = ulp.location_id
WHERE ulp.user_id IN ('player1-uuid', 'player2-uuid', 'player3-uuid', 'player4-uuid')
  AND ulp.preference = 'Preferred'
GROUP BY l.id, l.name
ORDER BY preferred_count DESC;
```

#### Finding the Next Host in Rotation

```sql
SELECT u.id, u.name, hr.hosting_count, hr.last_hosted_date
FROM users u
JOIN host_rotation hr ON u.id = hr.user_id
ORDER BY
  COALESCE(hr.last_hosted_date, '1900-01-01'),
  hr.hosting_count
LIMIT 1;
```

## Maintenance and Administration

### Adding a New User to All Default Settings

```sql
-- Create user
INSERT INTO users (email, name, phone, dupr_rating)
VALUES ('new@example.com', 'New Player', '555-1234', 3.5);

-- Get the user's ID
DO $$
DECLARE
  user_id UUID := (SELECT id FROM users WHERE email = 'new@example.com');
  default_group_id UUID := (SELECT id FROM groups WHERE name = 'Primary Pickleball Group');
BEGIN
  -- Add to default group
  INSERT INTO group_members (group_id, user_id)
  VALUES (default_group_id, user_id);

  -- Create host rotation record
  INSERT INTO host_rotation (user_id, hosting_count)
  VALUES (user_id, 0);

  -- Set default location preferences for all locations
  INSERT INTO user_location_preferences (user_id, location_id, preference)
  SELECT user_id, id, 'OK' FROM locations;
END $$;
```

### Updating Tables That Need Timestamps

```sql
-- Create function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
  LOOP
    EXECUTE format('
      CREATE TRIGGER update_%I_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()',
      tbl, tbl);
  END LOOP;
END $$;
```

## Notes and Best Practices

1. **UUID Primary Keys**: All tables use UUID primary keys to facilitate distributed development and easier data merging.

2. **Timestamp Management**: Most tables include created_at and updated_at timestamps for audit and tracking purposes.

3. **Cascade Deletion**: Many foreign key constraints include ON DELETE CASCADE to maintain referential integrity.

4. **Indexes**: Strategic indexes are created for columns frequently used in WHERE clauses or joins.

5. **Database Constraints**: Appropriate CHECK and UNIQUE constraints help maintain data integrity.

6. **Naming Conventions**: Consistent naming conventions are used throughout the schema:

   - Table names: plural, lowercase, underscores for word separation
   - Column names: singular, lowercase, underscores for word separation
   - Index names: prefix idx\_, reference table and columns
   - Primary keys: name as "id" for consistency
   - Foreign keys: table_name_id pattern

7. **Default Values**: Sensible defaults are provided where appropriate to simplify application logic.
