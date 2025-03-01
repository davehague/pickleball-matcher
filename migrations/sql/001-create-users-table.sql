-- Migration: create-users-table

-- migrations/sql/001-users.sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample data
INSERT INTO users (email, name) VALUES 
    ('user1@example.com', 'User One'),
    ('user2@example.com', 'User Two'),
    ('user3@example.com', 'User Three')
ON CONFLICT (email) DO NOTHING;
