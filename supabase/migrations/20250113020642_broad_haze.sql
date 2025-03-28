/*
  # Cover Letters Schema

  1. New Tables
    - `cover_letters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `company` (text)
      - `content` (text)
      - `job_title` (text)
      - `recipient` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on cover_letters table
    - Add policies for cover letter access and modification
*/

-- Create cover letters table
CREATE TABLE cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  content text NOT NULL,
  job_title text NOT NULL,
  recipient text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for updated_at
CREATE TRIGGER update_cover_letters_updated_at
  BEFORE UPDATE ON cover_letters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own cover letters"
  ON cover_letters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cover letters"
  ON cover_letters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cover letters"
  ON cover_letters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cover letters"
  ON cover_letters FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);