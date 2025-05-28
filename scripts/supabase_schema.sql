-- Drop the api_keys table if it exists
DROP TABLE IF EXISTS api_keys;

-- Create the api_keys table
CREATE TABLE api_keys (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  key TEXT NOT NULL,
  added TEXT NOT NULL,
  expires TEXT NOT NULL,
  usage INTEGER NOT NULL DEFAULT 0,
  limit INTEGER NOT NULL DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create an index on the key column for faster lookups
CREATE INDEX idx_api_keys_key ON api_keys(key);

-- Insert sample data
INSERT INTO api_keys (description, key, added, expires, usage, limit)
VALUES 
  ('Admin panel', '••••••••••••••••••••••••••••••••', '22 July 2023', '22 July 2024', 342, 500),
  ('URLProfiler', 'a6d64058-511e-45b9-87ac-dfae48b64b0e', '8 July 2023', '8 July 2024', 127, 500),
  ('Custom app', '••••••••••••••••••••••••••••••••', '12 June 2023', '12 June 2024', 0, 500),
  ('Test', '••••••••••••••••••••••••••••••••', '5 May 2023', '5 May 2024', 286, 500);

-- Create Row Level Security (RLS) policies
-- First enable RLS on the table
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Authenticated users can perform all operations" 
  ON api_keys 
  FOR ALL 
  TO authenticated 
  USING (true); 