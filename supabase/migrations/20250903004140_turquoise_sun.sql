/*
  # Create enquiries table for contact form submissions

  1. New Tables
    - `enquiries`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `message` (text)
      - `image_url` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `enquiries` table
    - Add policy for public insert access
    - Add policy for admin read access
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  message text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit enquiries"
  ON enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read all enquiries"
  ON enquiries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );