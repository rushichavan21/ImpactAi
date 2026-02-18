-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE task_category AS ENUM ('WORK', 'HEALTH', 'DEEP_WORK', 'CHORES', 'LEARNING', 'LEISURE');
CREATE TYPE slot_type AS ENUM ('BENCHMARK', 'ACTUAL');
CREATE TYPE slot_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'MISSED', 'SKIPPED');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}'::jsonb -- Stores energy levels, default start times, etc.
);

-- Days Table (One per user per date)
CREATE TABLE days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    summary TEXT, -- AI generated summary of the day intent
    day_score INTEGER, -- 0-100 calculated at EOD
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Tasks Table (The "What")
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id UUID REFERENCES days(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category task_category DEFAULT 'WORK',
    estimated_duration INTEGER NOT NULL, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedule Slots Table (The "When")
-- This is where the "Benchmark vs Actual" magic happens.
CREATE TABLE schedule_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    type slot_type NOT NULL, -- BENCHMARK (Plan) or ACTUAL (Reality)
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status slot_status DEFAULT 'PENDING',
    
    -- Only for ACTUAL slots
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    notes TEXT, -- "Why did I get distracted?"
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_days_user_date ON days(user_id, date);
CREATE INDEX idx_slots_task ON schedule_slots(task_id);
CREATE INDEX idx_slots_time ON schedule_slots(start_time, end_time);
