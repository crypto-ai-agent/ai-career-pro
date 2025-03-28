/*
  # Add Service Configs Table
  
  This migration:
  1. Creates the service_configs table for storing service configurations
  2. Adds RLS policies for access control
  3. Inserts initial service configurations
*/

-- Create service_configs table
CREATE TABLE service_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  webhook_url text NOT NULL,
  input_fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  pricing jsonb NOT NULL DEFAULT '{
    "free": {"price": 0, "limits": {}},
    "pro": {"price": 0, "limits": {}},
    "enterprise": {"price": 0, "limits": {}}
  }'::jsonb,
  active boolean DEFAULT true,
  last_test_at timestamptz,
  last_test_status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger for updated_at
CREATE TRIGGER update_service_configs_updated_at
  BEFORE UPDATE ON service_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE service_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Service configs are publicly readable when active"
  ON service_configs FOR SELECT
  TO PUBLIC
  USING (active = true);

CREATE POLICY "Only admins can modify service configs"
  ON service_configs
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

-- Insert initial service configurations
INSERT INTO service_configs (slug, name, description, webhook_url, input_fields, pricing) VALUES
(
  'cv',
  'CV Optimizer',
  'AI-powered CV optimization and improvement suggestions',
  'https://shayldon.app.n8n.cloud/webhook-test/cv-optimizer',
  '[
    {
      "name": "currentCV",
      "type": "file",
      "required": true,
      "description": "Your current CV document"
    },
    {
      "name": "targetRole",
      "type": "text",
      "required": true,
      "description": "The role you are targeting"
    },
    {
      "name": "industry",
      "type": "text",
      "required": true,
      "description": "Your target industry"
    },
    {
      "name": "experienceLevel",
      "type": "select",
      "required": true,
      "description": "Your experience level",
      "options": ["entry-level", "mid-level", "senior", "executive"]
    },
    {
      "name": "keySkills",
      "type": "textarea",
      "required": true,
      "description": "Your key skills and competencies"
    }
  ]'::jsonb,
  '{
    "free": {
      "price": 0,
      "limits": {
        "monthly": 1
      }
    },
    "pro": {
      "price": 9.99,
      "limits": {
        "monthly": -1
      }
    },
    "enterprise": {
      "price": 24.99,
      "limits": {
        "monthly": -1
      }
    }
  }'::jsonb
),
(
  'cover-letter',
  'Cover Letter Generator',
  'Create personalized and compelling cover letters',
  'https://shayldon.app.n8n.cloud/webhook-test/1c328895-2736-4acd-811c-e199dcbdb312',
  '[
    {
      "name": "jobTitle",
      "type": "text",
      "required": true,
      "description": "The job title you are applying for"
    },
    {
      "name": "company",
      "type": "text",
      "required": true,
      "description": "The company you are applying to"
    },
    {
      "name": "keySkills",
      "type": "textarea",
      "required": true,
      "description": "Your relevant skills and experience"
    },
    {
      "name": "tone",
      "type": "select",
      "required": true,
      "description": "The tone of the letter",
      "options": ["professional", "enthusiastic", "confident"]
    }
  ]'::jsonb,
  '{
    "free": {
      "price": 0,
      "limits": {
        "monthly": 1
      }
    },
    "pro": {
      "price": 7.99,
      "limits": {
        "monthly": -1
      }
    },
    "enterprise": {
      "price": 19.99,
      "limits": {
        "monthly": -1
      }
    }
  }'::jsonb
),
(
  'email',
  'Email Preparer',
  'Draft professional emails for job applications',
  'https://shayldon.app.n8n.cloud/webhook-test/email-preparer',
  '[
    {
      "name": "emailType",
      "type": "select",
      "required": true,
      "description": "Type of email",
      "options": ["application", "followup", "networking", "custom"]
    },
    {
      "name": "recipient",
      "type": "text",
      "required": true,
      "description": "Email recipient"
    },
    {
      "name": "company",
      "type": "text",
      "required": true,
      "description": "Company name"
    },
    {
      "name": "context",
      "type": "textarea",
      "required": true,
      "description": "Email context and key points"
    }
  ]'::jsonb,
  '{
    "free": {
      "price": 0,
      "limits": {
        "monthly": 2
      }
    },
    "pro": {
      "price": 5.99,
      "limits": {
        "monthly": -1
      }
    },
    "enterprise": {
      "price": 14.99,
      "limits": {
        "monthly": -1
      }
    }
  }'::jsonb
),
(
  'interview',
  'Interview Coach',
  'Practice interviews with AI feedback',
  'https://shayldon.app.n8n.cloud/webhook-test/interview-coach',
  '[
    {
      "name": "interviewType",
      "type": "select",
      "required": true,
      "description": "Type of interview",
      "options": ["behavioral", "technical", "leadership", "role-specific"]
    },
    {
      "name": "role",
      "type": "text",
      "required": true,
      "description": "Target role"
    },
    {
      "name": "experienceLevel",
      "type": "select",
      "required": true,
      "description": "Your experience level",
      "options": ["entry-level", "mid-level", "senior", "executive"]
    }
  ]'::jsonb,
  '{
    "free": {
      "price": 0,
      "limits": {
        "monthly": 1
      }
    },
    "pro": {
      "price": 12.99,
      "limits": {
        "monthly": 10
      }
    },
    "enterprise": {
      "price": 29.99,
      "limits": {
        "monthly": -1
      }
    }
  }'::jsonb
);