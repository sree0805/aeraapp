-- Function to increment streak safely
create or replace function increment_streak(row_id bigint)
returns void as $$
begin
  update habits
  set streak = streak + 1
  where id = row_id;
end;
$$ language plpgsql;

-- Function to decrement streak safely
create or replace function decrement_streak(row_id bigint)
returns void as $$
begin
  update habits
  set streak = greatest(0, streak - 1)
  where id = row_id;
end;
$$ language plpgsql;
