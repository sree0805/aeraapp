-- FIX: Add missing INSERT policy for user_usage table
-- Run this in your Supabase SQL Editor to fix the "Billing system error"

create policy "Users can insert their own usage"
  on user_usage for insert
  with check ( auth.uid() = user_id );

-- Optional: Ensure transactions table is viewable
create policy "Users can view their own transactions"
  on transactions for select
  using ( auth.uid() = user_id );
