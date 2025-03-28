/*
  # Achievement and Feedback Systems

  1. New Tables
    - `achievements`: Defines available achievements
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `requirements` (jsonb)
      - `points` (integer)
      - `icon` (text)
      - `tier` (text)
    
    - `user_achievements`: Tracks user progress
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievement_id` (uuid, references achievements)
      - `progress` (integer)
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `current_streak` (integer)

    - `user_feedback`: Stores user feedback
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `content` (text)
      - `status` (text)
      - `priority` (text)
      - `assigned_to` (uuid, references profiles)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Create achievements table
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('tool_usage', 'quality', 'streak', 'special')),
  requirements jsonb NOT NULL,
  points integer NOT NULL DEFAULT 0,
  icon text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  progress integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  current_streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create user_feedback table
CREATE TABLE user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('bug', 'feature', 'improvement', 'other')),
  content text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'resolved')) DEFAULT 'pending',
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  assigned_to uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create triggers for updated_at
CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at
  BEFORE UPDATE ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_feedback_updated_at
  BEFORE UPDATE ON user_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Achievements are readable by all authenticated users"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can submit feedback"
  ON user_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
  ON user_feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
  ON user_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can update feedback"
  ON user_feedback FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Create indexes for performance
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_completed ON user_achievements(completed);
CREATE INDEX idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX idx_user_feedback_status ON user_feedback(status);
CREATE INDEX idx_user_feedback_priority ON user_feedback(priority);

-- Insert initial achievements
INSERT INTO achievements (name, description, category, requirements, points, icon, tier) VALUES
(
  'CV Master',
  'Optimize 10 CVs',
  'tool_usage',
  '{"tool": "cv", "count": 10}',
  100,
  'FileText',
  'bronze'
),
(
  'Cover Letter Pro',
  'Generate 20 cover letters',
  'tool_usage',
  '{"tool": "cover_letter", "count": 20}',
  200,
  'MessageSquareText',
  'silver'
),
(
  'Interview Expert',
  'Complete 5 interview practice sessions with 90%+ score',
  'quality',
  '{"tool": "interview", "count": 5, "min_score": 90}',
  300,
  'UserRound',
  'gold'
),
(
  'Consistent Improver',
  'Use any tool for 5 consecutive days',
  'streak',
  '{"days": 5}',
  150,
  'TrendingUp',
  'silver'
),
(
  'Early Bird',
  'Join during the platform launch period',
  'special',
  '{"joined_before": "2024-12-31"}',
  50,
  'Star',
  'bronze'
);