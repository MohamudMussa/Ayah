-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- 1. Go to your project > SQL Editor > New Query
-- 2. Paste this entire file and click "Run"

-- Create stats table
CREATE TABLE IF NOT EXISTS stats (
  id TEXT PRIMARY KEY DEFAULT 'global',
  views BIGINT NOT NULL DEFAULT 0,
  shares BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert the initial row
INSERT INTO stats (id, views, shares) VALUES ('global', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Create the increment function (atomic, safe for concurrent requests)
CREATE OR REPLACE FUNCTION increment_stat(stat_column TEXT)
RETURNS VOID AS $$
BEGIN
  IF stat_column = 'views' THEN
    UPDATE stats SET views = views + 1, updated_at = now() WHERE id = 'global';
  ELSIF stat_column = 'shares' THEN
    UPDATE stats SET shares = shares + 1, updated_at = now() WHERE id = 'global';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read stats (public data)
CREATE POLICY "Anyone can view stats"
  ON stats FOR SELECT
  USING (true);

-- Allow the anon key to call the increment function
GRANT EXECUTE ON FUNCTION increment_stat(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_stat(TEXT) TO authenticated;
