/*
  # Create Content Management Tables

  1. New Tables
    - `contact_info` - For managing contact information
    - `team_members` - For managing team member profiles

  2. Security
    - Enable RLS on all tables
    - Add admin-only access policies
    - Public read access where appropriate
*/

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('email', 'phone', 'office_hours', 'response_time')),
  value text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  photo_url text,
  display_order integer NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create triggers for updated_at
CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contact_info
CREATE POLICY "Contact info is publicly readable"
  ON contact_info FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Only admins can modify contact info"
  ON contact_info
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Create RLS policies for team_members
CREATE POLICY "Team members are publicly readable when active"
  ON team_members FOR SELECT
  TO PUBLIC
  USING (active = true);

CREATE POLICY "Only admins can modify team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Insert initial contact info
INSERT INTO contact_info (type, value, display_order) VALUES
('email', 'support@aicareerpro.com', 1),
('office_hours', 'Monday - Friday: 9:00 AM - 6:00 PM EST\nSaturday: 10:00 AM - 4:00 PM EST\nSunday: Closed', 2),
('response_time', 'We aim to respond to all inquiries within 24 hours during business days.', 3);

-- Insert initial team members
INSERT INTO team_members (name, role, bio, photo_url, display_order) VALUES
(
  'Sarah Chen',
  'CEO & Founder',
  'With over 15 years of experience in career development and AI, Sarah leads our mission to revolutionize career advancement through technology.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  1
),
(
  'Michael Rodriguez',
  'CTO',
  'A pioneer in AI and machine learning, Michael oversees the development of our cutting-edge career advancement tools.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
  2
),
(
  'Emily Watson',
  'Head of AI',
  'Emily leads our AI research team, ensuring our tools provide the most accurate and helpful career guidance.',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
  3
),
(
  'James Park',
  'Head of Product',
  'James brings a decade of product management experience to ensure our tools meet real user needs.',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=256&h=256&q=80',
  4
);

-- Create indexes for performance
CREATE INDEX idx_contact_info_type ON contact_info(type);
CREATE INDEX idx_contact_info_display_order ON contact_info(display_order);
CREATE INDEX idx_team_members_active ON team_members(active);
CREATE INDEX idx_team_members_display_order ON team_members(display_order);