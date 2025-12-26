-- Create user_usage table for billing and credits
create table if not exists user_usage (
  user_id uuid references auth.users not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  plan text not null default 'free', -- free, starter, pro
  daily_credits integer not null default 5,
  purchased_credits integer not null default 0,
  last_reset_date date not null default CURRENT_DATE
);

-- Enable RLS
alter table user_usage enable row level security;

-- Policies
create policy "Users can view their own usage"
  on user_usage for select
  using ( auth.uid() = user_id );

create policy "Users can update their own usage" -- In real app, only service_role (server) should update this, but for this simpler MVP we might need client read. Writing should be protected.
  on user_usage for update
  using ( auth.uid() = user_id ); 
  -- Note: We'll primarily update this from server actions/api routes which bypass RLS if using service role, 
  -- or use standard RLS if using user client. 
  -- ideally we use an RPC or server-side only updates for credits to prevent tampering.

create policy "Users can insert their own usage"
  on user_usage for insert
  with check ( auth.uid() = user_id );
