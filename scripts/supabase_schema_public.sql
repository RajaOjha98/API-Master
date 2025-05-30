-- Alternative schema for public demo deployment
-- This allows public access without authentication for demonstration purposes

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

-- Insert sample data with proper MSTR- prefixed keys
INSERT INTO api_keys (description, key, added, expires, usage, limit)
VALUES 
  ('Admin panel', 'MSTR-a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', '22 July 2023', '22 July 2024', 342, 500),
  ('URLProfiler', 'MSTR-b2c3d4e5-f6g7-8901-b2c3-d4e5f6g78901', '8 July 2023', '8 July 2024', 127, 500),
  ('Custom app', 'MSTR-c3d4e5f6-g7h8-9012-c3d4-e5f6g7h89012', '12 June 2023', '12 June 2024', 0, 500),
  ('Test', 'MSTR-d4e5f6g7-h8i9-0123-d4e5-f6g7h8i90123', '5 May 2023', '5 May 2024', 286, 500);

-- Enable RLS but create a permissive policy for demo purposes
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for everyone (public access)
-- Note: In production, you should implement proper authentication and user-specific policies
CREATE POLICY "Public access for demo" 
  ON api_keys 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions to anonymous users for demo purposes
GRANT ALL ON api_keys TO anon;
GRANT ALL ON api_keys TO authenticated;
GRANT USAGE ON SEQUENCE api_keys_id_seq TO anon;
GRANT USAGE ON SEQUENCE api_keys_id_seq TO authenticated; 