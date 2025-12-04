/*
  # Create uploads table for gallery images

  1. New Tables
    - `uploads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `file_name` (text)
      - `file_url` (text)
      - `file_size` (integer)
      - `file_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `uploads` table
    - Add policy for users to manage their own uploads
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own uploads"
  ON uploads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public read access to uploads"
  ON uploads
  FOR SELECT
  TO anon, authenticated
  USING (true);