-- Run these commands in your Supabase SQL Editor to enable the new features:

-- 1. Add 'icon' column to 'habits' table
ALTER TABLE habits 
ADD COLUMN IF NOT EXISTS icon text;

-- 2. Add 'archived' column to 'habits' table (defaults to false)
ALTER TABLE habits 
ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

-- 3. (Optional) Update existing habits to have a default icon if needed (visual only)
-- UPDATE habits SET icon = 'activity' WHERE icon IS NULL;
