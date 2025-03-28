export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_FILE_TYPES = {
  CV: ['.pdf', '.doc', '.docx'],
  IMAGE: ['.jpg', '.jpeg', '.png'],
};

export const API_ENDPOINTS = {
  COVER_LETTER: 'https://shayldon.app.n8n.cloud/webhook-test/1c328895-2736-4acd-811c-e199dcbdb312',
  CV: 'https://shayldon.app.n8n.cloud/webhook-test/cv-optimizer',
  EMAIL: 'https://shayldon.app.n8n.cloud/webhook-test/email-preparer',
};

export const API_CONFIG = {
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

export const EXPERIENCE_LEVELS = [
  { value: 'entry-level', label: 'Entry Level' },
  { value: 'mid-level', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'executive', label: 'Executive' },
] as const;

export const EMAIL_TYPES = [
  { value: 'application', label: 'Job Application' },
  { value: 'followup', label: 'Interview Follow-up' },
  { value: 'networking', label: 'Networking' },
  { value: 'custom', label: 'Custom' },
] as const;

export const EMAIL_TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
] as const;

export const COVER_LETTER_TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'confident', label: 'Confident' },
] as const;

export const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Spanish', label: 'Spanish' },
] as const;

export const SERVICE_PLANS = {
  cv_optimizer: {
    free: {
      name: 'Basic CV Optimizer',
      price: 0,
      features: [
        'Basic CV analysis',
        '1 CV per month',
        'Standard templates',
        'Basic keyword optimization'
      ],
      limits: { monthly_cvs: 1 }
    },
    pro: {
      name: 'Professional CV Optimizer',
      price: 9.99,
      features: [
        'Advanced CV analysis',
        'Unlimited CVs',
        'Premium templates',
        'AI-powered optimization',
        'Industry-specific recommendations'
      ],
      limits: { monthly_cvs: -1 }
    },
    enterprise: {
      name: 'Enterprise CV Optimizer',
      price: 24.99,
      features: [
        'Everything in Pro',
        'Custom templates',
        'Team collaboration',
        'API access',
        'Priority support'
      ],
      limits: { monthly_cvs: -1 }
    }
  },
  cover_letter: {
    free: {
      name: 'Basic Cover Letter',
      price: 0,
      features: [
        'Basic templates',
        '1 cover letter per month',
        'Standard customization'
      ],
      limits: { monthly_letters: 1 }
    },
    pro: {
      name: 'Professional Cover Letter',
      price: 7.99,
      features: [
        'Advanced templates',
        'Unlimited cover letters',
        'AI-powered customization',
        'Multiple formats'
      ],
      limits: { monthly_letters: -1 }
    },
    enterprise: {
      name: 'Enterprise Cover Letter',
      price: 19.99,
      features: [
        'Everything in Pro',
        'Custom branding',
        'Team access',
        'Analytics'
      ],
      limits: { monthly_letters: -1 }
    }
  },
  email_preparer: {
    free: {
      name: 'Basic Email Preparer',
      price: 0,
      features: [
        'Basic templates',
        '2 emails per month',
        'Standard formatting'
      ],
      limits: { monthly_emails: 2 }
    },
    pro: {
      name: 'Professional Email Preparer',
      price: 5.99,
      features: [
        'Advanced templates',
        'Unlimited emails',
        'AI suggestions',
        'Follow-up tracking'
      ],
      limits: { monthly_emails: -1 }
    },
    enterprise: {
      name: 'Enterprise Email Preparer',
      price: 14.99,
      features: [
        'Everything in Pro',
        'Custom templates',
        'Team inbox',
        'Analytics'
      ],
      limits: { monthly_emails: -1 }
    }
  },
  interview_coach: {
    free: {
      name: 'Basic Interview Coach',
      price: 0,
      features: [
        'Basic practice sessions',
        '1 session per month',
        'Standard feedback'
      ],
      limits: { monthly_sessions: 1 }
    },
    pro: {
      name: 'Professional Interview Coach',
      price: 12.99,
      features: [
        'Advanced practice sessions',
        '10 sessions per month',
        'AI-powered feedback',
        'Industry-specific questions'
      ],
      limits: { monthly_sessions: 10 }
    },
    enterprise: {
      name: 'Enterprise Interview Coach',
      price: 29.99,
      features: [
        'Everything in Pro',
        'Unlimited sessions',
        'Custom scenarios',
        'Team training'
      ],
      limits: { monthly_sessions: -1 }
    }
  }
};

export const PACKAGE_PLANS = {
  free: {
    name: 'Free Package',
    price: 0,
    features: [
      'Basic access to all tools',
      'Limited monthly usage',
      'Community support'
    ]
  },
  pro: {
    name: 'Pro Package',
    price: 29.99, // Discounted from sum of individual pro plans
    features: [
      'Full access to all tools',
      'Unlimited usage of most features',
      'Priority support',
      'Save 20% vs. individual plans'
    ]
  },
  enterprise: {
    name: 'Enterprise Package',
    price: 79.99, // Discounted from sum of individual enterprise plans
    features: [
      'Everything in Pro package',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'Save 25% vs. individual plans'
    ]
  }
};

export const Z_INDICES = {
  header: 50,
  mobileNav: 100,
  modal: 200,
  toast: 300,
  tooltip: 400,
  dropdown: 50,
  overlay: 150
} as const;