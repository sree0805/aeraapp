-- Create transactions table
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  amount integer not null, -- stored in cents
  currency text not null default 'usd',
  status text not null, -- 'succeeded', 'pending', 'failed'
  stripe_payment_id text unique, -- stripe session id or pi id
  credits_added integer not null,
  plan_type text -- 'starter', 'pro'
);

-- Enable RLS
alter table transactions enable row level security;

-- Policies
create policy "Users can view their own transactions"
  on transactions for select
  using ( auth.uid() = user_id );

-- Only server can insert transactions, technically RLS not needed for service_role but good practice to just have view for users.
