-- Add category and duration to tasks table
alter table tasks 
add column if not exists category text default 'work', -- work, rest, leisure
add column if not exists duration_minutes integer default 0;

-- Optional: Update existing rows if any
update tasks set category = 'work' where category is null;
update tasks set duration_minutes = 60 where duration_minutes is null;
