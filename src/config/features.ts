/**
 * Feature flags configuration
 * Centralized management of feature flags for gradual rollouts
 */

export const FEATURES = {
  // Core Features
  ENABLE_EMAIL_TEMPLATES: true,
  ENABLE_API_MONITORING: true,
  ENABLE_USAGE_ANALYTICS: true,
  
  // New Features
  ENABLE_INTERVIEW_RECORDING: false,
  ENABLE_AI_FEEDBACK: false,
  ENABLE_TEAM_COLLABORATION: false,
  
  // Experimental Features
  ENABLE_BETA_FEATURES: false,
  ENABLE_EXPERIMENTAL_UI: false,
  
  // Maintenance
  MAINTENANCE_MODE: false,
  READ_ONLY_MODE: false,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURES[feature];
}

// Helper function to check if any maintenance mode is active
export function isMaintenanceActive(): boolean {
  return FEATURES.MAINTENANCE_MODE || FEATURES.READ_ONLY_MODE;
}